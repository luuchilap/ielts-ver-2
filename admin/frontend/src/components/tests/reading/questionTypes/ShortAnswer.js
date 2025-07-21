import React from 'react';
import { HelpCircle } from 'lucide-react';

const ShortAnswer = ({ content, onChange }) => {
  const { 
    question = '', 
    answer = '', 
    maxWords = 3,
    explanation = '' 
  } = content;

  const handleQuestionChange = (value) => {
    onChange({ question: value });
  };

  const handleAnswerChange = (value) => {
    onChange({ answer: value });
  };

  const handleMaxWordsChange = (value) => {
    onChange({ maxWords: parseInt(value) });
  };

  const handleExplanationChange = (value) => {
    onChange({ explanation: value });
  };

  const getWordCount = (text) => {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Instructions:</h4>
        <p className="text-sm text-blue-800">
          Students answer questions with short responses based on information from the passage. 
          Answers should be factual and taken directly from the text.
        </p>
      </div>

      {/* Question */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question
        </label>
        <textarea
          value={question}
          onChange={(e) => handleQuestionChange(e.target.value)}
          placeholder="Enter a clear, specific question that can be answered from the passage..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
        <p className="text-xs text-gray-500 mt-1">
          Questions should be clear and have only one correct answer
        </p>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Student View:</h4>
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <p className="text-gray-900 leading-relaxed">
              {question || 'Enter question above...'}
            </p>
          </div>
          <div className="ml-7">
            <div className="border-b-2 border-gray-400 border-dashed w-64 h-8 flex items-end">
              <span className="text-xs text-gray-500 mb-1">
                (Answer in {maxWords} word{maxWords > 1 ? 's' : ''} or fewer)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Max Words Setting */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Words for Answer
        </label>
        <select
          value={maxWords}
          onChange={(e) => handleMaxWordsChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {[1, 2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>{num} word{num > 1 ? 's' : ''}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          This limit will be enforced for student answers
        </p>
      </div>

      {/* Correct Answer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correct Answer
        </label>
        <input
          type="text"
          value={answer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="Enter the correct short answer"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate acceptable alternatives with | (e.g., "2010|two thousand and ten|2010s")
        </p>
      </div>

      {/* Answer Analysis */}
      {answer && (
        <div className="space-y-3">
          {/* Word Count Check */}
          <div className={`p-3 rounded-lg ${
            getWordCount(answer) <= maxWords
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${
                getWordCount(answer) <= maxWords
                  ? 'text-green-800'
                  : 'text-red-800'
              }`}>
                {getWordCount(answer) <= maxWords
                  ? '✓ Answer length is valid'
                  : '⚠ Answer exceeds word limit'
                }
              </span>
              <span className={`text-sm ${
                getWordCount(answer) <= maxWords
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {getWordCount(answer)} / {maxWords} words
              </span>
            </div>
          </div>

          {/* Alternative Answers */}
          {answer.includes('|') && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h5 className="text-sm font-medium text-blue-900 mb-2">Acceptable Answers:</h5>
              <div className="space-y-1">
                {answer.split('|').map((alt, index) => (
                  <div key={index} className="flex items-center justify-between text-sm text-blue-800">
                    <span>• {alt.trim()}</span>
                    <span className="text-blue-600">
                      ({getWordCount(alt.trim())} word{getWordCount(alt.trim()) > 1 ? 's' : ''})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Answer Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-900 mb-2">Answer Summary:</h4>
        <div className="text-sm text-green-800">
          <div><strong>Question:</strong> {question || 'Not set'}</div>
          <div><strong>Answer:</strong> {answer || 'Not set'}</div>
          <div><strong>Word Limit:</strong> {maxWords} word{maxWords > 1 ? 's' : ''}</div>
        </div>
      </div>

      {/* Explanation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Explanation
        </label>
        <textarea
          value={explanation}
          onChange={(e) => handleExplanationChange(e.target.value)}
          placeholder="Explain where in the passage this answer can be found and provide any additional context..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="4"
        />
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Guidelines:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Questions should be specific and unambiguous</li>
          <li>• Answers must be taken directly from the passage</li>
          <li>• Maximum {maxWords} word{maxWords > 1 ? 's' : ''} per answer</li>
          <li>• Test factual information (names, dates, numbers, etc.)</li>
          <li>• Avoid questions requiring interpretation or opinion</li>
          <li>• Use | to separate acceptable alternative spellings/forms</li>
          <li>• Common question types: What, When, Where, Who, How many</li>
        </ul>
      </div>

      {/* Question Examples */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">Good Question Examples:</h4>
        <ul className="text-xs text-yellow-800 space-y-1">
          <li>• "What year was the study conducted?"</li>
          <li>• "How many participants were involved in the research?"</li>
          <li>• "What is the name of the main researcher?"</li>
          <li>• "Where did the experiment take place?"</li>
          <li>• "What percentage of students passed the test?"</li>
        </ul>
      </div>
    </div>
  );
};

export default ShortAnswer; 