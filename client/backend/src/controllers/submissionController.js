const TestSubmission = require('../models/TestSubmission');
const Test = require('../models/Test');
const { sendEmail } = require('../utils/email');

// @desc    Get current user's test submissions
// @route   GET /api/submissions/my
// @access  Private
exports.getMySubmissions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      testId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const userId = req.user.id;

    // Build filter
    const filter = { userId };
    
    if (status) {
      filter.status = status;
    }
    
    if (testId) {
      filter.testId = testId;
    }

    // Sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const submissions = await TestSubmission.find(filter)
      .populate('testId', 'title difficulty duration skills category')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const total = await TestSubmission.countDocuments(filter);

    res.json({
      success: true,
      data: submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get my submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get submissions'
    });
  }
};

// @desc    Get submission details by ID
// @route   GET /api/submissions/:submissionId
// @access  Private
exports.getSubmissionById = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user.id;

    const submission = await TestSubmission.findOne({
      _id: submissionId,
      userId
    }).populate('testId');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.json({
      success: true,
      data: submission
    });

  } catch (error) {
    console.error('Get submission by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get submission'
    });
  }
};

// @desc    Save test progress
// @route   PUT /api/submissions/:submissionId/progress
// @access  Private
exports.saveProgress = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { answers, currentSection, currentQuestion, timeSpent } = req.body;
    const userId = req.user.id;

    const submission = await TestSubmission.findOne({
      _id: submissionId,
      userId,
      status: { $in: ['in_progress', 'paused'] }
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Active submission not found'
      });
    }

    // Update submission with progress
    const updates = {};
    
    if (answers) {
      updates.answers = { ...submission.answers, ...answers };
    }
    
    if (currentSection !== undefined) {
      updates['currentSection.sectionIndex'] = currentSection;
    }
    
    if (currentQuestion !== undefined) {
      updates['currentSection.questionIndex'] = currentQuestion;
    }
    
    if (timeSpent !== undefined) {
      updates.totalTimeSpent = timeSpent;
      // Update remaining time if test has a time limit
      if (submission.remainingTime) {
        updates.remainingTime = Math.max(0, submission.remainingTime - timeSpent);
      }
    }

    const updatedSubmission = await TestSubmission.findByIdAndUpdate(
      submissionId,
      { $set: updates },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Progress saved successfully',
      data: updatedSubmission
    });

  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save progress'
    });
  }
};

// @desc    Submit completed test
// @route   POST /api/submissions/:submissionId/submit
// @access  Private
exports.submitTest = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { answers, timeSpent } = req.body;
    const userId = req.user.id;

    const submission = await TestSubmission.findOne({
      _id: submissionId,
      userId,
      status: { $in: ['in_progress', 'paused'] }
    }).populate('testId');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Active submission not found'
      });
    }

    // Update submission with final answers
    submission.answers = { ...submission.answers, ...answers };
    submission.status = 'completed';
    submission.endTime = new Date();
    
    if (timeSpent) {
      submission.totalTimeSpent = timeSpent;
    }

    // Calculate scores
    const scores = await submission.calculateScores();

    // Save submission
    await submission.save();

    // Update test statistics
    const completionTimeMinutes = Math.round(submission.totalTimeSpent / 60);
    await submission.testId.updateStatistics(completionTimeMinutes, scores.overall, true);

    // Update user statistics
    await req.user.updateStatistics(scores);

    // Send completion email if user has email notifications enabled
    if (req.user.preferences?.notifications?.email) {
      try {
        await sendEmail({
          to: req.user.email,
          template: 'testCompletion',
          data: {
            name: req.user.firstName,
            testTitle: submission.testId.title,
            overallScore: scores.overall || 'Pending',
            completionTime: `${completionTimeMinutes} minutes`,
            skillScores: scores,
            resultsUrl: `${process.env.FRONTEND_URL}/results/${submission._id}`
          }
        });
      } catch (emailError) {
        console.error('Failed to send completion email:', emailError);
        // Don't fail the submission if email fails
      }
    }

    res.json({
      success: true,
      message: 'Test submitted successfully',
      data: {
        submission,
        scores
      }
    });

  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit test'
    });
  }
};

// @desc    Pause test submission
// @route   PUT /api/submissions/:submissionId/pause
// @access  Private
exports.pauseSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user.id;

    const submission = await TestSubmission.findOne({
      _id: submissionId,
      userId,
      status: 'in_progress'
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Active submission not found'
      });
    }

    submission.status = 'paused';
    submission.metadata.pauseCount += 1;
    await submission.save();

    res.json({
      success: true,
      message: 'Test paused successfully',
      data: submission
    });

  } catch (error) {
    console.error('Pause submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to pause test'
    });
  }
};

// @desc    Resume paused test submission
// @route   PUT /api/submissions/:submissionId/resume
// @access  Private
exports.resumeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user.id;

    const submission = await TestSubmission.findOne({
      _id: submissionId,
      userId,
      status: 'paused'
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Paused submission not found'
      });
    }

    submission.status = 'in_progress';
    submission.metadata.resumeCount += 1;
    await submission.save();

    res.json({
      success: true,
      message: 'Test resumed successfully',
      data: submission
    });

  } catch (error) {
    console.error('Resume submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resume test'
    });
  }
};

// @desc    Delete test submission
// @route   DELETE /api/submissions/:submissionId
// @access  Private
exports.deleteSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user.id;

    const submission = await TestSubmission.findOne({
      _id: submissionId,
      userId,
      status: { $in: ['in_progress', 'paused'] } // Only allow deletion of non-completed tests
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Active submission not found or cannot be deleted'
      });
    }

    await TestSubmission.findByIdAndDelete(submissionId);

    res.json({
      success: true,
      message: 'Submission deleted successfully'
    });

  } catch (error) {
    console.error('Delete submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete submission'
    });
  }
};

// @desc    Get detailed test results
// @route   GET /api/submissions/:submissionId/results
// @access  Private
exports.getSubmissionResults = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user.id;

    const submission = await TestSubmission.findOne({
      _id: submissionId,
      userId,
      status: 'completed'
    }).populate('testId');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Completed submission not found'
      });
    }

    // Prepare detailed results with correct answers (only for completed tests)
    const detailedResults = {
      submission,
      correctAnswers: {},
      explanations: {}
    };

    // Add correct answers and explanations for review
    const test = submission.testId;
    
    if (test.readingSections) {
      detailedResults.correctAnswers.reading = test.readingSections.map(section => ({
        sectionId: section._id,
        questions: section.questions.map(question => ({
          questionId: question._id,
          correctAnswer: question.content.correctAnswer || question.content.correctAnswers,
          explanation: question.content.explanation
        }))
      }));
    }

    if (test.listeningSections) {
      detailedResults.correctAnswers.listening = test.listeningSections.map(section => ({
        sectionId: section._id,
        questions: section.questions.map(question => ({
          questionId: question._id,
          correctAnswer: question.content.correctAnswer || question.content.correctAnswers,
          explanation: question.content.explanation
        }))
      }));
    }

    res.json({
      success: true,
      data: detailedResults
    });

  } catch (error) {
    console.error('Get submission results error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get submission results'
    });
  }
};

// @desc    Request manual review for writing/speaking
// @route   POST /api/submissions/:submissionId/request-review
// @access  Private
exports.requestManualReview = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user.id;

    const submission = await TestSubmission.findOne({
      _id: submissionId,
      userId,
      status: 'completed'
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Completed submission not found'
      });
    }

    // Check if already reviewed or review already requested
    if (submission.flags.isReviewed) {
      return res.status(400).json({
        success: false,
        message: 'This submission has already been reviewed'
      });
    }

    if (submission.flags.needsManualReview) {
      return res.status(400).json({
        success: false,
        message: 'Manual review has already been requested'
      });
    }

    // Mark for manual review
    submission.flags.needsManualReview = true;
    await submission.save();

    res.json({
      success: true,
      message: 'Manual review requested successfully'
    });

  } catch (error) {
    console.error('Request manual review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to request manual review'
    });
  }
};

// @desc    Get feedback for submission
// @route   GET /api/submissions/:submissionId/feedback
// @access  Private
exports.getFeedback = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user.id;

    const submission = await TestSubmission.findOne({
      _id: submissionId,
      userId,
      status: 'completed'
    }).select('feedback scores results');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Completed submission not found'
      });
    }

    res.json({
      success: true,
      data: {
        feedback: submission.feedback,
        scores: submission.scores,
        results: submission.results
      }
    });

  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get feedback'
    });
  }
};

// @desc    Report technical issue with submission
// @route   POST /api/submissions/:submissionId/report-issue
// @access  Private
exports.reportIssue = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { issueType, description, severity = 'medium' } = req.body;
    const userId = req.user.id;

    const submission = await TestSubmission.findOne({
      _id: submissionId,
      userId
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Add to metadata warnings
    const issueReport = `${issueType}: ${description} (Severity: ${severity})`;
    submission.metadata.warnings = submission.metadata.warnings || [];
    submission.metadata.warnings.push(issueReport);
    submission.flags.hasTechnicalIssues = true;

    await submission.save();

    // In a real application, you might also log this to a separate issues collection
    // or send alerts to administrators

    res.json({
      success: true,
      message: 'Issue reported successfully'
    });

  } catch (error) {
    console.error('Report issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report issue'
    });
  }
};
