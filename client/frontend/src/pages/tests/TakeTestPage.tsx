import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { testApi } from '../../services/api';
import { Test, TestSubmission } from '../../types';
import toast from 'react-hot-toast';

interface QuestionComponentProps {
  question: any;
  answer: any;
  onAnswerChange: (answer: any) => void;
}

const MultipleChoiceQuestion: React.FC<QuestionComponentProps> = ({ question, answer, onAnswerChange }) => {
  const handleChange = (optionIndex: number) => {
    if (question.content.numberOfAnswers > 1) {
      const currentAnswers = Array.isArray(answer) ? answer : [];
      const newAnswers = currentAnswers.includes(optionIndex)
        ? currentAnswers.filter((a: number) => a !== optionIndex)
        : [...currentAnswers, optionIndex];
      onAnswerChange(newAnswers);
    } else {
      onAnswerChange(optionIndex);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-900">{question.content.question}</h3>
      <div className="space-y-2">
        {question.content.options.map((option: string, index: number) => (
          <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type={question.content.numberOfAnswers > 1 ? "checkbox" : "radio"}
              name={`question-${question.id}`}
              checked={
                question.content.numberOfAnswers > 1
                  ? Array.isArray(answer) && answer.includes(index)
                  : answer === index
              }
              onChange={() => handleChange(index)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-900">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const TrueFalseQuestion: React.FC<QuestionComponentProps> = ({ question, answer, onAnswerChange }) => {
  const options = ['True', 'False', 'Not Given'];
  
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-900">{question.content.statement}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name={`question-${question.id}`}
              checked={answer === option}
              onChange={() => onAnswerChange(option)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-900">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const TextInputQuestion: React.FC<QuestionComponentProps> = ({ question, answer, onAnswerChange }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-900">
        {question.content.question || question.content.sentence}
      </h3>
      <input
        type="text"
        value={answer || ''}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Enter your answer..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        maxLength={question.content.maxWords ? question.content.maxWords * 10 : undefined}
      />
      {question.content.maxWords && (
        <p className="text-sm text-gray-500">Maximum {question.content.maxWords} word(s)</p>
      )}
    </div>
  );
};

const WritingTaskComponent: React.FC<QuestionComponentProps> = ({ question, answer, onAnswerChange }) => {
  const [wordCount, setWordCount] = useState(0);

  const handleContentChange = (content: string) => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words);
    onAnswerChange({
      content,
      wordCount: words
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Task {question.taskNumber}</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-gray-800">{question.prompt}</p>
          {question.requirements && (
            <div className="mt-2 text-sm text-gray-600">
              <strong>Requirements:</strong> {question.requirements}
            </div>
          )}
        </div>
      </div>
      
      <div>
        <textarea
          value={answer?.content || ''}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Write your response here..."
          className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
          <span>
            Word count: {wordCount}
            {question.minWords && ` (minimum: ${question.minWords})`}
            {question.maxWords && ` (maximum: ${question.maxWords})`}
          </span>
          <span>
            Time limit: {question.timeLimit || question.suggestedTime || 20} minutes
          </span>
        </div>
      </div>
    </div>
  );
};

const TakeTestPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [test, setTest] = useState<Test | null>(null);
  const [submission, setSubmission] = useState<TestSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [currentSkill, setCurrentSkill] = useState<string>('reading');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Get submission ID and selected skills from navigation state
  const submissionId = location.state?.submissionId;
  const selectedSkills = location.state?.selectedSkills;

  useEffect(() => {
    if (testId) {
      loadTest();
    }
  }, [testId]);

  useEffect(() => {
    if (submissionId) {
      loadSubmission();
    } else if (test) {
      startNewTest();
    }
  }, [test, submissionId]);

  // Initialize skill based on selected skills or submission data
  useEffect(() => {
    if (test && !submission) {
      const availableSkills = getAvailableSkills();
      if (availableSkills.length > 0) {
        const firstSkill = availableSkills[0].toLowerCase();
        if (firstSkill !== currentSkill) {
          setCurrentSkill(firstSkill);
        }
      }
    }
  }, [test, selectedSkills]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  const loadTest = async () => {
    try {
      setLoading(true);
      const response = await testApi.getTest(testId!);
      
      if (response.success && response.data) {
        setTest(response.data);
        setTimeRemaining((response.data.duration || response.data.totalTime || 60) * 60);
      } else {
        setError(response.message || 'Failed to load test');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load test');
    } finally {
      setLoading(false);
    }
  };

  const loadSubmission = async () => {
    try {
      const response = await testApi.getSubmission(submissionId);
      if (response.success && response.data) {
        setSubmission(response.data);
        setAnswers(response.data.answers || {});
        if (response.data.remainingTime) {
          setTimeRemaining(response.data.remainingTime);
        }
        setIsTimerActive(true);
      }
    } catch (err: any) {
      toast.error('Failed to load test progress');
    }
  };

  const startNewTest = async () => {
    try {
      const response = await testApi.startTest(test!._id);
      if (response.success && response.data) {
        setSubmission(response.data);
        setIsTimerActive(true);
        toast.success('Test started!');
      }
    } catch (err: any) {
      toast.error('Failed to start test');
    }
  };

  const getCurrentSection = () => {
    if (!test) return null;
    
    const sections = getCurrentSections();
    return sections[currentSectionIndex] || null;
  };

  const getCurrentSections = () => {
    if (!test) return [];
    
    // If we have selected skills and the current skill is not in the selection, return empty
    const availableSkills = getAvailableSkills();
    const currentSkillCapitalized = currentSkill.charAt(0).toUpperCase() + currentSkill.slice(1);
    
    if (availableSkills.length > 0 && !availableSkills.includes(currentSkillCapitalized)) {
      return [];
    }
    
    switch (currentSkill) {
      case 'reading':
        return test.readingSections || test.reading?.sections || [];
      case 'listening':
        return test.listeningSections || test.listening?.sections || [];
      case 'writing':
        return test.writingTasks || test.writing?.tasks || [];
      case 'speaking':
        return test.speakingParts || test.speaking?.parts || [];
      default:
        return [];
    }
  };

  const getCurrentQuestion = () => {
    const section = getCurrentSection();
    if (!section) return null;
    
    if (currentSkill === 'writing' || currentSkill === 'speaking') {
      return section; // For writing/speaking, the task/part is the "question"
    }
    
    // For reading and listening sections
    if ('questions' in section && section.questions) {
      return section.questions[currentQuestionIndex] || null;
    }
    
    return null;
  };

  const getQuestionId = () => {
    const question = getCurrentQuestion();
    if (!question) return '';
    
    if (currentSkill === 'writing' || currentSkill === 'speaking') {
      return (question as any)._id || `${currentSkill}-${currentSectionIndex}`;
    }
    
    return (question as any)._id || `q-${currentSectionIndex}-${currentQuestionIndex}`;
  };

  const handleAnswerChange = (answer: any) => {
    const questionId = getQuestionId();
    if (questionId) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: answer
      }));
    }
  };

  const saveProgress = useCallback(async () => {
    if (!submission) return;
    
    try {
      await testApi.saveProgress(submission._id, {
        answers,
        currentSection: currentSectionIndex,
        currentQuestion: currentQuestionIndex
      });
    } catch (err: any) {
      console.error('Failed to save progress:', err);
    }
  }, [submission, answers, currentSectionIndex, currentQuestionIndex]);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    const interval = setInterval(saveProgress, 30000);
    return () => clearInterval(interval);
  }, [saveProgress]);

  const navigateToNext = () => {
    const sections = getCurrentSections();
    const section = getCurrentSection();
    
    if (currentSkill === 'writing' || currentSkill === 'speaking') {
      // For writing/speaking, each task/part is a section
      if (currentSectionIndex < sections.length - 1) {
        setCurrentSectionIndex(prev => prev + 1);
      } else {
        moveToNextSkill();
      }
    } else {
      // For reading/listening, move through questions then sections
      const maxQuestions = (section && 'questions' in section && section.questions) ? section.questions.length : 0;
      
      if (currentQuestionIndex < maxQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else if (currentSectionIndex < sections.length - 1) {
        setCurrentSectionIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        moveToNextSkill();
      }
    }
  };

  const navigateToPrevious = () => {
    if (currentSkill === 'writing' || currentSkill === 'speaking') {
      if (currentSectionIndex > 0) {
        setCurrentSectionIndex(prev => prev - 1);
      } else {
        moveToPreviousSkill();
      }
    } else {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
      } else if (currentSectionIndex > 0) {
        setCurrentSectionIndex(prev => prev - 1);
        const sections = getCurrentSections();
        const prevSection = sections[currentSectionIndex - 1];
        const questionsLength = (prevSection && 'questions' in prevSection && prevSection.questions) ? prevSection.questions.length : 1;
        setCurrentQuestionIndex(questionsLength - 1);
      } else {
        moveToPreviousSkill();
      }
    }
  };

  const getAvailableSkills = (): string[] => {
    const allSkills = test?.skills || [];
    return selectedSkills && selectedSkills.length > 0 
      ? selectedSkills.filter((skill: string) => allSkills.includes(skill as any))
      : allSkills;
  };

  const moveToNextSkill = () => {
    const skills = getAvailableSkills();
    const currentIndex = skills.findIndex((skill: string) => skill.toLowerCase() === currentSkill);
    
    if (currentIndex < skills.length - 1) {
      const nextSkill = skills[currentIndex + 1].toLowerCase();
      setCurrentSkill(nextSkill);
      setCurrentSectionIndex(0);
      setCurrentQuestionIndex(0);
    } else {
      // Test completed
      handleSubmitTest();
    }
  };

  const moveToPreviousSkill = () => {
    const skills = getAvailableSkills();
    const currentIndex = skills.findIndex((skill: string) => skill.toLowerCase() === currentSkill);
    
    if (currentIndex > 0) {
      const prevSkill = skills[currentIndex - 1].toLowerCase();
      setCurrentSkill(prevSkill);
      
      // Move to last section/question of previous skill
      const prevSections = getPreviousSkillSections(prevSkill);
      const lastSectionIndex = Math.max(0, prevSections.length - 1);
      setCurrentSectionIndex(lastSectionIndex);
      
      if (prevSkill !== 'writing' && prevSkill !== 'speaking') {
        const lastSection = prevSections[lastSectionIndex];
        const questionsLength = (lastSection && 'questions' in lastSection && lastSection.questions) ? lastSection.questions.length : 1;
        setCurrentQuestionIndex(Math.max(0, questionsLength - 1));
      }
    }
  };

  const getPreviousSkillSections = (skill: string) => {
    if (!test) return [];
    
    switch (skill) {
      case 'reading':
        return test.readingSections || test.reading?.sections || [];
      case 'listening':
        return test.listeningSections || test.listening?.sections || [];
      case 'writing':
        return test.writingTasks || test.writing?.tasks || [];
      case 'speaking':
        return test.speakingParts || test.speaking?.parts || [];
      default:
        return [];
    }
  };

  const handleSubmitTest = async () => {
    if (!submission) return;
    
    try {
      setSubmitting(true);
      setIsTimerActive(false);
      
      await saveProgress(); // Save final progress
      
      const response = await testApi.submitTest(submission._id, { answers });
      
      if (response.success) {
        toast.success('Test submitted successfully!');
        navigate(`/results/${submission._id}`, { replace: true });
      } else {
        toast.error('Failed to submit test');
      }
    } catch (err: any) {
      toast.error('Failed to submit test');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestion = () => {
    const question = getCurrentQuestion();
    if (!question) return null;
    
    const questionId = getQuestionId();
    const answer = answers[questionId];
    
    if (currentSkill === 'writing') {
      return (
        <WritingTaskComponent
          question={question}
          answer={answer}
          onAnswerChange={handleAnswerChange}
        />
      );
    }
    
    if (currentSkill === 'speaking') {
      // Handle speaking questions - for now show placeholder
      return (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">Speaking questions will be implemented in a future update.</p>
          <p className="text-sm text-blue-600 mt-1">This would include audio recording functionality.</p>
        </div>
      );
    }
    
    const questionType = (question as any).type;
    
    switch (questionType) {
      case 'multiple_choice_single':
      case 'multiple_choice_multiple':
        return (
          <MultipleChoiceQuestion
            question={question}
            answer={answer}
            onAnswerChange={handleAnswerChange}
          />
        );
        
      case 'true_false_not_given':
        return (
          <TrueFalseQuestion
            question={question}
            answer={answer}
            onAnswerChange={handleAnswerChange}
          />
        );
        
      case 'fill_in_blanks':
      case 'short_answer':
      case 'sentence_completion':
        return (
          <TextInputQuestion
            question={question}
            answer={answer}
            onAnswerChange={handleAnswerChange}
          />
        );
        
      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">Question type "{questionType}" is not yet implemented.</p>
            <p className="text-sm text-yellow-600 mt-1">Please contact support if you see this message.</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error loading test</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/tests')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Test not found</p>
          <button
            onClick={() => navigate('/tests')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  const section = getCurrentSection();
  const question = getCurrentQuestion();
  const sections = getCurrentSections();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with timer and progress */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{test.title}</h1>
              <div className="flex items-center space-x-2 text-sm">
                <p className="text-gray-500">
                  {currentSkill.charAt(0).toUpperCase() + currentSkill.slice(1)} - 
                  {section ? ` ${(section as any).title || `Section ${currentSectionIndex + 1}`}` : ''}
                  {currentSkill !== 'writing' && currentSkill !== 'speaking' && question ? ` - Question ${currentQuestionIndex + 1}` : ''}
                </p>
                {selectedSkills && selectedSkills.length > 0 && selectedSkills.length < (test?.skills?.length || 0) && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedSkills.join(', ')} Only
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className={`text-lg font-mono ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-xs text-gray-500">Time remaining</div>
              </div>
              
              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {submitting ? 'Submitting...' : 'Submit Test'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white shadow rounded-lg">
          {/* Reading passage for reading sections */}
          {currentSkill === 'reading' && section && 'passage' in section && section.passage && (
            <div className="border-b border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reading Passage</h3>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {section.passage}
              </div>
            </div>
          )}
          
          {/* Question content */}
          <div className="p-6">
            {question ? renderQuestion() : (
              <div className="text-center py-8">
                <p className="text-gray-500">No questions available for this section.</p>
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={navigateToPrevious}
                disabled={currentSkill === getAvailableSkills()[0]?.toLowerCase() && currentSectionIndex === 0 && currentQuestionIndex === 0}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <div className="text-sm text-gray-500">
                {currentSkill === 'writing' || currentSkill === 'speaking' 
                  ? `${currentSkill === 'writing' ? 'Task' : 'Part'} ${currentSectionIndex + 1} of ${sections.length} in ${currentSkill}`
                  : `Question ${currentQuestionIndex + 1} of ${(section && 'questions' in section && section.questions) ? section.questions.length : 0} in ${currentSkill}`
                }
              </div>
              
              <button
                onClick={navigateToNext}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Next
                <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeTestPage;
