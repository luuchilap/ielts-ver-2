import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testApi } from '../../services/api';
import { Test } from '../../types';
import toast from 'react-hot-toast';

const TestDetailPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingTest, setStartingTest] = useState(false);

  useEffect(() => {
    if (testId) {
      loadTestDetails();
    }
  }, [testId]);

  const loadTestDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await testApi.getTest(testId!);
      
      if (response.success && response.data) {
        setTest(response.data);
      } else {
        setError(response.message || 'Failed to load test details');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load test details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (forceRestart: boolean = false) => {
    if (!test) return;
    
    try {
      setStartingTest(true);
      const response = await testApi.startTest(test._id, { forceRestart });
      
      if (response.success && response.data) {
        if (response.isResuming) {
          toast.success('Resuming your existing test!');
        } else {
          toast.success('Test started successfully!');
        }
        navigate(`/tests/${test._id}/take`, { 
          state: { submissionId: response.data._id } 
        });
      } else {
        toast.error(response.message || 'Failed to start test');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to start test';
      
      // If there's an active submission, ask if they want to retake
      if (errorMessage.includes('already have an active submission')) {
        const shouldRetake = window.confirm(
          'You have an active submission for this test. Do you want to start over? This will abandon your previous progress.'
        );
        
        if (shouldRetake) {
          handleStartTest(true); // Force restart
          return;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setStartingTest(false);
    }
  };

  const handleStartSkillTest = async (skill: string, forceRestart: boolean = false) => {
    if (!test) return;
    
    try {
      setStartingTest(true);
      const response = await testApi.startTest(test._id, { 
        forceRestart, 
        selectedSkills: [skill] 
      });
      
      if (response.success && response.data) {
        if (response.isResuming) {
          toast.success(`Resuming your existing ${skill} test!`);
        } else {
          toast.success(`${skill.charAt(0).toUpperCase() + skill.slice(1)} test started successfully!`);
        }
        navigate(`/tests/${test._id}/take`, { 
          state: { 
            submissionId: response.data._id,
            selectedSkills: [skill]
          } 
        });
      } else {
        toast.error(response.message || `Failed to start ${skill} test`);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || `Failed to start ${skill} test`;
      
      // If there's an active submission, ask if they want to retake
      if (errorMessage.includes('already have an active submission')) {
        const shouldRetake = window.confirm(
          `You have an active submission for this test. Do you want to start a new ${skill} test? This will abandon your previous progress.`
        );
        
        if (shouldRetake) {
          handleStartSkillTest(skill, true); // Force restart
          return;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setStartingTest(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading test</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={loadTestDetails}
                  className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900">Test not found</h3>
            <p className="mt-1 text-sm text-gray-500">The test you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/tests')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Back to Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/tests')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tests
          </button>
        </div>

        {/* Test header */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(test.difficulty)}`}>
                    {test.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">{test.category || 'Practice'}</span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{test.title}</h1>
                <p className="text-lg text-gray-600 mb-6">{test.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{test.totalQuestions}</div>
                    <div className="text-sm text-gray-500">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{formatDuration(test.duration || test.totalTime || 0)}</div>
                    <div className="text-sm text-gray-500">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{test.skills?.length || 0}</div>
                    <div className="text-sm text-gray-500">Skills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{test.statistics?.totalAttempts || 0}</div>
                    <div className="text-sm text-gray-500">Attempts</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {test.skills?.map((skill) => (
                    <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleStartTest()}
                disabled={startingTest}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-center py-3 px-6 rounded-md font-medium transition-colors"
              >
                {startingTest ? 'Starting Full Test...' : 'Start Full Test'}
              </button>
              
              <button
                onClick={() => navigate('/tests')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-center py-3 px-6 rounded-md font-medium transition-colors"
              >
                Browse More Tests
              </button>
            </div>
          </div>
        </div>

        {/* Available Skills */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Choose Your Test</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Reading Test */}
            {((test.readingSections || test.reading?.sections) || []).length > 0 && (
              <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Reading</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {(test.readingSections || test.reading?.sections || []).length} section{(test.readingSections || test.reading?.sections || []).length > 1 ? 's' : ''}
                    • {(test.readingSections || test.reading?.sections || []).reduce((total, section) => total + (section.questions?.length || 0), 0)} questions
                  </p>
                  <button 
                    onClick={() => handleStartSkillTest('reading')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    Start Reading Test
                  </button>
                </div>
              </div>
            )}

            {/* Listening Test */}
            {((test.listeningSections || test.listening?.sections) || []).length > 0 && (
              <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.036 6.636a9 9 0 010 10.728M7.864 9.464a5 5 0 010 5.072" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Listening</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {(test.listeningSections || test.listening?.sections || []).length} section{(test.listeningSections || test.listening?.sections || []).length > 1 ? 's' : ''}
                    • {(test.listeningSections || test.listening?.sections || []).reduce((total, section) => total + (section.questions?.length || 0), 0)} questions
                  </p>
                  <button 
                    onClick={() => handleStartSkillTest('listening')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    Start Listening Test
                  </button>
                </div>
              </div>
            )}

            {/* Writing Test */}
            {((test.writingTasks || test.writing?.tasks) || []).length > 0 && (
              <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Writing</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {(test.writingTasks || test.writing?.tasks || []).length} task{(test.writingTasks || test.writing?.tasks || []).length > 1 ? 's' : ''}
                    • Essay & Report writing
                  </p>
                  <button 
                    onClick={() => handleStartSkillTest('writing')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    Start Writing Test
                  </button>
                </div>
              </div>
            )}

            {/* Speaking Test */}
            {((test.speakingParts || test.speaking?.parts) || []).length > 0 && (
              <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Speaking</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {(test.speakingParts || test.speaking?.parts || []).length} part{(test.speakingParts || test.speaking?.parts || []).length > 1 ? 's' : ''}
                    • Interview & presentation
                  </p>
                  <button 
                    onClick={() => handleStartSkillTest('speaking')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    Start Speaking Test
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        {test.statistics && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Test Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{test.statistics.totalAttempts}</div>
                <div className="text-sm text-gray-500">Total Attempts</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  {test.statistics.averageScore ? test.statistics.averageScore.toFixed(1) : 'N/A'}
                </div>
                <div className="text-sm text-gray-500">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  {test.statistics.averageCompletionTime ? `${test.statistics.averageCompletionTime}min` : 'N/A'}
                </div>
                <div className="text-sm text-gray-500">Avg. Time</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  {test.statistics.completionRate ? `${test.statistics.completionRate}%` : 'N/A'}
                </div>
                <div className="text-sm text-gray-500">Completion Rate</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDetailPage;
