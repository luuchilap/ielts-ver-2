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
  
  // Matching information
  matchingInformation: {
    statements: [{ type: String, required: true }],
    paragraphs: [{ type: String, required: true }],
    correctMatching: [{
      statementIndex: Number,
      paragraphIndex: Number
    }],
    explanation: String
  },
  
  // Summary completion
  summaryCompletion: {
    summary: { type: String, required: true },
    gaps: [{
      position: Number,
      correctAnswers: [{ type: String, required: true }],
      maxWords: { type: Number, default: 1 }
    }],
    explanation: String
  },
  
  // Sentence completion
  sentenceCompletion: {
    sentences: [{
      sentence: { type: String, required: true },
      gap: { type: String, required: true },
      correctAnswers: [{ type: String, required: true }],
      maxWords: { type: Number, default: 1 }
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
  id: { type: String, required: true }, // Custom string ID for compatibility
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
  _id: false // Disable automatic ObjectId for compatibility
});

// Reading section schema
const readingSectionSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Custom string ID
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
  _id: false // Disable automatic ObjectId for compatibility
});

// Listening section schema
const listeningSectionSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Custom string ID
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
  _id: false // Disable automatic ObjectId for compatibility
});

// Writing task schema
const writingTaskSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Custom string ID
  taskNumber: {
    type: Number,
    enum: [1, 2],
    required: true
  },
  title: {
    type: String,
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
  sampleAnswer: String,
  criteria: [{
    name: { type: String, required: true },
    description: { type: String, required: true },
    maxScore: { type: Number, required: true }
  }]
}, {
  _id: false // Disable automatic ObjectId for compatibility
});

// Speaking part schema
const speakingPartSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Custom string ID
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
    id: { type: String, required: true }, // Custom string ID
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
  _id: false // Disable automatic ObjectId for compatibility
});

// Main test schema - Unified for both admin and client
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
      values: ['beginner', 'intermediate', 'advanced'],
      message: 'Difficulty must be beginner, intermediate, or advanced'
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
    enum: ['draft', 'published', 'archived', 'active'],
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
  isTemplate: {
    type: Boolean,
    default: false
  },
  tags: [String],
  category: {
    type: String,
    enum: ['Academic', 'General Training', 'Practice', 'Mock Test'],
    default: 'Practice'
  },
  
  // Test sections - Flat structure for flexibility
  readingSections: [readingSectionSchema],
  listeningSections: [listeningSectionSchema],
  writingTasks: [writingTaskSchema],
  speakingParts: [speakingPartSchema],
  
  // Legacy nested structure for backward compatibility
  reading: {
    sections: [readingSectionSchema],
    totalTime: { type: Number, default: 60 }
  },
  listening: {
    sections: [listeningSectionSchema],
    totalTime: { type: Number, default: 40 }
  },
  writing: {
    tasks: [writingTaskSchema],
    totalTime: { type: Number, default: 60 }
  },
  speaking: {
    parts: [speakingPartSchema],
    totalTime: { type: Number, default: 15 }
  },
  
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

// Indexes for better performance
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
  
  if (this.readingSections && this.readingSections.length > 0) {
    totalTime += this.readingSections.reduce((sum, section) => sum + section.suggestedTime, 0);
  } else if (this.reading && this.reading.sections) {
    totalTime += this.reading.sections.reduce((sum, section) => sum + section.suggestedTime, 0);
  }
  
  if (this.listeningSections && this.listeningSections.length > 0) {
    totalTime += this.listeningSections.reduce((sum, section) => sum + section.suggestedTime, 0);
  } else if (this.listening && this.listening.sections) {
    totalTime += this.listening.sections.reduce((sum, section) => sum + section.suggestedTime, 0);
  }
  
  if (this.writingTasks && this.writingTasks.length > 0) {
    totalTime += this.writingTasks.reduce((sum, task) => sum + task.suggestedTime, 0);
  } else if (this.writing && this.writing.tasks) {
    totalTime += this.writing.tasks.reduce((sum, task) => sum + task.suggestedTime, 0);
  }
  
  if (this.speakingParts && this.speakingParts.length > 0) {
    totalTime += this.speakingParts.reduce((sum, part) => sum + Math.ceil(part.speakingTime / 60), 0);
  } else if (this.speaking && this.speaking.parts) {
    totalTime += this.speaking.parts.reduce((sum, part) => sum + Math.ceil(part.speakingTime / 60), 0);
  }
  
  return totalTime;
});

// Virtual for total questions count
testSchema.virtual('questionCount').get(function() {
  let count = 0;
  
  if (this.readingSections && this.readingSections.length > 0) {
    count += this.readingSections.reduce((sum, section) => sum + section.questions.length, 0);
  } else if (this.reading && this.reading.sections) {
    count += this.reading.sections.reduce((sum, section) => sum + section.questions.length, 0);
  }
  
  if (this.listeningSections && this.listeningSections.length > 0) {
    count += this.listeningSections.reduce((sum, section) => sum + section.questions.length, 0);
  } else if (this.listening && this.listening.sections) {
    count += this.listening.sections.reduce((sum, section) => sum + section.questions.length, 0);
  }
  
  if (this.writingTasks && this.writingTasks.length > 0) {
    count += this.writingTasks.length;
  } else if (this.writing && this.writing.tasks) {
    count += this.writing.tasks.length;
  }
  
  if (this.speakingParts && this.speakingParts.length > 0) {
    count += this.speakingParts.reduce((sum, part) => sum + part.questions.length, 0);
  } else if (this.speaking && this.speaking.parts) {
    count += this.speaking.parts.reduce((sum, part) => sum + part.questions.length, 0);
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
    status: { $in: ['published', 'active'] }, 
    isPublic: true,
    ...filters
  });
};

// Static method to find featured tests
testSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ 
    status: { $in: ['published', 'active'] }, 
    isPublic: true,
    isFeatured: true
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Static method to find popular tests
testSchema.statics.findPopular = function(limit = 10) {
  return this.find({ 
    status: { $in: ['published', 'active'] }, 
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
  
  return this.save({ validateBeforeSave: false });
};

// Method to get unified test data (normalizes both old and new structures)
testSchema.methods.getUnifiedData = function() {
  const test = this.toObject();
  
  // Ensure we have the flat structure populated
  if (!test.readingSections && test.reading && test.reading.sections) {
    test.readingSections = test.reading.sections;
  }
  if (!test.listeningSections && test.listening && test.listening.sections) {
    test.listeningSections = test.listening.sections;
  }
  if (!test.writingTasks && test.writing && test.writing.tasks) {
    test.writingTasks = test.writing.tasks;
  }
  if (!test.speakingParts && test.speaking && test.speaking.parts) {
    test.speakingParts = test.speaking.parts;
  }
  
  return test;
};

module.exports = mongoose.model('Test', testSchema); 