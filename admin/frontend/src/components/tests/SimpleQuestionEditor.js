import React, { useState } from 'react';
import { Plus, Trash2, Hash, HelpCircle, Edit3 } from 'lucide-react';

const SimpleQuestionEditor = ({ question, onChange }) => {
  const { statement = '', answer = '', explanation = '', maxWords = 3 } = question.content || {};

  const handleContentChange = (updates) => {
    onChange({
      ...question,
      content: {
        ...question.content,
        ...updates
      }
    });
  };

  const getWordCount = (text) => {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <div className="space-y-4">
      {/* Statement Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Statement/Question
        </label>
        <textarea
          value={statement}
          onChange={(e) => handleContentChange({ statement: e.target.value })}
          placeholder="Enter your statement or question here. Use _____ where students should fill in the answer.

Example: 
- The capital of France is _____.
- What is the largest planet in our solar system? _____
- Complete the sentence: I usually go to work by _____."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="4"
        />
        <p className="text-xs text-gray-500 mt-1">
          Use _____ to indicate where students should write their answer
        </p>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Student View:</h4>
        <div className="space-y-3">
          {statement ? (
            <div className="text-gray-900 leading-relaxed">
              {statement.split('_____').map((part, index, array) => (
                <React.Fragment key={index}>
                  {part}
                  {index < array.length - 1 && (
                    <span className="inline-block border-b-2 border-gray-400 border-dashed mx-2 min-w-[80px]">
                      <span className="invisible">answer</span>
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Enter statement above to see preview...</p>
          )}
          
          {statement.includes('_____') && (
            <p className="text-xs text-blue-600">
              (Maximum {maxWords} word{maxWords > 1 ? 's' : ''} per answer)
            </p>
          )}
        </div>
      </div>

      {/* Max Words Setting */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Words per Answer
        </label>
        <select
          value={maxWords}
          onChange={(e) => handleContentChange({ maxWords: parseInt(e.target.value) })}
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
          onChange={(e) => handleContentChange({ answer: e.target.value })}
          placeholder="Enter the correct answer"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate acceptable alternatives with | (e.g., "Paris|paris|PARIS")
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
        <h4 className="text-sm font-medium text-green-900 mb-2">Question Summary:</h4>
        <div className="text-sm text-green-800 space-y-1">
          <div><strong>Statement:</strong> {statement || 'Not set'}</div>
          <div><strong>Answer:</strong> {answer || 'Not set'}</div>
          <div><strong>Word Limit:</strong> {maxWords} word{maxWords > 1 ? 's' : ''}</div>
          <div><strong>Blanks Found:</strong> {(statement.match(/_____/g) || []).length}</div>
        </div>
      </div>

      {/* Explanation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Explanation (Optional)
        </label>
        <textarea
          value={explanation}
          onChange={(e) => handleContentChange({ explanation: e.target.value })}
          placeholder="Explain the correct answer and provide any additional context..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Guidelines:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Use _____ to mark where students should fill in answers</li>
          <li>• Keep statements clear and unambiguous</li>
          <li>• Maximum {maxWords} word{maxWords > 1 ? 's' : ''} per answer</li>
          <li>• Use | to separate acceptable alternative answers</li>
          <li>• Test specific knowledge from the passage/audio</li>
          <li>• Avoid questions requiring personal opinions</li>
        </ul>
      </div>

      {/* Question Examples */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">Good Question Examples:</h4>
        <ul className="text-xs text-yellow-800 space-y-1">
          <li>• "The research was conducted in _____." (Answer: 2019|2019)</li>
          <li>• "According to the passage, _____ is the main cause." (Answer: pollution)</li>
          <li>• "The author suggests that people should _____." (Answer: exercise regularly)</li>
          <li>• "What percentage of students passed? _____%" (Answer: 85)</li>
          <li>• "The study involved _____ participants." (Answer: 500|five hundred)</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleQuestionEditor; 