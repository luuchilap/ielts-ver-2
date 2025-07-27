const mongoose = require('mongoose');

// Schema cho Reading Section
const readingSectionSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Custom string ID
  title: { type: String, required: true },
  passage: { type: String, default: '' }, // Allow empty passage during editing
  suggestedTime: { type: Number, default: 20 }, // minutes
  questions: [{
    _id: false, // Disable automatic ObjectId generation
    id: { type: String, required: true }, // Custom string ID
    type: { 
      type: String, 
      enum: [
        'multiple-choice-single',
        'multiple-choice-multiple', 
        'true-false-not-given',
        'fill-in-blanks',
        'matching-headings',
        'matching-information',
        'summary-completion',
        'sentence-completion',
        'short-answer'
      ],
      required: true 
    },
    order: { type: Number, required: true },
    content: mongoose.Schema.Types.Mixed // Sẽ chứa một trong các schema trên
  }]
}, { _id: false }); // Disable automatic ObjectId for sections too

// Schema cho Listening Section
const listeningSectionSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Custom string ID
  title: { type: String, required: true },
  audioFile: { type: String }, // Path to audio file
  transcript: { type: String },
  questions: [{
    _id: false, // Disable automatic ObjectId generation
    id: { type: String, required: true }, // Custom string ID
    type: { 
      type: String, 
      enum: [
        'multiple_choice_single',
        'multiple_choice_multiple', 
        'fill_in_blanks',
        'matching',
        'short_answer'
      ],
      required: true 
    },
    order: { type: Number, required: true },
    timestamp: { type: Number }, // Thời điểm câu hỏi trong audio (seconds)
    content: mongoose.Schema.Types.Mixed
  }]
}, { _id: false }); // Disable automatic ObjectId for sections too

// Schema cho Writing Task
const writingTaskSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Custom string ID
  taskNumber: { type: Number, enum: [1, 2], required: true },
  title: { type: String, required: true },
  prompt: { type: String, required: true },
  requirements: { type: String, required: true },
  timeLimit: { type: Number, required: true }, // minutes
  minWords: { type: Number, required: true },
  images: [{ type: String }], // Paths to images/charts
  sampleAnswer: { type: String },
  scoringCriteria: {
    taskAchievement: { type: String },
    coherenceCohesion: { type: String },
    lexicalResource: { type: String },
    grammaticalRange: { type: String }
  }
}, { _id: false }); // Disable automatic ObjectId for tasks too

// Schema cho Speaking Part
const speakingPartSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Custom string ID
  partNumber: { type: Number, enum: [1, 2, 3], required: true },
  title: { type: String, required: true },
  instructions: { type: String, required: true },
  timeLimit: { type: Number, required: true }, // minutes
  preparationTime: { type: Number, default: 0 }, // minutes
  questions: [{
    _id: false, // Disable automatic ObjectId generation
    id: { type: String, required: true }, // Custom string ID
    questionText: { type: String, required: true },
    audioFile: { type: String }, // Optional audio question
    cueCard: { type: String }, // For Part 2
    followUpQuestions: [{ type: String }] // For Part 3
  }]
}, { _id: false }); // Disable automatic ObjectId for parts too

// Main Test Schema
const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  totalTime: {
    type: Number,
    default: 180 // 3 hours total
  },
  
  // 4 main skills
  reading: {
    sections: [readingSectionSchema],
    totalTime: { type: Number, default: 60 } // 60 minutes
  },
  
  listening: {
    sections: [listeningSectionSchema],
    totalTime: { type: Number, default: 40 } // 40 minutes
  },
  
  writing: {
    tasks: [writingTaskSchema],
    totalTime: { type: Number, default: 60 } // 60 minutes
  },
  
  speaking: {
    parts: [speakingPartSchema],
    totalTime: { type: Number, default: 15 } // 15 minutes
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
  tags: [{ type: String }],
  isTemplate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better performance
testSchema.index({ title: 'text', description: 'text' });
testSchema.index({ status: 1 });
testSchema.index({ difficulty: 1 });
testSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Test', testSchema); 