const mongoose = require('mongoose');

// Question content schemas for different types
const questionContentSchemas = {
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
    items: [{ type: String, required: true }],
    options: [{ type: String, required: true }],
    correctMatching: [{
      itemIndex: Number,
      optionIndex: Number
    }],
    explanation: String
  },
  
  // Summary completion
  summaryCompletion: {
    summary: { type: String, required: true },
    blanks: [{
      position: Number,
      correctAnswers: [String]
    }],
    wordBank: [String],
    explanation: String
  },
  
  // Sentence completion
  sentenceCompletion: {
    sentence: { type: String, required: true },
    correctAnswers: [{ type: String, required: true }],
    maxWords: { type: Number, default: 3 },
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
  id: { type: String, required: true }, // Custom string ID for easier reference
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
      'short_answer',
      // Frontend variants (with hyphens) - for compatibility
      'multiple-choice-single',
      'multiple-choice-multiple',
      'true-false-not-given',
      'fill-in-blank',
      'matching-headings',
      'matching-information',
      'summary-completion',
      'sentence-completion',
      'short-answer'
    ],
    set: function(value) {
      // Normalize hyphen variants to underscore variants
      const hyphenToUnderscore = {
        'multiple-choice-single': 'multiple_choice_single',
        'multiple-choice-multiple': 'multiple_choice_multiple',
        'true-false-not-given': 'true_false_not_given',
        'fill-in-blank': 'fill_in_blanks',
        'matching-headings': 'matching_headings',
        'matching-information': 'matching_information',
        'summary-completion': 'summary_completion',
        'sentence-completion': 'sentence_completion',
        'short-answer': 'short_answer'
      };
      return hyphenToUnderscore[value] || value;
    }
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
  },
  // For listening questions
  timestamp: Number // Audio timestamp in seconds
}, {
  _id: false // Use custom id instead of ObjectId
});

// Reading section schema
const readingSectionSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Custom string ID
  title: { type: String, required: true },
  passage: { type: String, default: '' }, // Allow empty passage during editing
  suggestedTime: { type: Number, default: 20 }, // minutes
  order: { type: Number, required: true },
  questions: [questionSchema]
}, { _id: false });

// Listening section schema
const listeningSectionSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Custom string ID
  title: { type: String, required: true },
  audioUrl: { type: String }, // Path or URL to audio file
  audioFile: { type: String }, // Alternative field name for compatibility
  transcript: { type: String },
  suggestedTime: { type: Number, default: 10 }, // minutes
  order: { type: Number, required: true },
  questions: [questionSchema]
}, { _id: false });

// Writing task schema
const writingTaskSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Custom string ID
  taskNumber: { type: Number, enum: [1, 2], required: true },
  title: { type: String, required: true },
  prompt: { type: String, required: true },
  requirements: { type: String, required: true },
  timeLimit: { type: Number, required: true }, // minutes
  suggestedTime: { type: Number }, // Alternative field for compatibility
  minWords: { type: Number, required: true },
  maxWords: { type: Number },
  wordLimit: {
    min: { type: Number },
    max: { type: Number }
  },
  images: [{ type: String }], // Paths to images/charts
  imageUrl: String, // Alternative field for single image
  sampleAnswer: { type: String },
  scoringCriteria: {
    taskAchievement: { type: String },
    coherenceCohesion: { type: String },
    lexicalResource: { type: String },
    grammaticalRange: { type: String }
  },
  criteria: [{
    name: { type: String, required: true },
    description: { type: String, required: true },
    maxScore: { type: Number, required: true }
  }]
}, { _id: false });

// Speaking part schema
const speakingPartSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Custom string ID
  partNumber: { type: Number, enum: [1, 2, 3], required: true },
  title: { type: String, required: true },
  instructions: { type: String, required: true },
  timeLimit: { type: Number, required: true }, // minutes
  speakingTime: { type: Number }, // Alternative field in seconds
  preparationTime: { type: Number, default: 0 }, // minutes or seconds
  questions: [{
    _id: false,
    id: { type: String, required: true },
    question: { type: String, required: true },
    questionText: { type: String }, // Alternative field name
    audioUrl: String,
    audioFile: String, // Alternative field name
    cueCard: String, // For Part 2
    followUpQuestions: [String] // For Part 3
  }]
}, { _id: false });

// Main Test Schema - Unified version combining both admin and client features
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
      values: ['Beginner', 'Intermediate', 'Advanced', 'beginner', 'intermediate', 'advanced'],
      message: 'Difficulty must be Beginner, Intermediate, or Advanced'
    },
    required: true,
    set: function(value) {
      // Normalize to capitalize first letter
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
  },
  duration: {
    type: Number,
    required: [true, 'Test duration is required'] // total duration in minutes
  },
  totalTime: {
    type: Number // Alternative field name for compatibility
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
    enum: ['active', 'draft', 'archived', 'published'],
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
  tags: [{ type: String }],
  category: {
    type: String,
    enum: ['Academic', 'General Training', 'Practice', 'Mock Test'],
    default: 'Practice'
  },
  
  // 4 main skills - supporting both old and new field names
  reading: {
    sections: [readingSectionSchema],
    totalTime: { type: Number, default: 60 } // 60 minutes
  },
  readingSections: [readingSectionSchema], // Alternative field for compatibility
  
  listening: {
    sections: [listeningSectionSchema],
    totalTime: { type: Number, default: 40 } // 40 minutes
  },
  listeningSections: [listeningSectionSchema], // Alternative field for compatibility
  
  writing: {
    tasks: [writingTaskSchema],
    totalTime: { type: Number, default: 60 } // 60 minutes
  },
  writingTasks: [writingTaskSchema], // Alternative field for compatibility
  
  speaking: {
    parts: [speakingPartSchema],
    totalTime: { type: Number, default: 15 } // 15 minutes
  },
  speakingParts: [speakingPartSchema], // Alternative field for compatibility
  
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
testSchema.index({ createdBy: 1 });

// Virtual for estimated completion time
testSchema.virtual('estimatedTime').get(function() {
  let totalTime = 0;
  
  // Check both old and new field structures
  const readingSections = this.reading?.sections || this.readingSections || [];
  const listeningSections = this.listening?.sections || this.listeningSections || [];
  const writingTasks = this.writing?.tasks || this.writingTasks || [];
  const speakingParts = this.speaking?.parts || this.speakingParts || [];
  
  totalTime += readingSections.reduce((sum, section) => sum + (section.suggestedTime || 0), 0);
  totalTime += listeningSections.reduce((sum, section) => sum + (section.suggestedTime || 0), 0);
  totalTime += writingTasks.reduce((sum, task) => sum + (task.suggestedTime || task.timeLimit || 0), 0);
  totalTime += speakingParts.reduce((sum, part) => sum + (part.timeLimit || Math.ceil((part.speakingTime || 0) / 60)), 0);
  
  return totalTime;
});

// Virtual for total questions count
testSchema.virtual('questionCount').get(function() {
  let count = 0;
  
  // Check both old and new field structures
  const readingSections = this.reading?.sections || this.readingSections || [];
  const listeningSections = this.listening?.sections || this.listeningSections || [];
  const writingTasks = this.writing?.tasks || this.writingTasks || [];
  const speakingParts = this.speaking?.parts || this.speakingParts || [];
  
  count += readingSections.reduce((sum, section) => sum + (section.questions?.length || 0), 0);
  count += listeningSections.reduce((sum, section) => sum + (section.questions?.length || 0), 0);
  count += writingTasks.length;
  count += speakingParts.reduce((sum, part) => sum + (part.questions?.length || 0), 0);
  
  return count;
});

// Update totalQuestions and duration before saving
testSchema.pre('save', function(next) {
  this.totalQuestions = this.questionCount;
  
  // Update duration if not set
  if (!this.duration && !this.totalTime) {
    this.duration = this.estimatedTime;
  }
  
  // Ensure compatibility between duration and totalTime fields
  if (this.duration && !this.totalTime) {
    this.totalTime = this.duration;
  } else if (this.totalTime && !this.duration) {
    this.duration = this.totalTime;
  }
  
  next();
});

// Static method to find public tests
testSchema.statics.findPublic = function(filters = {}) {
  return this.find({ 
    $or: [
      { status: 'active', isPublic: true },
      { status: 'published', isPublic: true }
    ],
    ...filters
  });
};

// Static method to find featured tests
testSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ 
    $or: [
      { status: 'active', isPublic: true, isFeatured: true },
      { status: 'published', isPublic: true, isFeatured: true }
    ]
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Static method to find popular tests
testSchema.statics.findPopular = function(limit = 10) {
  return this.find({ 
    $or: [
      { status: 'active', isPublic: true },
      { status: 'published', isPublic: true }
    ]
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

module.exports = mongoose.model('Test', testSchema);