import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Test, TestSubmission, TestTimer } from '../types';
import { testApi } from '../services/api';
import toast from 'react-hot-toast';

interface TestState {
  currentTest: Test | null;
  currentSubmission: TestSubmission | null;
  isLoading: boolean;
  error: string | null;
  timer: TestTimer | null;
  currentSection: number;
  currentQuestion: number;
  answers: Record<string, any>;
  isSubmitting: boolean;
}

type TestAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_TEST'; payload: Test }
  | { type: 'SET_CURRENT_SUBMISSION'; payload: TestSubmission }
  | { type: 'SET_TIMER'; payload: TestTimer }
  | { type: 'UPDATE_TIMER'; payload: Partial<TestTimer> }
  | { type: 'SET_CURRENT_SECTION'; payload: number }
  | { type: 'SET_CURRENT_QUESTION'; payload: number }
  | { type: 'SET_ANSWER'; payload: { questionId: string; answer: any } }
  | { type: 'SET_ANSWERS'; payload: Record<string, any> }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET_TEST' };

const initialState: TestState = {
  currentTest: null,
  currentSubmission: null,
  isLoading: false,
  error: null,
  timer: null,
  currentSection: 0,
  currentQuestion: 0,
  answers: {},
  isSubmitting: false,
};

const testReducer = (state: TestState, action: TestAction): TestState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CURRENT_TEST':
      return { ...state, currentTest: action.payload };
    case 'SET_CURRENT_SUBMISSION':
      return { ...state, currentSubmission: action.payload };
    case 'SET_TIMER':
      return { ...state, timer: action.payload };
    case 'UPDATE_TIMER':
      return {
        ...state,
        timer: state.timer ? { ...state.timer, ...action.payload } : null,
      };
    case 'SET_CURRENT_SECTION':
      return { ...state, currentSection: action.payload };
    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestion: action.payload };
    case 'SET_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.answer,
        },
      };
    case 'SET_ANSWERS':
      return { ...state, answers: action.payload };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'RESET_TEST':
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

interface TestContextType extends TestState {
  startTest: (testId: string) => Promise<void>;
  submitAnswer: (questionId: string, answer: any) => void;
  saveProgress: () => Promise<void>;
  submitTest: () => Promise<void>;
  pauseTest: () => void;
  resumeTest: () => void;
  goToSection: (sectionIndex: number) => void;
  goToQuestion: (questionIndex: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  resetTest: () => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const useTest = (): TestContextType => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};

interface TestProviderProps {
  children: React.ReactNode;
}

export const TestProvider: React.FC<TestProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(testReducer, initialState);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.timer?.isActive && !state.timer.isPaused) {
      interval = setInterval(() => {
        dispatch({
          type: 'UPDATE_TIMER',
          payload: {
            remaining: Math.max(0, state.timer!.remaining - 1),
          },
        });

        // Auto-submit when time is up
        if (state.timer!.remaining <= 1) {
          submitTest();
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.timer?.isActive, state.timer?.isPaused, state.timer?.remaining]);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    let autoSaveInterval: NodeJS.Timeout;

    if (state.currentSubmission && state.timer?.isActive) {
      autoSaveInterval = setInterval(() => {
        saveProgress();
      }, 30000); // Save every 30 seconds
    }

    return () => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
    };
  }, [state.currentSubmission, state.timer?.isActive]);

  const startTest = async (testId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Get test details
      const testResponse = await testApi.getTest(testId);
      if (!testResponse.success || !testResponse.data) {
        throw new Error('Failed to load test');
      }

      // Start test submission
      const submissionResponse = await testApi.startTest(testId);
      if (!submissionResponse.success || !submissionResponse.data) {
        throw new Error('Failed to start test');
      }

      dispatch({ type: 'SET_CURRENT_TEST', payload: testResponse.data });
      dispatch({ type: 'SET_CURRENT_SUBMISSION', payload: submissionResponse.data });

      // Initialize timer
      const timer: TestTimer = {
        duration: testResponse.data.duration * 60, // Convert minutes to seconds
        remaining: testResponse.data.duration * 60,
        isActive: true,
        isPaused: false,
      };
      dispatch({ type: 'SET_TIMER', payload: timer });

      toast.success('Test started successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to start test';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const submitAnswer = (questionId: string, answer: any): void => {
    dispatch({
      type: 'SET_ANSWER',
      payload: { questionId, answer },
    });
  };

  const saveProgress = async (): Promise<void> => {
    if (!state.currentSubmission) return;

    try {
      await testApi.saveProgress(state.currentSubmission._id, {
        answers: state.answers,
        currentSection: state.currentSection,
        currentQuestion: state.currentQuestion,
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
      // Don't show error toast for auto-save failures
    }
  };

  const submitTest = async (): Promise<void> => {
    if (!state.currentSubmission) return;

    try {
      dispatch({ type: 'SET_SUBMITTING', payload: true });

      await testApi.submitTest(state.currentSubmission._id, {
        answers: state.answers,
      });

      // Stop timer
      dispatch({
        type: 'UPDATE_TIMER',
        payload: { isActive: false },
      });

      toast.success('Test submitted successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit test';
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  const pauseTest = (): void => {
    dispatch({
      type: 'UPDATE_TIMER',
      payload: { isPaused: true },
    });
  };

  const resumeTest = (): void => {
    dispatch({
      type: 'UPDATE_TIMER',
      payload: { isPaused: false },
    });
  };

  const goToSection = (sectionIndex: number): void => {
    dispatch({ type: 'SET_CURRENT_SECTION', payload: sectionIndex });
    dispatch({ type: 'SET_CURRENT_QUESTION', payload: 0 });
  };

  const goToQuestion = (questionIndex: number): void => {
    dispatch({ type: 'SET_CURRENT_QUESTION', payload: questionIndex });
  };

  const nextQuestion = (): void => {
    if (!state.currentTest) return;

    const currentSkill = getCurrentSkill();
    const totalQuestions = getTotalQuestionsInCurrentSection();

    if (state.currentQuestion < totalQuestions - 1) {
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: state.currentQuestion + 1 });
    } else {
      // Move to next section if available
      const totalSections = getTotalSections();
      if (state.currentSection < totalSections - 1) {
        dispatch({ type: 'SET_CURRENT_SECTION', payload: state.currentSection + 1 });
        dispatch({ type: 'SET_CURRENT_QUESTION', payload: 0 });
      }
    }
  };

  const previousQuestion = (): void => {
    if (state.currentQuestion > 0) {
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: state.currentQuestion - 1 });
    } else {
      // Move to previous section if available
      if (state.currentSection > 0) {
        const prevSectionIndex = state.currentSection - 1;
        dispatch({ type: 'SET_CURRENT_SECTION', payload: prevSectionIndex });
        
        // Set to last question of previous section
        const prevSectionQuestions = getTotalQuestionsInSection(prevSectionIndex);
        dispatch({ type: 'SET_CURRENT_QUESTION', payload: prevSectionQuestions - 1 });
      }
    }
  };

  const resetTest = (): void => {
    dispatch({ type: 'RESET_TEST' });
  };

  // Helper functions
  const getCurrentSkill = (): string => {
    if (!state.currentTest) return '';
    
    const skills = state.currentTest.skills;
    // Determine current skill based on current section
    // This is a simplified approach - you might need more complex logic
    if (state.currentSection < (state.currentTest.readingSections?.length || 0)) {
      return 'Reading';
    }
    // Add logic for other skills...
    return skills[0] || '';
  };

  const getTotalSections = (): number => {
    if (!state.currentTest) return 0;
    
    let total = 0;
    if (state.currentTest.readingSections) total += state.currentTest.readingSections.length;
    if (state.currentTest.listeningSections) total += state.currentTest.listeningSections.length;
    if (state.currentTest.writingTasks) total += state.currentTest.writingTasks.length;
    if (state.currentTest.speakingParts) total += state.currentTest.speakingParts.length;
    
    return total;
  };

  const getTotalQuestionsInCurrentSection = (): number => {
    return getTotalQuestionsInSection(state.currentSection);
  };

  const getTotalQuestionsInSection = (sectionIndex: number): number => {
    if (!state.currentTest) return 0;
    
    // This is simplified - you'll need to implement proper section indexing
    const readingSections = state.currentTest.readingSections || [];
    if (sectionIndex < readingSections.length) {
      return readingSections[sectionIndex].questions.length;
    }
    
    // Add logic for other skills...
    return 0;
  };

  const value: TestContextType = {
    ...state,
    startTest,
    submitAnswer,
    saveProgress,
    submitTest,
    pauseTest,
    resumeTest,
    goToSection,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    resetTest,
  };

  return (
    <TestContext.Provider value={value}>
      {children}
    </TestContext.Provider>
  );
};
