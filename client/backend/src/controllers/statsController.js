const TestSubmission = require('../models/TestSubmission');
const Test = require('../models/Test');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get dashboard statistics for current user
// @route   GET /api/stats/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's test submission stats
    const userStats = await TestSubmission.getUserStats(userId);

    // Get recent activity (last 5 submissions)
    const recentActivity = await TestSubmission.find({ 
      userId, 
      status: 'completed' 
    })
    .populate('testId', 'title difficulty')
    .sort({ createdAt: -1 })
    .limit(5)
    .select('testId scores.overall createdAt totalTimeSpent')
    .lean();

    // Get progress chart data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const progressData = await TestSubmission.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: 'completed',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
          },
          averageScore: { $avg: "$scores.overall" },
          testCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    // Get skill breakdown
    const skillBreakdown = await TestSubmission.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          reading: { $avg: "$scores.reading" },
          listening: { $avg: "$scores.listening" },
          writing: { $avg: "$scores.writing" },
          speaking: { $avg: "$scores.speaking" }
        }
      }
    ]);

    const dashboardData = {
      totalTests: userStats.totalTests,
      completedTests: userStats.totalTests, // Same as totalTests since we only count completed
      averageScore: Math.round(userStats.averageScore * 10) / 10,
      recentActivity: recentActivity.map(activity => ({
        testTitle: activity.testId.title,
        difficulty: activity.testId.difficulty,
        score: activity.scores?.overall || 0,
        date: activity.createdAt,
        duration: Math.round(activity.totalTimeSpent / 60) // Convert to minutes
      })),
      progressChart: progressData.map(data => ({
        date: data._id.date,
        score: Math.round(data.averageScore * 10) / 10,
        testCount: data.testCount
      })),
      skillBreakdown: skillBreakdown[0] ? [
        { skill: 'Reading', score: Math.round(skillBreakdown[0].reading * 10) / 10 },
        { skill: 'Listening', score: Math.round(skillBreakdown[0].listening * 10) / 10 },
        { skill: 'Writing', score: Math.round(skillBreakdown[0].writing * 10) / 10 },
        { skill: 'Speaking', score: Math.round(skillBreakdown[0].speaking * 10) / 10 }
      ] : []
    };

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard statistics'
    });
  }
};

// @desc    Get user progress statistics
// @route   GET /api/stats/progress
// @access  Private
exports.getProgressStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeRange = '30d' } = req.query;

    // Calculate date range
    let dateFilter = new Date();
    switch (timeRange) {
      case '7d':
        dateFilter.setDate(dateFilter.getDate() - 7);
        break;
      case '30d':
        dateFilter.setDate(dateFilter.getDate() - 30);
        break;
      case '90d':
        dateFilter.setDate(dateFilter.getDate() - 90);
        break;
      case '1y':
        dateFilter.setFullYear(dateFilter.getFullYear() - 1);
        break;
      default:
        dateFilter.setDate(dateFilter.getDate() - 30);
    }

    // Get progress chart data
    const progressChart = await TestSubmission.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: 'completed',
          createdAt: { $gte: dateFilter }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
          },
          averageScore: { $avg: "$scores.overall" },
          testCount: { $sum: 1 },
          totalTime: { $sum: "$totalTimeSpent" }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    // Get skill progress over time
    const skillProgress = await TestSubmission.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: 'completed',
          createdAt: { $gte: dateFilter }
        }
      },
      {
        $group: {
          _id: {
            week: { $week: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          reading: { $avg: "$scores.reading" },
          listening: { $avg: "$scores.listening" },
          writing: { $avg: "$scores.writing" },
          speaking: { $avg: "$scores.speaking" }
        }
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } }
    ]);

    // Get overall platform averages for comparison
    const platformAverages = await TestSubmission.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: dateFilter }
        }
      },
      {
        $group: {
          _id: null,
          overallAverage: { $avg: "$scores.overall" },
          readingAverage: { $avg: "$scores.reading" },
          listeningAverage: { $avg: "$scores.listening" },
          writingAverage: { $avg: "$scores.writing" },
          speakingAverage: { $avg: "$scores.speaking" }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        progressChart: progressChart.map(data => ({
          date: data._id.date,
          score: Math.round(data.averageScore * 10) / 10,
          testCount: data.testCount,
          studyTime: Math.round(data.totalTime / 60) // Convert to minutes
        })),
        skillProgress: skillProgress.map(data => ({
          period: `${data._id.year}-W${data._id.week}`,
          reading: Math.round(data.reading * 10) / 10,
          listening: Math.round(data.listening * 10) / 10,
          writing: Math.round(data.writing * 10) / 10,
          speaking: Math.round(data.speaking * 10) / 10
        })),
        compareData: platformAverages[0] ? {
          overallAverage: Math.round(platformAverages[0].overallAverage * 10) / 10,
          readingAverage: Math.round(platformAverages[0].readingAverage * 10) / 10,
          listeningAverage: Math.round(platformAverages[0].listeningAverage * 10) / 10,
          writingAverage: Math.round(platformAverages[0].writingAverage * 10) / 10,
          speakingAverage: Math.round(platformAverages[0].speakingAverage * 10) / 10
        } : null
      }
    });

  } catch (error) {
    console.error('Get progress stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get progress statistics'
    });
  }
};

// @desc    Get detailed performance analytics
// @route   GET /api/stats/performance
// @access  Private
exports.getPerformanceStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get performance by difficulty level
    const difficultyPerformance = await TestSubmission.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: 'completed'
        }
      },
      {
        $lookup: {
          from: 'tests',
          localField: 'testId',
          foreignField: '_id',
          as: 'test'
        }
      },
      { $unwind: '$test' },
      {
        $group: {
          _id: '$test.difficulty',
          averageScore: { $avg: '$scores.overall' },
          testCount: { $sum: 1 },
          averageTime: { $avg: '$totalTimeSpent' }
        }
      }
    ]);

    // Get performance by test category
    const categoryPerformance = await TestSubmission.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: 'completed'
        }
      },
      {
        $lookup: {
          from: 'tests',
          localField: 'testId',
          foreignField: '_id',
          as: 'test'
        }
      },
      { $unwind: '$test' },
      {
        $group: {
          _id: '$test.category',
          averageScore: { $avg: '$scores.overall' },
          testCount: { $sum: 1 }
        }
      }
    ]);

    // Get improvement trend
    const improvementTrend = await TestSubmission.find({
      userId,
      status: 'completed'
    })
    .sort({ createdAt: 1 })
    .limit(10)
    .select('scores.overall createdAt')
    .lean();

    // Calculate improvement rate
    let improvementRate = 0;
    if (improvementTrend.length >= 2) {
      const firstScore = improvementTrend[0].scores?.overall || 0;
      const lastScore = improvementTrend[improvementTrend.length - 1].scores?.overall || 0;
      improvementRate = ((lastScore - firstScore) / firstScore) * 100;
    }

    res.json({
      success: true,
      data: {
        difficultyPerformance: difficultyPerformance.map(data => ({
          difficulty: data._id,
          averageScore: Math.round(data.averageScore * 10) / 10,
          testCount: data.testCount,
          averageTime: Math.round(data.averageTime / 60) // Convert to minutes
        })),
        categoryPerformance: categoryPerformance.map(data => ({
          category: data._id,
          averageScore: Math.round(data.averageScore * 10) / 10,
          testCount: data.testCount
        })),
        improvementTrend: improvementTrend.map(data => ({
          score: data.scores?.overall || 0,
          date: data.createdAt
        })),
        improvementRate: Math.round(improvementRate * 10) / 10
      }
    });

  } catch (error) {
    console.error('Get performance stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get performance statistics'
    });
  }
};

// @desc    Get leaderboard statistics
// @route   GET /api/stats/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    const { 
      skill = 'overall', 
      timeRange = '30d', 
      limit = 10 
    } = req.query;

    // Calculate date range
    let dateFilter = new Date();
    switch (timeRange) {
      case '7d':
        dateFilter.setDate(dateFilter.getDate() - 7);
        break;
      case '30d':
        dateFilter.setDate(dateFilter.getDate() - 30);
        break;
      case 'all':
        dateFilter = new Date('2020-01-01'); // Far back date
        break;
      default:
        dateFilter.setDate(dateFilter.getDate() - 30);
    }

    // Build aggregation pipeline
    const matchStage = {
      status: 'completed',
      createdAt: { $gte: dateFilter }
    };

    const groupStage = {
      _id: '$userId',
      testCount: { $sum: 1 }
    };

    // Add score field based on skill
    if (skill === 'overall') {
      groupStage.averageScore = { $avg: '$scores.overall' };
    } else {
      groupStage.averageScore = { $avg: `$scores.${skill}` };
    }

    const leaderboardData = await TestSubmission.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $match: { testCount: { $gte: 3 } } }, // Only users with at least 3 tests
      { $sort: { averageScore: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          country: '$user.country',
          level: '$user.level',
          averageScore: { $round: ['$averageScore', 1] },
          testCount: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: leaderboardData.map((entry, index) => ({
        rank: index + 1,
        ...entry
      }))
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get leaderboard'
    });
  }
};

// @desc    Get statistics for a specific test
// @route   GET /api/stats/test/:testId
// @access  Private
exports.getTestStats = async (req, res) => {
  try {
    const { testId } = req.params;
    const userId = req.user.id;

    // Get user's performance on this specific test
    const userSubmissions = await TestSubmission.find({
      testId,
      userId,
      status: 'completed'
    })
    .sort({ createdAt: -1 })
    .select('scores totalTimeSpent createdAt')
    .lean();

    // Get overall test statistics
    const testStats = await TestSubmission.aggregate([
      { $match: { testId: new mongoose.Types.ObjectId(testId), status: 'completed' } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          averageScore: { $avg: '$scores.overall' },
          averageTime: { $avg: '$totalTimeSpent' },
          highestScore: { $max: '$scores.overall' },
          lowestScore: { $min: '$scores.overall' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        userAttempts: userSubmissions.length,
        userBestScore: userSubmissions.length > 0 ? 
          Math.max(...userSubmissions.map(s => s.scores?.overall || 0)) : 0,
        userAverageScore: userSubmissions.length > 0 ?
          userSubmissions.reduce((sum, s) => sum + (s.scores?.overall || 0), 0) / userSubmissions.length : 0,
        userSubmissions: userSubmissions.map(submission => ({
          score: submission.scores?.overall || 0,
          timeSpent: Math.round(submission.totalTimeSpent / 60), // Convert to minutes
          date: submission.createdAt
        })),
        testOverallStats: testStats[0] ? {
          totalAttempts: testStats[0].totalAttempts,
          averageScore: Math.round(testStats[0].averageScore * 10) / 10,
          averageTime: Math.round(testStats[0].averageTime / 60), // Convert to minutes
          highestScore: Math.round(testStats[0].highestScore * 10) / 10,
          lowestScore: Math.round(testStats[0].lowestScore * 10) / 10
        } : null
      }
    });

  } catch (error) {
    console.error('Get test stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get test statistics'
    });
  }
};

// @desc    Compare user performance with averages
// @route   GET /api/stats/comparison
// @access  Private
exports.getComparisonStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's stats
    const userStats = await TestSubmission.getUserStats(userId);

    // Get stats for users at the same level
    const userLevel = req.user.level;
    const levelAverages = await User.aggregate([
      { $match: { level: userLevel } },
      {
        $lookup: {
          from: 'testsubmissions',
          localField: '_id',
          foreignField: 'userId',
          as: 'submissions'
        }
      },
      { $unwind: '$submissions' },
      { $match: { 'submissions.status': 'completed' } },
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$submissions.scores.overall' },
          averageTestCount: { $avg: { $size: '$submissions' } }
        }
      }
    ]);

    // Get global averages
    const globalAverages = await TestSubmission.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$scores.overall' },
          totalTests: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        user: {
          averageScore: Math.round(userStats.averageScore * 10) / 10,
          totalTests: userStats.totalTests,
          bestScore: Math.round(userStats.bestScore * 10) / 10
        },
        levelAverage: levelAverages[0] ? {
          averageScore: Math.round(levelAverages[0].averageScore * 10) / 10,
          level: userLevel
        } : null,
        globalAverage: globalAverages[0] ? {
          averageScore: Math.round(globalAverages[0].averageScore * 10) / 10,
          totalTests: globalAverages[0].totalTests,
          totalUsers: globalAverages[0].uniqueUsers.length
        } : null
      }
    });

  } catch (error) {
    console.error('Get comparison stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get comparison statistics'
    });
  }
};

// @desc    Get performance trends over time
// @route   GET /api/stats/trends
// @access  Private
exports.getTrendStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get monthly trends for the past year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const monthlyTrends = await TestSubmission.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: 'completed',
          createdAt: { $gte: oneYearAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          averageScore: { $avg: '$scores.overall' },
          testCount: { $sum: 1 },
          totalTime: { $sum: '$totalTimeSpent' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        monthlyTrends: monthlyTrends.map(data => ({
          period: `${data._id.year}-${String(data._id.month).padStart(2, '0')}`,
          averageScore: Math.round(data.averageScore * 10) / 10,
          testCount: data.testCount,
          studyTime: Math.round(data.totalTime / 60) // Convert to minutes
        }))
      }
    });

  } catch (error) {
    console.error('Get trend stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trend statistics'
    });
  }
};

// @desc    Get skill-specific statistics
// @route   GET /api/stats/skills
// @access  Private
exports.getSkillStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get skill breakdown with strengths and weaknesses
    const skillStats = await TestSubmission.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          reading: {
            average: { $avg: '$scores.reading' },
            best: { $max: '$scores.reading' },
            latest: { $last: '$scores.reading' },
            count: { $sum: { $cond: [{ $gt: ['$scores.reading', 0] }, 1, 0] } }
          },
          listening: {
            average: { $avg: '$scores.listening' },
            best: { $max: '$scores.listening' },
            latest: { $last: '$scores.listening' },
            count: { $sum: { $cond: [{ $gt: ['$scores.listening', 0] }, 1, 0] } }
          },
          writing: {
            average: { $avg: '$scores.writing' },
            best: { $max: '$scores.writing' },
            latest: { $last: '$scores.writing' },
            count: { $sum: { $cond: [{ $gt: ['$scores.writing', 0] }, 1, 0] } }
          },
          speaking: {
            average: { $avg: '$scores.speaking' },
            best: { $max: '$scores.speaking' },
            latest: { $last: '$scores.speaking' },
            count: { $sum: { $cond: [{ $gt: ['$scores.speaking', 0] }, 1, 0] } }
          }
        }
      }
    ]);

    const formatSkillData = (skillData) => ({
      average: Math.round(skillData.average * 10) / 10,
      best: Math.round(skillData.best * 10) / 10,
      latest: Math.round(skillData.latest * 10) / 10,
      testCount: skillData.count
    });

    res.json({
      success: true,
      data: skillStats[0] ? {
        reading: formatSkillData(skillStats[0].reading),
        listening: formatSkillData(skillStats[0].listening),
        writing: formatSkillData(skillStats[0].writing),
        speaking: formatSkillData(skillStats[0].speaking)
      } : {}
    });

  } catch (error) {
    console.error('Get skill stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get skill statistics'
    });
  }
};

// @desc    Get user achievements and badges
// @route   GET /api/stats/achievements
// @access  Private
exports.getAchievements = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user stats for achievement calculation
    const userStats = await TestSubmission.getUserStats(userId);
    
    // Define achievement criteria
    const achievements = [];

    // Test completion achievements
    if (userStats.totalTests >= 1) {
      achievements.push({
        id: 'first_test',
        title: 'First Steps',
        description: 'Complete your first test',
        icon: '🎯',
        earned: true,
        earnedAt: await TestSubmission.findOne({ 
          userId, 
          status: 'completed' 
        }).select('createdAt').lean().then(sub => sub?.createdAt)
      });
    }

    if (userStats.totalTests >= 10) {
      achievements.push({
        id: 'test_veteran',
        title: 'Test Veteran',
        description: 'Complete 10 tests',
        icon: '🏆',
        earned: true,
        earnedAt: null
      });
    }

    if (userStats.totalTests >= 50) {
      achievements.push({
        id: 'test_master',
        title: 'Test Master',
        description: 'Complete 50 tests',
        icon: '🥇',
        earned: true,
        earnedAt: null
      });
    }

    // Score achievements
    if (userStats.bestScore >= 7.0) {
      achievements.push({
        id: 'high_achiever',
        title: 'High Achiever',
        description: 'Score 7.0 or higher',
        icon: '⭐',
        earned: true,
        earnedAt: null
      });
    }

    if (userStats.bestScore >= 8.0) {
      achievements.push({
        id: 'excellence',
        title: 'Excellence',
        description: 'Score 8.0 or higher',
        icon: '💎',
        earned: true,
        earnedAt: null
      });
    }

    // Consistency achievements
    if (userStats.totalTests >= 5 && userStats.averageScore >= 6.5) {
      achievements.push({
        id: 'consistent_performer',
        title: 'Consistent Performer',
        description: 'Maintain average score of 6.5+ over 5 tests',
        icon: '📈',
        earned: true,
        earnedAt: null
      });
    }

    // Calculate progress towards next achievements
    const nextAchievements = [];

    if (userStats.totalTests < 10) {
      nextAchievements.push({
        id: 'test_veteran',
        title: 'Test Veteran',
        description: 'Complete 10 tests',
        icon: '🏆',
        progress: (userStats.totalTests / 10) * 100,
        current: userStats.totalTests,
        target: 10
      });
    }

    if (userStats.bestScore < 7.0) {
      nextAchievements.push({
        id: 'high_achiever',
        title: 'High Achiever',
        description: 'Score 7.0 or higher',
        icon: '⭐',
        progress: (userStats.bestScore / 7.0) * 100,
        current: userStats.bestScore,
        target: 7.0
      });
    }

    res.json({
      success: true,
      data: {
        achievements,
        nextAchievements,
        totalEarned: achievements.filter(a => a.earned).length,
        totalAvailable: achievements.length + nextAchievements.length
      }
    });

  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get achievements'
    });
  }
};
