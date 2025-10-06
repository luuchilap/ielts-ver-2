const Test = require('../models/Test');
const TestSubmission = require('../models/TestSubmission');

// @desc    Get all public tests with filtering and pagination
// @route   GET /api/tests
// @access  Public
exports.getTests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      difficulty,
      skills,
      search,
      category,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object for additional filters
    const additionalFilters = {};

    if (difficulty) {
      additionalFilters.difficulty = difficulty;
    }

    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
      additionalFilters.skills = { $in: skillsArray };
    }

    if (category) {
      additionalFilters.category = category;
    }

    // Text search
    if (search) {
      additionalFilters.$text = { $search: search };
    }

    // Sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Use the findPublic static method to get tests with correct status
    let query = Test.findPublic(additionalFilters);

    // Execute query with pagination
    const tests = await query
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-readingSections.passage -listeningSections.transcript -writingTasks.prompt -speakingParts.questions')
      .lean();

    // Get total count for pagination - also use findPublic for consistent counting
    const total = await Test.findPublic(additionalFilters).countDocuments();

    res.json({
      success: true,
      data: tests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tests'
    });
  }
};

// @desc    Get featured tests
// @route   GET /api/tests/featured
// @access  Public
exports.getFeaturedTests = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const tests = await Test.findFeatured(limit)
      .select('-readingSections.passage -listeningSections.transcript')
      .lean();

    res.json({
      success: true,
      data: tests
    });

  } catch (error) {
    console.error('Get featured tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get featured tests'
    });
  }
};

// @desc    Get popular tests
// @route   GET /api/tests/popular
// @access  Public
exports.getPopularTests = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const tests = await Test.findPopular(limit)
      .select('-readingSections.passage -listeningSections.transcript')
      .lean();

    res.json({
      success: true,
      data: tests
    });

  } catch (error) {
    console.error('Get popular tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get popular tests'
    });
  }
};

// @desc    Get test categories
// @route   GET /api/tests/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Test.findPublic().distinct('category');

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories'
    });
  }
};

// @desc    Get available skills
// @route   GET /api/tests/skills
// @access  Public
exports.getSkills = async (req, res) => {
  try {
    const skills = ['Reading', 'Listening', 'Writing', 'Speaking'];

    res.json({
      success: true,
      data: skills
    });

  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get skills'
    });
  }
};

// @desc    Get test details by ID
// @route   GET /api/tests/:testId
// @access  Public
exports.getTestById = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findPublic({ _id: testId }).findOne();

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Don't expose correct answers to non-authenticated users
    const testObj = test.toJSON();
    
    // Helper function to sanitize questions
    const sanitizeQuestions = (questions) => {
      return questions?.map(question => {
        const sanitizedContent = { ...question.content };
        
        // Remove answer-related fields to prevent cheating
        delete sanitizedContent.correctAnswer;
        delete sanitizedContent.correctAnswers;
        delete sanitizedContent.explanation;
        delete sanitizedContent.answer; // For true_false_not_given type
        delete sanitizedContent.correctMatching; // For matching types
        
        return {
          _id: question._id,
          id: question.id,
          type: question.type,
          order: question.order,
          timestamp: question.timestamp,
          points: question.points,
          timeLimit: question.timeLimit,
          difficulty: question.difficulty,
          content: sanitizedContent
        };
      }) || [];
    };
    
    // Handle both old and new structure
    const sanitizedTest = {
      ...testObj,
      // Old structure (compatibility)
      readingSections: (testObj.readingSections || testObj.reading?.sections)?.map(section => ({
        ...section,
        questions: sanitizeQuestions(section.questions)
      })),
      listeningSections: (testObj.listeningSections || testObj.listening?.sections)?.map(section => ({
        ...section,
        questions: sanitizeQuestions(section.questions)
      })),
      writingTasks: testObj.writingTasks || testObj.writing?.tasks,
      speakingParts: testObj.speakingParts || testObj.speaking?.parts,
      // New structure
      reading: testObj.reading ? {
        ...testObj.reading,
        sections: testObj.reading.sections?.map(section => ({
          ...section,
          questions: sanitizeQuestions(section.questions)
        }))
      } : undefined,
      listening: testObj.listening ? {
        ...testObj.listening,
        sections: testObj.listening.sections?.map(section => ({
          ...section,
          questions: sanitizeQuestions(section.questions)
        }))
      } : undefined,
      writing: testObj.writing,
      speaking: testObj.speaking
    };

    res.json({
      success: true,
      data: sanitizedTest
    });

  } catch (error) {
    console.error('Get test by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get test'
    });
  }
};

// @desc    Start a test (create submission)
// @route   POST /api/tests/:testId/start
// @access  Private
exports.startTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { forceRestart = false, selectedSkills = null } = req.body; // Allow force restart and skill selection
    const userId = req.user.id;

    // Check if test exists and is public
    const test = await Test.findPublic({ _id: testId }).findOne();

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found or not available'
      });
    }

    // Check if user has an active submission for this test
    const existingSubmission = await TestSubmission.findOne({
      testId,
      userId,
      status: { $in: ['in_progress', 'paused'] }
    });

    if (existingSubmission && !forceRestart) {
      // If user wants to continue existing submission, return it
      return res.status(200).json({
        success: true,
        message: 'Resuming existing test submission',
        data: existingSubmission,
        isResuming: true
      });
    }

    // If force restart is true, abandon the existing submission
    if (existingSubmission && forceRestart) {
      existingSubmission.status = 'abandoned';
      await existingSubmission.save();
    }

    // Determine which skills to include in this submission
    const availableSkills = test.skills || [];
    const skillsToTest = selectedSkills && selectedSkills.length > 0 
      ? selectedSkills.filter(skill => availableSkills.includes(skill))
      : availableSkills;

    if (skillsToTest.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid skills selected for this test'
      });
    }

    // Calculate total questions for selected skills
    let totalQuestions = 0;
    let duration = 0;

    skillsToTest.forEach(skill => {
      const skillLower = skill.toLowerCase();
      switch (skillLower) {
        case 'reading':
          const readingSections = test.readingSections || test.reading?.sections || [];
          totalQuestions += readingSections.reduce((sum, section) => sum + (section.questions?.length || 0), 0);
          duration += 60; // 60 minutes for reading
          break;
        case 'listening':
          const listeningSections = test.listeningSections || test.listening?.sections || [];
          totalQuestions += listeningSections.reduce((sum, section) => sum + (section.questions?.length || 0), 0);
          duration += 30; // 30 minutes for listening
          break;
        case 'writing':
          const writingTasks = test.writingTasks || test.writing?.tasks || [];
          totalQuestions += writingTasks.length;
          duration += 60; // 60 minutes for writing
          break;
        case 'speaking':
          const speakingParts = test.speakingParts || test.speaking?.parts || [];
          totalQuestions += speakingParts.length;
          duration += 15; // 15 minutes for speaking
          break;
      }
    });

    // If no skills selected, use the full test
    if (skillsToTest.length === availableSkills.length) {
      totalQuestions = test.totalQuestions;
      duration = test.duration || test.totalTime || 120;
    }

    // Create new submission
    const submission = new TestSubmission({
      testId,
      userId,
      startTime: new Date(),
      remainingTime: duration * 60, // Convert minutes to seconds
      currentSection: {
        skill: skillsToTest[0]?.toLowerCase(),
        sectionIndex: 0,
        questionIndex: 0
      },
      results: {
        totalQuestions: totalQuestions
      },
      // Add metadata for skill-specific tests
      metadata: {
        selectedSkills: skillsToTest,
        isSkillSpecific: skillsToTest.length < availableSkills.length
      }
    });

    await submission.save();

    // Update test statistics
    await test.updateStatistics(null, null, false);

    res.status(201).json({
      success: true,
      message: 'Test started successfully',
      data: submission
    });

  } catch (error) {
    console.error('Start test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start test'
    });
  }
};

// @desc    Get test preview
// @route   GET /api/tests/:testId/preview
// @access  Public
exports.getTestPreview = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findPublic({ _id: testId })
    .select('title description difficulty duration totalQuestions skills category statistics createdAt')
    .findOne()
    .lean();

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      data: test
    });

  } catch (error) {
    console.error('Get test preview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get test preview'
    });
  }
};

// @desc    Rate a test
// @route   POST /api/tests/:testId/rate
// @access  Private
exports.rateTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    // Check if test exists
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Check if user has completed this test
    const submission = await TestSubmission.findOne({
      testId,
      userId,
      status: 'completed'
    });

    if (!submission) {
      return res.status(403).json({
        success: false,
        message: 'You must complete the test before rating it'
      });
    }

    // Here you would typically save the rating to a separate Rating model
    // For now, we'll just return success
    
    res.json({
      success: true,
      message: 'Rating submitted successfully'
    });

  } catch (error) {
    console.error('Rate test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rate test'
    });
  }
};

// @desc    Get test ratings and reviews
// @route   GET /api/tests/:testId/ratings
// @access  Public
exports.getTestRatings = async (req, res) => {
  try {
    const { testId } = req.params;

    // This would typically fetch from a Rating model
    // For now, return mock data
    const ratings = {
      averageRating: 4.5,
      totalRatings: 120,
      distribution: {
        5: 60,
        4: 40,
        3: 15,
        2: 3,
        1: 2
      },
      reviews: []
    };

    res.json({
      success: true,
      data: ratings
    });

  } catch (error) {
    console.error('Get test ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get test ratings'
    });
  }
};

// @desc    Get test statistics
// @route   GET /api/tests/:testId/statistics
// @access  Public
exports.getTestStatistics = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findById(testId)
      .select('statistics')
      .lean();

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      data: test.statistics
    });

  } catch (error) {
    console.error('Get test statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get test statistics'
    });
  }
};
