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

    // Build filter object
    const filter = {
      status: 'active',
      isPublic: true
    };

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
      filter.skills = { $in: skillsArray };
    }

    if (category) {
      filter.category = category;
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const testsData = await Test.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Process tests to ensure unified structure and remove sensitive data
    const tests = testsData.map(test => {
      // Create a Test object to use the getUnifiedData method
      const testObj = new Test(test);
      const unifiedTest = testObj.getUnifiedData();
      
      // Remove sensitive content for list view
      return {
        ...unifiedTest,
        readingSections: unifiedTest.readingSections?.map(section => ({
          ...section,
          passage: undefined, // Remove passage content
          questions: section.questions?.map(q => ({ ...q, content: undefined }))
        })),
        listeningSections: unifiedTest.listeningSections?.map(section => ({
          ...section,
          transcript: undefined, // Remove transcript
          questions: section.questions?.map(q => ({ ...q, content: undefined }))
        })),
        writingTasks: unifiedTest.writingTasks?.map(task => ({
          ...task,
          prompt: undefined // Remove prompt
        })),
        speakingParts: unifiedTest.speakingParts?.map(part => ({
          ...part,
          questions: undefined // Remove questions
        }))
      };
    });

    // Get total count for pagination
    const total = await Test.countDocuments(filter);

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

    const testsData = await Test.findFeatured(limit)
      .lean();

    // Process tests to ensure unified structure and remove sensitive data
    const tests = testsData.map(test => {
      // Create a Test object to use the getUnifiedData method
      const testObj = new Test(test);
      const unifiedTest = testObj.getUnifiedData();
      
      // Remove sensitive content for list view
      return {
        ...unifiedTest,
        readingSections: unifiedTest.readingSections?.map(section => ({
          ...section,
          passage: undefined // Remove passage content
        })),
        listeningSections: unifiedTest.listeningSections?.map(section => ({
          ...section,
          transcript: undefined // Remove transcript
        }))
      };
    });

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

    const testsData = await Test.findPopular(limit)
      .lean();

    // Process tests to ensure unified structure and remove sensitive data
    const tests = testsData.map(test => {
      // Create a Test object to use the getUnifiedData method
      const testObj = new Test(test);
      const unifiedTest = testObj.getUnifiedData();
      
      // Remove sensitive content for list view
      return {
        ...unifiedTest,
        readingSections: unifiedTest.readingSections?.map(section => ({
          ...section,
          passage: undefined // Remove passage content
        })),
        listeningSections: unifiedTest.listeningSections?.map(section => ({
          ...section,
          transcript: undefined // Remove transcript
        }))
      };
    });

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
    const categories = await Test.distinct('category', { 
      status: 'active', 
      isPublic: true 
    });

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

    const test = await Test.findOne({
      _id: testId,
      status: 'active',
      isPublic: true
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Get unified test data (converts legacy structure to flat structure if needed)
    const unifiedTest = test.getUnifiedData();

    // Don't expose correct answers to non-authenticated users
    const sanitizedTest = {
      ...unifiedTest,
      readingSections: unifiedTest.readingSections?.map(section => ({
        ...section,
        questions: section.questions?.map(question => ({
          _id: question._id,
          id: question.id,
          type: question.type,
          order: question.order,
          content: {
            ...question.content,
            correctAnswer: undefined,
            correctAnswers: undefined,
            explanation: undefined
          }
        }))
      })),
      listeningSections: unifiedTest.listeningSections?.map(section => ({
        ...section,
        questions: section.questions?.map(question => ({
          _id: question._id,
          id: question.id,
          type: question.type,
          order: question.order,
          timestamp: question.timestamp,
          content: {
            ...question.content,
            correctAnswer: undefined,
            correctAnswers: undefined,
            explanation: undefined
          }
        }))
      }))
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
    const userId = req.user.id;

    // Check if test exists and is active
    const test = await Test.findOne({
      _id: testId,
      status: 'active',
      isPublic: true
    });

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

    if (existingSubmission) {
      return res.status(409).json({
        success: false,
        message: 'You already have an active submission for this test',
        data: { submissionId: existingSubmission._id }
      });
    }

    // Create new submission
    const submission = new TestSubmission({
      testId,
      userId,
      startTime: new Date(),
      remainingTime: test.duration * 60, // Convert minutes to seconds
      currentSection: {
        skill: test.skills[0]?.toLowerCase(),
        sectionIndex: 0,
        questionIndex: 0
      },
      results: {
        totalQuestions: test.totalQuestions
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

    const test = await Test.findOne({
      _id: testId,
      status: 'active',
      isPublic: true
    })
    .select('title description difficulty duration totalQuestions skills category statistics createdAt')
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
