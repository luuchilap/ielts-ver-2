import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submissionApi, testApi } from '../../services/api';
import { TestSubmission } from '../../types';
import toast from 'react-hot-toast';

const ResultDetailPage: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  
  const [submission, setSubmission] = useState<TestSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (submissionId) {
      loadSubmissionDetails();
    }
  }, [submissionId]);

  const loadSubmissionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await submissionApi.getSubmissionDetails(submissionId!);
      
      if (response.success && response.data) {
        setSubmission(response.data);
      } else {
        setError(response.message || 'Failed to load test results');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load test results';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 60 / 60);
    const minutes = Math.floor((seconds / 60) % 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6.5) return 'text-blue-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6.5) return 'bg-blue-100 text-blue-800';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'abandoned':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateAccuracy = (correct: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
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
                <h3 className="text-sm font-medium text-red-800">Error loading results</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={loadSubmissionDetails}
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

  if (!submission) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900">Results not found</h3>
            <p className="mt-1 text-sm text-gray-500">The test results you're looking for don't exist or have been removed.</p>
            <button
              onClick={() => navigate('/results')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Back to Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/results')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Results
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
              <p className="text-gray-600 mt-1">
                Completed on {new Date(submission.endTime || submission.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(submission.status)}`}>
              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Score</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Overall Band Score */}
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(submission.scores?.overall || 0)} mb-2`}>
                {submission.scores?.overall ? submission.scores.overall.toFixed(1) : 'N/A'}
              </div>
              <div className="text-sm text-gray-500">Overall Band Score</div>
            </div>
            
            {/* Individual Skills */}
            <div className="col-span-1 md:col-span-1 lg:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                {submission.scores?.reading !== undefined && (
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(submission.scores.reading)} mb-1`}>
                      {submission.scores.reading.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">Reading</div>
                  </div>
                )}
                
                {submission.scores?.listening !== undefined && (
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(submission.scores.listening)} mb-1`}>
                      {submission.scores.listening.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">Listening</div>
                  </div>
                )}
                
                {submission.scores?.writing !== undefined && (
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(submission.scores.writing)} mb-1`}>
                      {submission.scores.writing.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">Writing</div>
                  </div>
                )}
                
                {submission.scores?.speaking !== undefined && (
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(submission.scores.speaking)} mb-1`}>
                      {submission.scores.speaking.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">Speaking</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Summary</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {submission.results?.correctAnswers || 0}
              </div>
              <div className="text-sm text-gray-500">Correct Answers</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {submission.results?.totalQuestions || 0}
              </div>
              <div className="text-sm text-gray-500">Total Questions</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {calculateAccuracy(submission.results?.correctAnswers || 0, submission.results?.totalQuestions || 0)}%
              </div>
              <div className="text-sm text-gray-500">Accuracy</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {submission.totalTimeSpent ? formatDuration(submission.totalTimeSpent) : 'N/A'}
              </div>
              <div className="text-sm text-gray-500">Time Taken</div>
            </div>
          </div>
        </div>

        {/* Skill Breakdown */}
        {submission.results?.skillBreakdown && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skill Breakdown</h2>
            
            <div className="space-y-4">
              {submission.results.skillBreakdown.reading && (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900">Reading</div>
                      <div className="text-sm text-gray-500">
                        {submission.results.skillBreakdown.reading.correct} / {submission.results.skillBreakdown.reading.total} correct
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {submission.results.skillBreakdown.reading.percentage}%
                    </div>
                    {submission.scores?.reading && (
                      <div className={`text-sm font-medium ${getScoreColor(submission.scores.reading)}`}>
                        Band {submission.scores.reading.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {submission.results.skillBreakdown.listening && (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.036 6.636a9 9 0 010 10.728M7.864 9.464a5 5 0 010 5.072" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900">Listening</div>
                      <div className="text-sm text-gray-500">
                        {submission.results.skillBreakdown.listening.correct} / {submission.results.skillBreakdown.listening.total} correct
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {submission.results.skillBreakdown.listening.percentage}%
                    </div>
                    {submission.scores?.listening && (
                      <div className={`text-sm font-medium ${getScoreColor(submission.scores.listening)}`}>
                        Band {submission.scores.listening.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {submission.results.skillBreakdown.writing && (
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900">Writing</div>
                      <div className="text-sm text-gray-500">
                        {submission.results.skillBreakdown.writing.task1Score && `Task 1: ${submission.results.skillBreakdown.writing.task1Score}`}
                        {submission.results.skillBreakdown.writing.task2Score && ` | Task 2: ${submission.results.skillBreakdown.writing.task2Score}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {submission.scores?.writing && (
                      <div className={`text-lg font-bold ${getScoreColor(submission.scores.writing)}`}>
                        Band {submission.scores.writing.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {submission.results.skillBreakdown.speaking && (
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900">Speaking</div>
                      <div className="text-sm text-gray-500">
                        {submission.results.skillBreakdown.speaking.part1Score && `Part 1: ${submission.results.skillBreakdown.speaking.part1Score}`}
                        {submission.results.skillBreakdown.speaking.part2Score && ` | Part 2: ${submission.results.skillBreakdown.speaking.part2Score}`}
                        {submission.results.skillBreakdown.speaking.part3Score && ` | Part 3: ${submission.results.skillBreakdown.speaking.part3Score}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {submission.scores?.speaking && (
                      <div className={`text-lg font-bold ${getScoreColor(submission.scores.speaking)}`}>
                        Band {submission.scores.speaking.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Feedback */}
        {submission.feedback && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Feedback</h2>
            
            {submission.feedback.automated && (
              <div className="space-y-4">
                {submission.feedback.automated.strengths && submission.feedback.automated.strengths.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-green-900 mb-2">Strengths</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {submission.feedback.automated.strengths.map((strength, index) => (
                        <li key={index} className="text-green-700">{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {submission.feedback.automated.weaknesses && submission.feedback.automated.weaknesses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-red-900 mb-2">Areas for Improvement</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {submission.feedback.automated.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-red-700">{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {submission.feedback.automated.recommendations && submission.feedback.automated.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-blue-900 mb-2">Recommendations</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {submission.feedback.automated.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-blue-700">{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {submission.feedback.manual?.detailedFeedback && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Examiner Feedback</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{submission.feedback.manual.detailedFeedback}</p>
                {submission.feedback.manual.reviewedAt && (
                  <p className="text-sm text-gray-500 mt-2">
                    Reviewed on {new Date(submission.feedback.manual.reviewedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                if (submission.testId) {
                  navigate(`/tests/${submission.testId}`);
                }
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-6 rounded-md font-medium transition-colors"
            >
              Retake Test
            </button>
            
            <button
              onClick={() => navigate('/tests')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-center py-3 px-6 rounded-md font-medium transition-colors"
            >
              Browse Tests
            </button>
            
            <button
              onClick={() => navigate('/results')}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-3 px-6 rounded-md font-medium transition-colors"
            >
              View All Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDetailPage;
