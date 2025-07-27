const mongoose = require('mongoose');

// Question schemas for different types
const questionSchemas = {
  // Multiple choice single answer
  multipleChoiceSingle: {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
    explanation: String
  },
  
  // Multiple choice multiple answers
  multipleChoiceMultiple: {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    numberOfAnswers: { type: Number, required: true },
    correctAnswers: [{ type: Number, required: true }],
    explanation: String
  },
  
  // True/False/Not Given
  trueFalseNotGiven: {
    statement: { type: String, required: true },
    answer: { 
      type: String, 
      enum: ['True', 'False', 'Not Given'], 
      required: true 
    },
    explanation: String
  },
  
  // Fill in the blanks
  fillInBlanks: {
    sentence: { type: String, required: true },
    correctAnswers: [{ type: String, required: true }],
    maxWords: { type: Number, default: 1 },
    explanation: String
  },
  
  // Matching headings
  matchingHeadings: {
    headings: [{ type: String, required: true }],
    paragraphs: [{ type: String, required: true }],
    correctMatching: [{
      paragraphIndex: Number,
      headingIndex: Number
    }],
    explanation: String
  },
  
  // Short answer
  shortAnswer: {
    question: { type: String, required: true },
    correctAnswers: [{ type: String, required: true }],
    maxWords: { type: Number, default: 3 },
    explanation: String
  }
};

// Base question schema
const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'multiple_choice_single',
      'multiple_choice_multiple', 
      'true_false_not_given',
      'fill_in_blanks',
      'matching_headings',
      'matching_information',
      'summary_completion',
      'sentence_completion',
      'short_answer'
    ]
  },
  order: {
    type: Number,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  points: {
    type: Number,
    default: 1
  },
  timeLimit: Number, // in seconds
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  }
}, {
  _id: true
});

// Reading section schema
const readingSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  passage: {
    type: String,
    required: true
  },
  suggestedTime: {
    type: Number,
    required: true // in minutes
  },
  order: {
    type: Number,
    required: true
  },
  questions: [questionSchema]
}, {
  _id: true
});

// Listening section schema
const listeningSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  },
  transcript: String,
  suggestedTime: {
    type: Number,
    required: true // in minutes
  },
  order: {
    type: Number,
    required: true
  },
  questions: [questionSchema.add({
    timestamp: Number // Audio timestamp in seconds
  })]
}, {
  _id: true
});

// Writing task schema
const writingTaskSchema = new mongoose.Schema({
  taskNumber: {
    type: Number,
    enum: [1, 2],
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  imageUrl: String, // For Task 1 graphs/charts
  requirements: {
    type: String,
    required: true
  },
  suggestedTime: {
    type: Number,
    required: true // in minutes
  },
  wordLimit: {
    min: {
      type: Number,
      required: true
    },
    max: Number
  },
  criteria: [{
    name: { type: String, required: true },
    description: { type: String, required: true },
    maxScore: { type: Number, required: true }
  }]
}, {
  _id: true
});

// Speaking part schema
const speakingPartSchema = new mongoose.Schema({
  partNumber: {
    type: Number,
    enum: [1, 2, 3],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  questions: [{
    question: { type: String, required: true },
    audioUrl: String,
    cueCard: String, // For Part 2
    followUpQuestions: [String] // For Part 3
  }],
  preparationTime: Number, // seconds
  speakingTime: {
    type: Number,
    required: true // seconds
  }
}, {
  _id: true
});

// Main test schema
const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Test title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be longer than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Test description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot be longer than 1000 characters']
  },
  difficulty: {
    type: String,
    enum: {
      values: ['Beginner', 'Intermediate', 'Advanced'],
      message: 'Difficulty must be Beginner, Intermediate, or Advanced'
    },
    required: true
  },
  duration: {
    type: Number,
    required: [true, 'Test duration is required'] // total duration in minutes
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  skills: [{
    type: String,
    enum: ['Reading', 'Listening', 'Writing', 'Speaking'],
    required: true
  }],
  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'draft'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  category: {
    type: String,
    enum: ['Academic', 'General Training', 'Practice', 'Mock Test'],
    default: 'Practice'
  },
  
  // Test sections
  readingSections: [readingSectionSchema],
  listeningSections: [listeningSectionSchema],
  writingTasks: [writingTaskSchema],
  speakingParts: [speakingPartSchema],
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Statistics
  statistics: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    averageCompletionTime: {
      type: Number,
      default: 0 // in minutes
    },
    completionRate: {
      type: Number,
      default: 0 // percentage
    }
  },
  
  // Settings
  settings: {
    allowReview: {
      type: Boolean,
      default: true
    },
    showCorrectAnswers: {
      type: Boolean,
      default: true
    },
    allowPause: {
      type: Boolean,
      default: true
    },
    shuffleQuestions: {
      type: Boolean,
      default: false
    },
    timePerQuestion: Number, // seconds, if null then no limit per question
    passingScore: {
      type: Number,
      min: 0,
      max: 9,
      default: 7
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
testSchema.index({ title: 'text', description: 'text', tags: 'text' });
testSchema.index({ status: 1, isPublic: 1 });
testSchema.index({ difficulty: 1 });
testSchema.index({ skills: 1 });
testSchema.index({ isFeatured: -1, createdAt: -1 });
testSchema.index({ 'statistics.averageScore': -1 });
testSchema.index({ 'statistics.totalAttempts': -1 });
testSchema.index({ createdAt: -1 });

// Virtual for estimated completion time
testSchema.virtual('estimatedTime').get(function() {
  let totalTime = 0;
  
  if (this.readingSections) {
    totalTime += this.readingSections.reduce((sum, section) => sum + section.suggestedTime, 0);
  }
  if (this.listeningSections) {
    totalTime += this.listeningSections.reduce((sum, section) => sum + section.suggestedTime, 0);
  }
  if (this.writingTasks) {
    totalTime += this.writingTasks.reduce((sum, task) => sum + task.suggestedTime, 0);
  }
  if (this.speakingParts) {
    totalTime += this.speakingParts.reduce((sum, part) => sum + Math.ceil(part.speakingTime / 60), 0);
  }
  
  return totalTime;
});

// Virtual for total questions count
testSchema.virtual('questionCount').get(function() {
  let count = 0;
  
  if (this.readingSections) {
    count += this.readingSections.reduce((sum, section) => sum + section.questions.length, 0);
  }
  if (this.listeningSections) {
    count += this.listeningSections.reduce((sum, section) => sum + section.questions.length, 0);
  }
  if (this.writingTasks) {
    count += this.writingTasks.length;
  }
  if (this.speakingParts) {
    count += this.speakingParts.reduce((sum, part) => sum + part.questions.length, 0);
  }
  
  return count;
});

// Update totalQuestions before saving
testSchema.pre('save', function(next) {
  this.totalQuestions = this.questionCount;
  next();
});

// Static method to find public tests
testSchema.statics.findPublic = function(filters = {}) {
  return this.find({ 
    status: 'active', 
    isPublic: true,
    ...filters
  });
};

// Static method to find featured tests
testSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ 
    status: 'active', 
    isPublic: true,
    isFeatured: true
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Static method to find popular tests
testSchema.statics.findPopular = function(limit = 10) {
  return this.find({ 
    status: 'active', 
    isPublic: true
  })
  .sort({ 'statistics.totalAttempts': -1, 'statistics.averageScore': -1 })
  .limit(limit);
};

// Method to update statistics
testSchema.methods.updateStatistics = function(completionTime, score, completed = true) {
  const stats = this.statistics;
  
  if (completed) {
    stats.totalAttempts += 1;
    
    // Update average score
    if (score !== undefined && score !== null) {
      stats.averageScore = (
        (stats.averageScore * (stats.totalAttempts - 1) + score) / 
        stats.totalAttempts
      );
    }
    
    // Update average completion time
    if (completionTime) {
      stats.averageCompletionTime = (
        (stats.averageCompletionTime * (stats.totalAttempts - 1) + completionTime) / 
        stats.totalAttempts
      );
    }
  }
  
  // Completion rate will be calculated separately based on submissions
  
  return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('Test', testSchema);
