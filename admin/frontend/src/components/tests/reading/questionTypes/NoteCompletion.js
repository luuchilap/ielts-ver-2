import React from 'react';
import { Plus, Trash2, Hash } from 'lucide-react';

const NoteCompletion = ({ content, onChange }) => {
  const { notes = '', blanks = [''], maxWords = 2, explanation = '' } = content;

  const handleNotesChange = (value) => {
    onChange({ notes: value });
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
    let preview = notes;
    blanks.forEach((blank, index) => {
      const placeholder = `_____${index + 1}_____`;
      preview = preview.replace(`{${index + 1}}`, placeholder);
    });
    return preview;
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Instructions:</h4>
        <p className="text-sm text-blue-800">
          Students complete notes by filling in missing information while listening to the audio.
          This tests ability to identify specific details and key information.
        </p>
      </div>

      {/* Notes Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes Template with Blanks
        </label>
        <textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Enter notes structure with {1}, {2}, {3} etc. for blanks.

Example:
Meeting Notes
Date: {1}
Attendees: John, Sarah, {2}
Main topics:
• Budget: ${3} allocated
• Deadline: {4}
• Next meeting: {5}"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="8"
        />
        <p className="text-xs text-gray-500 mt-1">
          Use {`{1}`}, {`{2}`}, {`{3}`} etc. to mark where blanks should appear
        </p>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
        <pre className="text-gray-900 leading-relaxed whitespace-pre-wrap font-mono text-sm">
          {generatePreview() || 'Enter notes above to see preview...'}
        </pre>
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
                  placeholder={`Answer for blank ${index + 1} (separate alternatives with |)`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use | to separate acceptable answers (e.g., "Monday|Mon|tomorrow")
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
          placeholder="Explain where in the audio these answers can be found and provide context..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Guidelines:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Use realistic note-taking format (bullet points, headings, etc.)</li>
          <li>• Maximum {maxWords} word{maxWords > 1 ? 's' : ''} per blank</li>
          <li>• Focus on key facts: names, dates, numbers, locations</li>
          <li>• Answers should be heard clearly in the audio</li>
          <li>• Use logical note structure that students might actually take</li>
          <li>• Include context clues around blanks</li>
        </ul>
      </div>

      {/* Examples */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">Good Examples:</h4>
        <div className="text-xs text-yellow-800 space-y-2">
          <div>
            <strong>Meeting Notes:</strong><br/>
            Date: {`{1}`}<br/>
            Location: {`{2}`} Building<br/>
            Participants: John, Sarah, {`{3}`}
          </div>
          <div>
            <strong>Course Information:</strong><br/>
            • Course code: {`{1}`}<br/>
            • Duration: {`{2}`} weeks<br/>
            • Cost: ${`{3}`}<br/>
            • Start date: {`{4}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCompletion; 