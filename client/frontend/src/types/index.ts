// User types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  dateOfBirth?: string;
  phone?: string;
  country?: string;
  targetScore?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName: string;
  lastName: string;
  country?: string;
  targetScore?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
}

// Test types - Unified for both admin and client
export interface Test {
  _id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  totalQuestions: number;
  skills: ('Reading' | 'Listening' | 'Writing' | 'Speaking')[];
  status: 'draft' | 'published' | 'archived' | 'active';
  isPublic: boolean;
  isFeatured: boolean;
  isTemplate: boolean;
  tags: string[];
  category: 'Academic' | 'General Training' | 'Practice' | 'Mock Test';
  
  // Flat structure (preferred)
  readingSections?: ReadingSection[];
  listeningSections?: ListeningSection[];
  writingTasks?: WritingTask[];
  speakingParts?: SpeakingPart[];
  
  // Legacy nested structure (for backward compatibility)
  reading?: {
    sections: ReadingSection[];
    totalTime: number;
  };
  listening?: {
    sections: ListeningSection[];
    totalTime: number;
  };
  writing?: {
    tasks: WritingTask[];
    totalTime: number;
  };
  speaking?: {
    parts: SpeakingPart[];
    totalTime: number;
  };
  
  // Statistics
  statistics: {
    totalAttempts: number;
    averageScore: number;
    averageCompletionTime: number;
    completionRate: number;
  };
  
  // Settings
  settings: {
    allowReview: boolean;
    showCorrectAnswers: boolean;
    allowPause: boolean;
    shuffleQuestions: boolean;
    timePerQuestion?: number;
    passingScore: number;
  };
  
  // Metadata
  createdBy: string;
  lastModifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Reading types
export interface ReadingSection {
  id: string; // Custom string ID
  title: string;
  passage: string;
  suggestedTime: number;
  order: number;
  questions: ReadingQuestion[];
}

export interface ReadingQuestion {
  id: string; // Custom string ID
  type: ReadingQuestionType;
  order: number;
  content: any; // Will be typed based on question type
  points?: number;
  timeLimit?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export type ReadingQuestionType = 
  | 'multiple_choice_single'
  | 'multiple_choice_multiple'
  | 'true_false_not_given'
  | 'fill_in_blanks'
  | 'matching_headings'
  | 'matching_information'
  | 'summary_completion'
  | 'sentence_completion'
  | 'short_answer';

export interface MultipleChoiceSingle {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface MultipleChoiceMultiple {
  question: string;
  options: string[];
  numberOfAnswers: number;
  correctAnswers: number[];
  explanation?: string;
}

export interface TrueFalseNotGiven {
  statement: string;
  answer: 'True' | 'False' | 'Not Given';
  explanation?: string;
}

export interface FillInBlanks {
  sentence: string;
  correctAnswers: string[];
  maxWords: number;
  explanation?: string;
}

export interface MatchingHeadings {
  headings: string[];
  paragraphs: string[];
  correctMatching: Array<{
    paragraphIndex: number;
    headingIndex: number;
  }>;
  explanation?: string;
}

export interface MatchingInformation {
  statements: string[];
  paragraphs: string[];
  correctMatching: Array<{
    statementIndex: number;
    paragraphIndex: number;
  }>;
  explanation?: string;
}

export interface SummaryCompletion {
  summary: string;
  gaps: Array<{
    position: number;
    correctAnswers: string[];
    maxWords: number;
  }>;
  explanation?: string;
}

export interface SentenceCompletion {
  sentences: Array<{
    sentence: string;
    gap: string;
    correctAnswers: string[];
    maxWords: number;
  }>;
  explanation?: string;
}

// Listening types
export interface ListeningSection {
  id: string; // Custom string ID
  title: string;
  audioUrl: string;
  transcript?: string;
  suggestedTime: number;
  order: number;
  questions: ListeningQuestion[];
}

export interface ListeningQuestion {
  id: string; // Custom string ID
  type: ReadingQuestionType; // Similar question types
  order: number;
  content: any;
  timestamp?: number; // Audio timestamp in seconds
  points?: number;
  timeLimit?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

// Writing types
export interface WritingTask {
  id: string; // Custom string ID
  taskNumber: 1 | 2;
  title: string;
  prompt: string;
  imageUrl?: string;
  requirements: string;
  suggestedTime: number;
  wordLimit: {
    min: number;
    max?: number;
  };
  sampleAnswer?: string;
  criteria: WritingCriteria[];
}

export interface WritingCriteria {
  name: string;
  description: string;
  maxScore: number;
}

// Speaking types
export interface SpeakingPart {
  id: string; // Custom string ID
  partNumber: 1 | 2 | 3;
  title: string;
  instructions: string;
  questions: SpeakingQuestion[];
  preparationTime?: number; // seconds
  speakingTime: number; // seconds
}

export interface SpeakingQuestion {
  id: string; // Custom string ID
  question: string;
  audioUrl?: string;
  cueCard?: string; // For Part 2
  followUpQuestions?: string[]; // For Part 3
}

// Test submission types
export interface TestSubmission {
  _id: string;
  testId: string;
  userId: string;
  answers: {
    reading?: ReadingAnswers;
    listening?: ListeningAnswers;
    writing?: WritingAnswers;
    speaking?: SpeakingAnswers;
  };
  startTime: string;
  endTime?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  scores?: TestScores;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingAnswers {
  [sectionId: string]: {
    [questionId: string]: any;
  };
}

export interface ListeningAnswers {
  [sectionId: string]: {
    [questionId: string]: any;
  };
}

export interface WritingAnswers {
  task1?: {
    content: string;
    wordCount: number;
  };
  task2?: {
    content: string;
    wordCount: number;
  };
}

export interface SpeakingAnswers {
  [partId: string]: {
    [questionId: string]: {
      audioUrl: string;
      duration: number;
    };
  };
}

export interface TestScores {
  reading?: number;
  listening?: number;
  writing?: number;
  speaking?: number;
  overall?: number;
  breakdown?: {
    [skill: string]: {
      [criteria: string]: number;
    };
  };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Common types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface TestTimer {
  duration: number; // total duration in seconds
  remaining: number; // remaining time in seconds
  isActive: boolean;
  isPaused: boolean;
}

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoaded: boolean;
}

// Navigation types
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}
