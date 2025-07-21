const mongoose = require('mongoose');

// Answer schemas for different question types
const answerSchemas = {
  // For reading and listening answers
  sectionAnswers: new mongoose.Schema({
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    answers: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Flexible to handle different answer types
      default: {}
    },
    timeSpent: {
      type: Number,
      default: 0 // in seconds
    },
    completed: {
      type: Boolean,
      default: false
    }
  }, { _id: false }),

  // For writing answers
  writingAnswer: new mongoose.Schema({
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    wordCount: {
      type: Number,
      required: true
    },
    timeSpent: {
      type: Number,
      default: 0 // in seconds
    },
    completed: {
      type: Boolean,
      default: false
    }
  }, { _id: false }),

  // For speaking answers
  speakingAnswer: new mongoose.Schema({
    partId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    questionAnswers: [{
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      audioUrl: String,
      duration: Number, // in seconds
      completed: {
        type: Boolean,
        default: false
      }
    }],
    timeSpent: {
      type: Number,
      default: 0 // in seconds
    },
    completed: {
      type: Boolean,
      default: false
    }
  }, { _id: false })
};

// Main submission schema
const testSubmissionSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: [true, 'Test ID is required'],
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: [true, 'User ID is required'],
    index: true
  },
  
  // Test answers organized by skill
  answers: {
    reading: [answerSchemas.sectionAnswers],
    listening: [answerSchemas.sectionAnswers],
    writing: [answerSchemas.writingAnswer],
    speaking: [answerSchemas.speakingAnswer]
  },
  
  // Timing information
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  totalTimeSpent: {
    type: Number,
    default: 0 // in seconds
  },
  remainingTime: {
    type: Number // in seconds, for tracking pause/resume
  },
  
  // Current progress
  currentSection: {
    skill: {
      type: String,
      enum: ['reading', 'listening', 'writing', 'speaking']
    },
    sectionIndex: {
      type: Number,
      default: 0
    },
    questionIndex: {
      type: Number,
      default: 0
    }
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['in_progress', 'paused', 'completed', 'abandoned', 'expired'],
    default: 'in_progress',
    index: true
  },
  
  // Scoring information
  scores: {
    reading: {
      type: Number,
      min: 0,
      max: 9
    },
    listening: {
      type: Number,
      min: 0,
      max: 9
    },
    writing: {
      type: Number,
      min: 0,
      max: 9
    },
    speaking: {
      type: Number,
      min: 0,
      max: 9
    },
    overall: {
      type: Number,
      min: 0,
      max: 9
    },
    breakdown: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  
  // Detailed results
  results: {
    correctAnswers: {
      type: Number,
      default: 0
    },
    totalQuestions: {
      type: Number,
      default: 0
    },
    skillBreakdown: {
      reading: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 }
      },
      listening: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 }
      },
      writing: {
        task1Score: Number,
        task2Score: Number,
        criteriaScores: {
          type: Map,
          of: Number
        }
      },
      speaking: {
        part1Score: Number,
        part2Score: Number,
        part3Score: Number,
        criteriaScores: {
          type: Map,
          of: Number
        }
      }
    },
    questionAnalysis: [{
      questionId: mongoose.Schema.Types.ObjectId,
      userAnswer: mongoose.Schema.Types.Mixed,
      correctAnswer: mongoose.Schema.Types.Mixed,
      isCorrect: Boolean,
      points: Number,
      timeSpent: Number
    }]
  },
  
  // Feedback and review
  feedback: {
    automated: {
      strengths: [String],
      weaknesses: [String],
      recommendations: [String]
    },
    manual: {
      examinerNotes: String,
      detailedFeedback: String,
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reviewedAt: Date
    }
  },
  
  // Technical metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    browserInfo: {
      name: String,
      version: String,
      os: String
    },
    deviceType: {
      type: String,
      enum: ['desktop', 'tablet', 'mobile'],
      default: 'desktop'
    },
    pauseCount: {
      type: Number,
      default: 0
    },
    resumeCount: {
      type: Number,
      default: 0
    },
    tabSwitches: {
      type: Number,
      default: 0
    },
    warnings: [String] // For tracking violations like tab switches
  },
  
  // Flags
  flags: {
    isReviewed: {
      type: Boolean,
      default: false
    },
    needsManualReview: {
      type: Boolean,
      default: false
    },
    hasTechnicalIssues: {
      type: Boolean,
      default: false
    },
    isValid: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
testSubmissionSchema.index({ testId: 1, userId: 1 });
testSubmissionSchema.index({ userId: 1, createdAt: -1 });
testSubmissionSchema.index({ status: 1 });
testSubmissionSchema.index({ startTime: 1 });
testSubmissionSchema.index({ 'scores.overall': -1 });
testSubmissionSchema.index({ createdAt: -1 });

// Compound indexes for efficient queries
testSubmissionSchema.index({ userId: 1, status: 1, createdAt: -1 });
testSubmissionSchema.index({ testId: 1, status: 1, createdAt: -1 });

// Virtual for completion percentage
testSubmissionSchema.virtual('completionPercentage').get(function() {
  if (!this.results.totalQuestions || this.results.totalQuestions === 0) {
    return 0;
  }
  
  let answeredQuestions = 0;
  
  // Count answered questions in reading
  if (this.answers.reading) {
    this.answers.reading.forEach(section => {
      answeredQuestions += section.answers.size || 0;
    });
  }
  
  // Count answered questions in listening
  if (this.answers.listening) {
    this.answers.listening.forEach(section => {
      answeredQuestions += section.answers.size || 0;
    });
  }
  
  // Count completed writing tasks
  if (this.answers.writing) {
    answeredQuestions += this.answers.writing.filter(task => task.completed).length;
  }
  
  // Count completed speaking parts
  if (this.answers.speaking) {
    this.answers.speaking.forEach(part => {
      answeredQuestions += part.questionAnswers.filter(q => q.completed).length;
    });
  }
  
  return Math.round((answeredQuestions / this.results.totalQuestions) * 100);
});

// Virtual for duration in minutes
testSubmissionSchema.virtual('durationMinutes').get(function() {
  if (!this.endTime || !this.startTime) {
    return 0;
  }
  return Math.round((this.endTime - this.startTime) / (1000 * 60));
});

// Virtual for time taken vs allowed
testSubmissionSchema.virtual('timeEfficiency').get(function() {
  if (!this.totalTimeSpent) return 0;
  
  // This would need to be calculated based on test duration
  // For now, return a placeholder
  return this.totalTimeSpent;
});

// Pre-save middleware to update completion status
testSubmissionSchema.pre('save', function(next) {
  // Auto-complete if all sections are completed
  if (this.status === 'in_progress') {
    const allCompleted = this.checkAllSectionsCompleted();
    if (allCompleted && !this.endTime) {
      this.status = 'completed';
      this.endTime = new Date();
    }
  }
  
  // Calculate total time spent
  if (this.endTime && this.startTime) {
    this.totalTimeSpent = Math.round((this.endTime - this.startTime) / 1000);
  }
  
  next();
});

// Instance method to check if all sections are completed
testSubmissionSchema.methods.checkAllSectionsCompleted = function() {
  // This would need to check against the actual test structure
  // For now, return false to prevent auto-completion
  return false;
};

// Instance method to calculate scores
testSubmissionSchema.methods.calculateScores = async function() {
  try {
    // Populate test data if not already populated
    if (!this.testId.readingSections) {
      await this.populate('testId');
    }
    
    const test = this.testId;
    const results = {
      reading: 0,
      listening: 0,
      writing: 0,
      speaking: 0,
      overall: 0,
      breakdown: {}
    };
    
    // Calculate reading score
    if (test.readingSections && this.answers.reading) {
      results.reading = this.calculateReadingScore(test.readingSections, this.answers.reading);
    }
    
    // Calculate listening score
    if (test.listeningSections && this.answers.listening) {
      results.listening = this.calculateListeningScore(test.listeningSections, this.answers.listening);
    }
    
    // Writing and speaking scores need manual review or AI scoring
    // For now, set to 0 or previous values
    results.writing = this.scores?.writing || 0;
    results.speaking = this.scores?.speaking || 0;
    
    // Calculate overall score (average of all skills with scores)
    const skillsWithScores = [results.reading, results.listening, results.writing, results.speaking]
      .filter(score => score > 0);
    
    if (skillsWithScores.length > 0) {
      results.overall = skillsWithScores.reduce((sum, score) => sum + score, 0) / skillsWithScores.length;
      results.overall = Math.round(results.overall * 2) / 2; // Round to nearest 0.5
    }
    
    this.scores = results;
    return results;
    
  } catch (error) {
    console.error('Error calculating scores:', error);
    throw error;
  }
};

// Helper method to calculate reading score
testSubmissionSchema.methods.calculateReadingScore = function(sections, answers) {
  let totalCorrect = 0;
  let totalQuestions = 0;
  
  sections.forEach((section, sectionIndex) => {
    const sectionAnswers = answers[sectionIndex];
    if (!sectionAnswers) return;
    
    section.questions.forEach((question, questionIndex) => {
      totalQuestions++;
      const userAnswer = sectionAnswers.answers.get(question._id.toString());
      
      if (this.isAnswerCorrect(question, userAnswer)) {
        totalCorrect++;
      }
    });
  });
  
  // Convert to IELTS band score (simplified conversion)
  const percentage = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
  return this.percentageToBandScore(percentage);
};

// Helper method to calculate listening score  
testSubmissionSchema.methods.calculateListeningScore = function(sections, answers) {
  // Similar to reading score calculation
  return this.calculateReadingScore(sections, answers);
};

// Helper method to check if answer is correct
testSubmissionSchema.methods.isAnswerCorrect = function(question, userAnswer) {
  if (!userAnswer || userAnswer === '' || userAnswer === null) return false;
  
  const content = question.content;
  
  switch (question.type) {
    case 'multiple_choice_single':
      return userAnswer === content.correctAnswer;
      
    case 'multiple_choice_multiple':
      if (!Array.isArray(userAnswer)) return false;
      return userAnswer.length === content.correctAnswers.length &&
             userAnswer.every(answer => content.correctAnswers.includes(answer));
             
    case 'true_false_not_given':
      return userAnswer.toLowerCase() === content.answer.toLowerCase();
      
    case 'fill_in_blanks':
    case 'short_answer':
      const normalizedUser = userAnswer.toString().toLowerCase().trim();
      return content.correctAnswers.some(correct => 
        correct.toLowerCase().trim() === normalizedUser
      );
      
    default:
      return false;
  }
};

// Helper method to convert percentage to band score
testSubmissionSchema.methods.percentageToBandScore = function(percentage) {
  if (percentage >= 95) return 9;
  if (percentage >= 90) return 8.5;
  if (percentage >= 85) return 8;
  if (percentage >= 80) return 7.5;
  if (percentage >= 75) return 7;
  if (percentage >= 70) return 6.5;
  if (percentage >= 65) return 6;
  if (percentage >= 55) return 5.5;
  if (percentage >= 45) return 5;
  if (percentage >= 35) return 4.5;
  if (percentage >= 25) return 4;
  if (percentage >= 15) return 3.5;
  if (percentage >= 10) return 3;
  if (percentage >= 5) return 2.5;
  if (percentage > 0) return 2;
  return 1;
};

// Static method to find user submissions
testSubmissionSchema.statics.findByUser = function(userId, filters = {}) {
  return this.find({ 
    userId,
    ...filters
  }).populate('testId', 'title difficulty duration skills');
};

// Static method to get user statistics
testSubmissionSchema.statics.getUserStats = async function(userId) {
  const pipeline = [
    { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'completed' } },
    {
      $group: {
        _id: null,
        totalTests: { $sum: 1 },
        averageScore: { $avg: '$scores.overall' },
        bestScore: { $max: '$scores.overall' },
        totalTimeSpent: { $sum: '$totalTimeSpent' },
        averageReadingScore: { $avg: '$scores.reading' },
        averageListeningScore: { $avg: '$scores.listening' },
        averageWritingScore: { $avg: '$scores.writing' },
        averageSpeakingScore: { $avg: '$scores.speaking' }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalTests: 0,
    averageScore: 0,
    bestScore: 0,
    totalTimeSpent: 0,
    averageReadingScore: 0,
    averageListeningScore: 0,
    averageWritingScore: 0,
    averageSpeakingScore: 0
  };
};

module.exports = mongoose.model('TestSubmission', testSubmissionSchema);
