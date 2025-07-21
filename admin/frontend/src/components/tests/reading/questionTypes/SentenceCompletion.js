import React from 'react';
import { ArrowRight } from 'lucide-react';

const SentenceCompletion = ({ content, onChange }) => {
  const { 
    beginning = '', 
    completion = '', 
    maxWords = 3,
    explanation = '' 
  } = content;

  const handleBeginningChange = (value) => {
    onChange({ beginning: value });
  };

  const handleCompletionChange = (value) => {
    onChange({ completion: value });
  };

  const handleMaxWordsChange = (value) => {
    onChange({ maxWords: parseInt(value) });
  };

  const handleExplanationChange = (value) => {
    onChange({ explanation: value });
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Instructions:</h4>
        <p className="text-sm text-blue-800">
          Students complete sentences using information from the passage. 
          Provide the beginning of the sentence and the correct completion.
        </p>
      </div>

      {/* Sentence Beginning */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sentence Beginning
        </label>
        <textarea
          value={beginning}
          onChange={(e) => handleBeginningChange(e.target.value)}
          placeholder="Enter the beginning part of the sentence that students will see..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
        <p className="text-xs text-gray-500 mt-1">
          This part will be visible to students. End with "..." or leave it open-ended.
        </p>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Student View:</h4>
        <div className="flex items-center space-x-2">
          <p className="text-gray-900 leading-relaxed">
            {beginning || 'Enter sentence beginning above...'}
          </p>
          <div className="border-b-2 border-gray-400 border-dashed min-w-[100px] h-6 flex items-end">
            <span className="text-xs text-gray-500 mb-1">
              (max {maxWords} word{maxWords > 1 ? 's' : ''})
            </span>
          </div>
        </div>
      </div>

      {/* Max Words Setting */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Words for Completion
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
          This limit will be shown to students
        </p>
      </div>

      {/* Correct Completion */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correct Completion
        </label>
        <input
          type="text"
          value={completion}
          onChange={(e) => handleCompletionChange(e.target.value)}
          placeholder="Enter the correct completion (words that complete the sentence)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate acceptable alternatives with | (e.g., "very important|extremely important|crucial")
        </p>
      </div>

      {/* Complete Sentence Preview */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-900 mb-2">Complete Sentence:</h4>
        <div className="flex items-center space-x-2">
          <span className="text-green-800">
            {beginning}
          </span>
          <ArrowRight className="w-4 h-4 text-green-600" />
          <span className="font-medium text-green-900">
            {completion || '[completion needed]'}
          </span>
        </div>
        {completion && (
          <div className="mt-2 text-sm text-green-700">
            Word count: {completion.split(/\s+/).filter(word => word.length > 0).length} / {maxWords} max
          </div>
        )}
      </div>

      {/* Word Count Validation */}
      {completion && (
        <div className={`p-3 rounded-lg ${
          completion.split(/\s+/).filter(word => word.length > 0).length <= maxWords
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            <span className={`text-sm font-medium ${
              completion.split(/\s+/).filter(word => word.length > 0).length <= maxWords
                ? 'text-green-800'
                : 'text-red-800'
            }`}>
              {completion.split(/\s+/).filter(word => word.length > 0).length <= maxWords
                ? '✓ Word count is within limit'
                : '⚠ Word count exceeds limit'
              }
            </span>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Explanation
        </label>
        <textarea
          value={explanation}
          onChange={(e) => handleExplanationChange(e.target.value)}
          placeholder="Explain where in the passage this information can be found and why this completion is correct..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="4"
        />
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Guidelines:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Sentence beginning should provide clear context</li>
          <li>• Completion should be taken directly from the passage</li>
          <li>• Maximum {maxWords} word{maxWords > 1 ? 's' : ''} for completion</li>
          <li>• Test understanding of specific details or relationships</li>
          <li>• Avoid completions that could have multiple valid answers</li>
          <li>• Use | to separate acceptable alternative answers</li>
        </ul>
      </div>
    </div>
  );
};

export default SentenceCompletion; 