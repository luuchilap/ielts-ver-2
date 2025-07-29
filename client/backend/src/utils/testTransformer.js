/**
 * Test Data Transformer
 * Handles transformation between old nested structure and new flat structure
 */

/**
 * Transform test data to unified format (flat structure preferred)
 * @param {Object} test - Test document from database
 * @returns {Object} - Unified test data
 */
const transformToUnifiedFormat = (test) => {
  if (!test) return null;

  const transformed = { ...test.toObject ? test.toObject() : test };

  // Ensure flat structure is populated from nested structure if needed
  if (!transformed.readingSections && transformed.reading && transformed.reading.sections) {
    transformed.readingSections = transformed.reading.sections;
  }
  if (!transformed.listeningSections && transformed.listening && transformed.listening.sections) {
    transformed.listeningSections = transformed.listening.sections;
  }
  if (!transformed.writingTasks && transformed.writing && transformed.writing.tasks) {
    transformed.writingTasks = transformed.writing.tasks;
  }
  if (!transformed.speakingParts && transformed.speaking && transformed.speaking.parts) {
    transformed.speakingParts = transformed.speaking.parts;
  }

  // Ensure skills array is populated
  if (!transformed.skills || transformed.skills.length === 0) {
    transformed.skills = [];
    if (transformed.readingSections && transformed.readingSections.length > 0) {
      transformed.skills.push('Reading');
    }
    if (transformed.listeningSections && transformed.listeningSections.length > 0) {
      transformed.skills.push('Listening');
    }
    if (transformed.writingTasks && transformed.writingTasks.length > 0) {
      transformed.skills.push('Writing');
    }
    if (transformed.speakingParts && transformed.speakingParts.length > 0) {
      transformed.skills.push('Speaking');
    }
  }

  // Ensure duration is set
  if (!transformed.duration) {
    transformed.duration = transformed.totalTime || 180; // Default 3 hours
  }

  // Ensure statistics object exists
  if (!transformed.statistics) {
    transformed.statistics = {
      totalAttempts: 0,
      averageScore: 0,
      averageCompletionTime: 0,
      completionRate: 0
    };
  }

  // Ensure settings object exists
  if (!transformed.settings) {
    transformed.settings = {
      allowReview: true,
      showCorrectAnswers: true,
      allowPause: true,
      shuffleQuestions: false,
      passingScore: 7
    };
  }

  return transformed;
};

/**
 * Transform test data for admin format (nested structure)
 * @param {Object} test - Test document from database
 * @returns {Object} - Admin format test data
 */
const transformToAdminFormat = (test) => {
  if (!test) return null;

  const transformed = { ...test.toObject ? test.toObject() : test };

  // Ensure nested structure is populated from flat structure if needed
  if (!transformed.reading && transformed.readingSections) {
    transformed.reading = {
      sections: transformed.readingSections,
      totalTime: transformed.readingSections.reduce((sum, section) => sum + section.suggestedTime, 0)
    };
  }
  if (!transformed.listening && transformed.listeningSections) {
    transformed.listening = {
      sections: transformed.listeningSections,
      totalTime: transformed.listeningSections.reduce((sum, section) => sum + section.suggestedTime, 0)
    };
  }
  if (!transformed.writing && transformed.writingTasks) {
    transformed.writing = {
      tasks: transformed.writingTasks,
      totalTime: transformed.writingTasks.reduce((sum, task) => sum + task.suggestedTime, 0)
    };
  }
  if (!transformed.speaking && transformed.speakingParts) {
    transformed.speaking = {
      parts: transformed.speakingParts,
      totalTime: transformed.speakingParts.reduce((sum, part) => sum + Math.ceil(part.speakingTime / 60), 0)
    };
  }

  return transformed;
};

/**
 * Transform test data for client format (flat structure)
 * @param {Object} test - Test document from database
 * @returns {Object} - Client format test data
 */
const transformToClientFormat = (test) => {
  if (!test) return null;

  const transformed = { ...test.toObject ? test.toObject() : test };

  // Ensure flat structure is populated
  if (!transformed.readingSections && transformed.reading && transformed.reading.sections) {
    transformed.readingSections = transformed.reading.sections;
  }
  if (!transformed.listeningSections && transformed.listening && transformed.listening.sections) {
    transformed.listeningSections = transformed.listening.sections;
  }
  if (!transformed.writingTasks && transformed.writing && transformed.writing.tasks) {
    transformed.writingTasks = transformed.writing.tasks;
  }
  if (!transformed.speakingParts && transformed.speaking && transformed.speaking.parts) {
    transformed.speakingParts = transformed.speaking.parts;
  }

  // Remove nested structure for client
  delete transformed.reading;
  delete transformed.listening;
  delete transformed.writing;
  delete transformed.speaking;

  return transformed;
};

/**
 * Normalize question content based on type
 * @param {Object} question - Question object
 * @returns {Object} - Normalized question
 */
const normalizeQuestionContent = (question) => {
  if (!question || !question.content) return question;

  const normalized = { ...question };

  // Ensure content has proper structure based on type
  switch (question.type) {
    case 'multiple_choice_single':
      if (!normalized.content.question) {
        normalized.content = {
          question: question.content.question || question.content.statement || '',
          options: question.content.options || [],
          correctAnswer: question.content.correctAnswer || 0,
          explanation: question.content.explanation || ''
        };
      }
      break;
    case 'multiple_choice_multiple':
      if (!normalized.content.question) {
        normalized.content = {
          question: question.content.question || question.content.statement || '',
          options: question.content.options || [],
          numberOfAnswers: question.content.numberOfAnswers || 1,
          correctAnswers: question.content.correctAnswers || [],
          explanation: question.content.explanation || ''
        };
      }
      break;
    case 'true_false_not_given':
      if (!normalized.content.statement) {
        normalized.content = {
          statement: question.content.statement || question.content.question || '',
          answer: question.content.answer || 'Not Given',
          explanation: question.content.explanation || ''
        };
      }
      break;
    // Add other question types as needed
  }

  return normalized;
};

/**
 * Normalize section questions
 * @param {Array} questions - Array of questions
 * @returns {Array} - Normalized questions
 */
const normalizeQuestions = (questions) => {
  if (!Array.isArray(questions)) return [];
  return questions.map(normalizeQuestionContent);
};

/**
 * Normalize test sections
 * @param {Object} test - Test object
 * @returns {Object} - Normalized test
 */
const normalizeTestSections = (test) => {
  const normalized = { ...test };

  // Normalize reading sections
  if (normalized.readingSections) {
    normalized.readingSections = normalized.readingSections.map(section => ({
      ...section,
      questions: normalizeQuestions(section.questions)
    }));
  }

  // Normalize listening sections
  if (normalized.listeningSections) {
    normalized.listeningSections = normalized.listeningSections.map(section => ({
      ...section,
      questions: normalizeQuestions(section.questions)
    }));
  }

  // Normalize writing tasks
  if (normalized.writingTasks) {
    normalized.writingTasks = normalized.writingTasks.map(task => ({
      ...task,
      // Ensure required fields exist
      title: task.title || `Task ${task.taskNumber}`,
      suggestedTime: task.suggestedTime || task.timeLimit || 60,
      wordLimit: task.wordLimit || { min: task.minWords || 150, max: task.maxWords }
    }));
  }

  // Normalize speaking parts
  if (normalized.speakingParts) {
    normalized.speakingParts = normalized.speakingParts.map(part => ({
      ...part,
      // Ensure required fields exist
      speakingTime: part.speakingTime || (part.timeLimit ? part.timeLimit * 60 : 120),
      preparationTime: part.preparationTime || 0
    }));
  }

  return normalized;
};

/**
 * Complete test normalization
 * @param {Object} test - Test object
 * @returns {Object} - Fully normalized test
 */
const normalizeTest = (test) => {
  if (!test) return null;

  let normalized = transformToUnifiedFormat(test);
  normalized = normalizeTestSections(normalized);

  return normalized;
};

module.exports = {
  transformToUnifiedFormat,
  transformToAdminFormat,
  transformToClientFormat,
  normalizeQuestionContent,
  normalizeQuestions,
  normalizeTestSections,
  normalizeTest
}; 