import React from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const SummaryCompletion = ({ content, onChange }) => {
  const { 
    summary = '', 
    wordBank = [], 
    useWordBank = true, 
    maxWords = 2,
    explanation = '' 
  } = content;

  const handleSummaryChange = (value) => {
    onChange({ summary: value });
  };

  const handleWordBankChange = (index, value) => {
    const newWordBank = [...wordBank];
    newWordBank[index] = value;
    onChange({ wordBank: newWordBank });
  };

  const handleAddWord = () => {
    if (wordBank.length < 20) {
      onChange({ wordBank: [...wordBank, ''] });
    }
  };

  const handleRemoveWord = (index) => {
    if (wordBank.length > 1) {
      const newWordBank = wordBank.filter((_, i) => i !== index);
      onChange({ wordBank: newWordBank });
    }
  };

  const handleUseWordBankToggle = () => {
    onChange({ useWordBank: !useWordBank });
  };

  const handleMaxWordsChange = (value) => {
    onChange({ maxWords: parseInt(value) });
  };

  const handleExplanationChange = (value) => {
    onChange({ explanation: value });
  };

  // Generate preview with blanks
  const generatePreview = () => {
    let preview = summary;
    let blankCount = 0;
    
    // Replace {1}, {2}, etc. with numbered blanks
    preview = preview.replace(/\{(\d+)\}/g, (match, number) => {
      blankCount++;
      return `_____${number}_____`;
    });
    
    return { preview, blankCount };
  };

  const { preview, blankCount } = generatePreview();

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Instructions:</h4>
        <p className="text-sm text-blue-800">
          Students complete a summary of part of the passage. They can either choose from a word bank or fill in blanks freely.
        </p>
      </div>

      {/* Summary Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Summary Text with Blanks
        </label>
        <textarea
          value={summary}
          onChange={(e) => handleSummaryChange(e.target.value)}
          placeholder="Enter summary with {1}, {2}, {3} etc. for blanks. Example: The research shows that {1} is important for {2}."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="6"
        />
        <p className="text-xs text-gray-500 mt-1">
          Use {`{1}`}, {`{2}`}, {`{3}`} etc. to mark where blanks should appear
        </p>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
          {preview || 'Enter summary above to see preview...'}
        </p>
        {blankCount > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            Total blanks: {blankCount}
          </p>
        )}
      </div>

      {/* Word Bank Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Use Word Bank
          </label>
          <button
            onClick={handleUseWordBankToggle}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              useWordBank 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {useWordBank ? (
              <>
                <ToggleRight className="w-5 h-5" />
                <span>Word Bank Enabled</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-5 h-5" />
                <span>Free Text Input</span>
              </>
            )}
          </button>
        </div>

        {!useWordBank && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Words per Blank
            </label>
            <select
              value={maxWords}
              onChange={(e) => handleMaxWordsChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} word{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Word Bank */}
      {useWordBank && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Word Bank (Options for students to choose from)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {wordBank.map((word, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={word}
                  onChange={(e) => handleWordBankChange(index, e.target.value)}
                  placeholder={`Word ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {wordBank.length > 1 && (
                  <button
                    onClick={() => handleRemoveWord(index)}
                    className="p-1 text-red-400 hover:text-red-600"
                    title="Remove word"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {wordBank.length < 20 && (
            <button
              onClick={handleAddWord}
              className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 text-sm mt-3"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Word
            </button>
          )}
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-yellow-800">
              <strong>Tip:</strong> Include more words than blanks to create distractors. 
              Typically 2-3 extra words that don't fit anywhere.
            </p>
          </div>
        </div>
      )}

      {/* Answer Key Instructions */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-900 mb-2">Answer Key:</h4>
        <div className="text-sm text-green-800">
          {blankCount > 0 ? (
            <div className="space-y-1">
              <p>Create answer key for {blankCount} blank{blankCount > 1 ? 's' : ''}:</p>
              {Array.from({ length: blankCount }, (_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <span>Blank {i + 1}:</span>
                  <input
                    type="text"
                    placeholder="Correct answer"
                    className="px-2 py-1 border border-green-300 rounded text-sm"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>Add blanks to the summary to create answer key</p>
          )}
        </div>
      </div>

      {/* Explanation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Explanation (Optional)
        </label>
        <textarea
          value={explanation}
          onChange={(e) => handleExplanationChange(e.target.value)}
          placeholder="Explain the correct answers and provide context from the passage..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Guidelines:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Summary should cover main points of a passage section</li>
          <li>• Use {`{1}`}, {`{2}`}, {`{3}`} to mark blank positions</li>
          <li>• {useWordBank ? 'Include extra words as distractors in word bank' : `Maximum ${maxWords} word${maxWords > 1 ? 's' : ''} per blank`}</li>
          <li>• Blanks should test key vocabulary and concepts</li>
          <li>• Answers should be taken directly from the passage</li>
          <li>• Maintain logical flow and coherence in the summary</li>
        </ul>
      </div>
    </div>
  );
};

export default SummaryCompletion; 