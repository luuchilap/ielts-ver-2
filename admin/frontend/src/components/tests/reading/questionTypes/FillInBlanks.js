import React from 'react';
import { Plus, Trash2, Hash } from 'lucide-react';

const FillInBlanks = ({ content, onChange }) => {
  const { sentence = '', blanks = [''], maxWords = 1, explanation = '' } = content;

  const handleSentenceChange = (value) => {
    onChange({ sentence: value });
  };

  const handleBlankChange = (index, value) => {
    const newBlanks = [...blanks];
    newBlanks[index] = value;
    onChange({ blanks: newBlanks });
  };

  const handleAddBlank = () => {
    if (blanks.length < 10) {
      onChange({ blanks: [...blanks, ''] });
    }
  };

  const handleRemoveBlank = (index) => {
    if (blanks.length > 1) {
      const newBlanks = blanks.filter((_, i) => i !== index);
      onChange({ blanks: newBlanks });
    }
  };

  const handleMaxWordsChange = (value) => {
    onChange({ maxWords: parseInt(value) });
  };

  const handleExplanationChange = (value) => {
    onChange({ explanation: value });
  };

  // Generate preview with blanks
  const generatePreview = () => {
    let preview = sentence;
    blanks.forEach((blank, index) => {
      const placeholder = `_____${index + 1}_____`;
      preview = preview.replace(`{${index + 1}}`, placeholder);
    });
    return preview;
  };

  return (
    <div className="space-y-6">
      {/* Sentence Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sentence with Blanks
        </label>
        <textarea
          value={sentence}
          onChange={(e) => handleSentenceChange(e.target.value)}
          placeholder="Enter sentence with {1}, {2}, {3} etc. for blanks. Example: The {1} was very {2} and {3}."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
        <p className="text-xs text-gray-500 mt-1">
          Use {`{1}`}, {`{2}`}, {`{3}`} etc. to mark where blanks should appear
        </p>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
        <p className="text-gray-900 leading-relaxed">
          {generatePreview() || 'Enter sentence above to see preview...'}
        </p>
      </div>

      {/* Max Words Setting */}
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

      {/* Blank Answers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Correct Answers for Each Blank
        </label>
        <div className="space-y-3">
          {blanks.map((blank, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded font-medium text-sm">
                {index + 1}
              </div>
              
              <div className="flex-1">
                <input
                  type="text"
                  value={blank}
                  onChange={(e) => handleBlankChange(index, e.target.value)}
                  placeholder={`Answer for blank ${index + 1} (separate synonyms with |)`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use | to separate acceptable answers (e.g., "big|large|huge")
                </p>
              </div>
              
              {blanks.length > 1 && (
                <button
                  onClick={() => handleRemoveBlank(index)}
                  className="p-2 text-red-400 hover:text-red-600"
                  title="Remove blank"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          
          {blanks.length < 10 && (
            <button
              onClick={handleAddBlank}
              className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Blank
            </button>
          )}
        </div>
      </div>

      {/* Answer Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-green-900 mb-2">Answer Key:</h4>
        <div className="space-y-1">
          {blanks.map((blank, index) => (
            <div key={index} className="text-sm text-green-800">
              <strong>Blank {index + 1}:</strong> {blank || 'Not set'}
            </div>
          ))}
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
          placeholder="Explain the correct answers and provide context..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Guidelines:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Use {`{1}`}, {`{2}`}, {`{3}`} to mark blank positions in the sentence</li>
          <li>• Maximum {maxWords} word{maxWords > 1 ? 's' : ''} per blank</li>
          <li>• Provide synonyms separated by | (pipe) character</li>
          <li>• Ensure blanks test key vocabulary or grammar</li>
          <li>• Answers should be taken directly from the passage</li>
        </ul>
      </div>
    </div>
  );
};

export default FillInBlanks; 