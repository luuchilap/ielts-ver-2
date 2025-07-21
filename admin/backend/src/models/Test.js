const mongoose = require('mongoose');

// Schema cho các dạng câu hỏi Reading
const multipleChoiceSingleSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // Index của đáp án đúng
  explanation: { type: String }
});

const multipleChoiceMultipleSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  numberOfAnswers: { type: Number, required: true },
  correctAnswers: [{ type: Number, required: true }],
  explanation: { type: String }
});

const trueFalseNotGivenSchema = new mongoose.Schema({
  statement: { type: String, required: true },
  answer: { type: String, enum: ['True', 'False', 'Not Given'], required: true },
  explanation: { type: String }
});

const fillInBlanksSchema = new mongoose.Schema({
  sentence: { type: String, required: true },
  correctAnswers: [{ type: String, required: true }], // Có thể có nhiều đáp án đúng
  maxWords: { type: Number, default: 1 },
  explanation: { type: String }
});

const matchingHeadingsSchema = new mongoose.Schema({
  headings: [{ type: String, required: true }],
  paragraphs: [{ type: String, required: true }],
  correctMatching: [{ 
    paragraphIndex: Number, 
    headingIndex: Number 
  }],
  explanation: { type: String }
});

const matchingInformationSchema = new mongoose.Schema({
  information: [{ type: String, required: true }],
  paragraphs: [{ type: String, required: true }],
  correctMatching: [{ 
    informationIndex: Number, 
    paragraphIndex: Number 
  }],
  explanation: { type: String }
});

const summaryCompletionSchema = new mongoose.Schema({
  summaryText: { type: String, required: true },
  wordBank: [{ type: String }], // Optional word bank
  blanks: [{ 
    position: Number, 
    correctAnswers: [String] 
  }],
  explanation: { type: String }
});

const sentenceCompletionSchema = new mongoose.Schema({
  sentenceStart: { type: String, required: true },
  correctCompletion: [{ type: String, required: true }],
  maxWords: { type: Number, default: 3 },
  explanation: { type: String }
});

const shortAnswerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  correctAnswers: [{ type: String, required: true }],
  maxWords: { type: Number, default: 3 },
  explanation: { type: String }
});

// Schema cho Reading Section
const readingSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  passage: { type: String, required: true },
  suggestedTime: { type: Number, default: 20 }, // minutes
  questions: [{
    type: { 
      type: String, 
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
      ],
      required: true 
    },
    order: { type: Number, required: true },
    content: mongoose.Schema.Types.Mixed // Sẽ chứa một trong các schema trên
  }]
});

// Schema cho Listening Section
const listeningSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  audioFile: { type: String }, // Path to audio file
  transcript: { type: String },
  questions: [{
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
});

// Schema cho Writing Task
const writingTaskSchema = new mongoose.Schema({
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
});

// Schema cho Speaking Part
const speakingPartSchema = new mongoose.Schema({
  partNumber: { type: Number, enum: [1, 2, 3], required: true },
  title: { type: String, required: true },
  instructions: { type: String, required: true },
  timeLimit: { type: Number, required: true }, // minutes
  preparationTime: { type: Number, default: 0 }, // minutes
  questions: [{
    questionText: { type: String, required: true },
    audioFile: { type: String }, // Optional audio question
    cueCard: { type: String }, // For Part 2
    followUpQuestions: [{ type: String }] // For Part 3
  }]
});

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