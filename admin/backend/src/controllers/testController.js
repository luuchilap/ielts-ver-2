const { validationResult } = require('express-validator');
const Test = require('../models/Test');

// Get all tests with pagination and filtering
const getAllTests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      difficulty,
      search,
      skill,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Execute query
    const tests = await Test.find(filter)
      .populate('createdBy', 'firstName lastName email')
      .populate('lastModifiedBy', 'firstName lastName email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Test.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tests,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tests'
    });
  }
};

// Get test by ID
const getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const test = await Test.findById(id)
      .populate('createdBy', 'firstName lastName email')
      .populate('lastModifiedBy', 'firstName lastName email');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      data: { test }
    });
  } catch (error) {
    console.error('Get test by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test'
    });
  }
};

// Create new test
const createTest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const testData = {
      ...req.body,
      createdBy: req.user._id,
      lastModifiedBy: req.user._id
    };

    const test = new Test(testData);
    await test.save();

    await test.populate('createdBy', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      data: { test }
    });
  } catch (error) {
    console.error('Create test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test'
    });
  }
};

// Update test
const updateTest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = {
      ...req.body,
      lastModifiedBy: req.user._id
    };

    const test = await Test.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'firstName lastName email')
      .populate('lastModifiedBy', 'firstName lastName email');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      message: 'Test updated successfully',
      data: { test }
    });
  } catch (error) {
    console.error('Update test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update test'
    });
  }
};

// Delete test
const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const test = await Test.findByIdAndDelete(id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      message: 'Test deleted successfully'
    });
  } catch (error) {
    console.error('Delete test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete test'
    });
  }
};

// Duplicate test
const duplicateTest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const originalTest = await Test.findById(id);
    if (!originalTest) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    const duplicatedTest = new Test({
      ...originalTest.toObject(),
      _id: undefined,
      title: `${originalTest.title} (Copy)`,
      status: 'draft',
      createdBy: req.user._id,
      lastModifiedBy: req.user._id,
      createdAt: undefined,
      updatedAt: undefined
    });

    await duplicatedTest.save();
    await duplicatedTest.populate('createdBy', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Test duplicated successfully',
      data: { test: duplicatedTest }
    });
  } catch (error) {
    console.error('Duplicate test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate test'
    });
  }
};

// Change test status
const changeTestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const test = await Test.findByIdAndUpdate(
      id,
      { 
        status,
        lastModifiedBy: req.user._id
      },
      { new: true }
    )
      .populate('createdBy', 'firstName lastName email')
      .populate('lastModifiedBy', 'firstName lastName email');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      message: `Test ${status} successfully`,
      data: { test }
    });
  } catch (error) {
    console.error('Change test status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change test status'
    });
  }
};

// Get test statistics
const getTestStats = async (req, res) => {
  try {
    const stats = await Test.aggregate([
      {
        $group: {
          _id: null,
          totalTests: { $sum: 1 },
          publishedTests: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
          },
          draftTests: {
            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
          },
          archivedTests: {
            $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] }
          }
        }
      }
    ]);

    const skillStats = await Test.aggregate([
      {
        $project: {
          hasReading: { $gt: [{ $size: '$reading.sections' }, 0] },
          hasListening: { $gt: [{ $size: '$listening.sections' }, 0] },
          hasWriting: { $gt: [{ $size: '$writing.tasks' }, 0] },
          hasSpeaking: { $gt: [{ $size: '$speaking.parts' }, 0] }
        }
      },
      {
        $group: {
          _id: null,
          readingTests: { $sum: { $cond: ['$hasReading', 1, 0] } },
          listeningTests: { $sum: { $cond: ['$hasListening', 1, 0] } },
          writingTests: { $sum: { $cond: ['$hasWriting', 1, 0] } },
          speakingTests: { $sum: { $cond: ['$hasSpeaking', 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        general: stats[0] || {
          totalTests: 0,
          publishedTests: 0,
          draftTests: 0,
          archivedTests: 0
        },
        bySkill: skillStats[0] || {
          readingTests: 0,
          listeningTests: 0,
          writingTests: 0,
          speakingTests: 0
        }
      }
    });
  } catch (error) {
    console.error('Get test stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test statistics'
    });
  }
};

module.exports = {
  getAllTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
  duplicateTest,
  changeTestStatus,
  getTestStats
}; 