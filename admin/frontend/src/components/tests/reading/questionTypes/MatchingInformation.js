import React from 'react';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

const MatchingInformation = ({ content, onChange }) => {
  const { 
    information = ['', '', '', ''], 
    paragraphs = ['A', 'B', 'C', 'D'], 
    correctMatches = {},
    explanation = '' 
  } = content;

  const handleInformationChange = (index, value) => {
    const newInformation = [...information];
    newInformation[index] = value;
    onChange({ information: newInformation });
  };

  const handleParagraphChange = (index, value) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = value;
    onChange({ paragraphs: newParagraphs });
  };

  const handleAddInformation = () => {
    if (information.length < 10) {
      onChange({ information: [...information, ''] });
    }
  };

  const handleRemoveInformation = (index) => {
    if (information.length > 2) {
      const newInformation = information.filter((_, i) => i !== index);
      // Remove any matches that used this information
      const newCorrectMatches = { ...correctMatches };
      Object.keys(newCorrectMatches).forEach(infoIndex => {
        if (parseInt(infoIndex) === index) {
          delete newCorrectMatches[infoIndex];
        } else if (parseInt(infoIndex) > index) {
          const newKey = parseInt(infoIndex) - 1;
          newCorrectMatches[newKey] = newCorrectMatches[infoIndex];
          delete newCorrectMatches[infoIndex];
        }
      });
      onChange({ information: newInformation, correctMatches: newCorrectMatches });
    }
  };

  const handleAddParagraph = () => {
    if (paragraphs.length < 8) {
      const nextLetter = String.fromCharCode(65 + paragraphs.length); // A, B, C, etc.
      onChange({ paragraphs: [...paragraphs, nextLetter] });
    }
  };

  const handleRemoveParagraph = (index) => {
    if (paragraphs.length > 2) {
      const newParagraphs = paragraphs.filter((_, i) => i !== index);
      // Remove any matches that used this paragraph
      const newCorrectMatches = { ...correctMatches };
      Object.keys(newCorrectMatches).forEach(infoIndex => {
        if (newCorrectMatches[infoIndex] === paragraphs[index]) {
          delete newCorrectMatches[infoIndex];
        }
      });
      onChange({ paragraphs: newParagraphs, correctMatches: newCorrectMatches });
    }
  };

  const handleMatchChange = (informationIndex, paragraphLabel) => {
    const newCorrectMatches = { ...correctMatches };
    if (paragraphLabel === '') {
      delete newCorrectMatches[informationIndex];
    } else {
      newCorrectMatches[informationIndex] = paragraphLabel;
    }
    onChange({ correctMatches: newCorrectMatches });
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
          Students will match specific information to the paragraphs where it appears. 
          Each piece of information should appear in only one paragraph.
        </p>
      </div>

      {/* Information Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Information to Match
        </label>
        <div className="space-y-3">
          {information.map((info, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded font-medium text-sm mt-1">
                {index + 1}
              </div>
              
              <div className="flex-1">
                <textarea
                  value={info}
                  onChange={(e) => handleInformationChange(index, e.target.value)}
                  placeholder={`Information ${index + 1} - specific detail or fact to match`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                />
              </div>

              <div className="flex items-center space-x-2 mt-1">
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <select
                  value={correctMatches[index] || ''}
                  onChange={(e) => handleMatchChange(index, e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded"
                >
                  <option value="">Select paragraph</option>
                  {paragraphs.map((paragraph, paragraphIndex) => (
                    <option key={paragraphIndex} value={paragraph}>
                      Paragraph {paragraph}
                    </option>
                  ))}
                </select>
              </div>
              
              {information.length > 2 && (
                <button
                  onClick={() => handleRemoveInformation(index)}
                  className="p-2 text-red-400 hover:text-red-600 mt-1"
                  title="Remove information"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          
          {information.length < 10 && (
            <button
              onClick={handleAddInformation}
              className="flex items-center px-3 py-2 text-purple-600 hover:text-purple-700 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Information
            </button>
          )}
        </div>
      </div>

      {/* Paragraphs Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Paragraph Labels (Reference points in the passage)
        </label>
        <div className="space-y-3">
          {paragraphs.map((paragraph, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded font-medium text-sm">
                {paragraph}
              </div>
              
              <div className="flex-1">
                <input
                  type="text"
                  value={paragraph}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  placeholder={`Paragraph ${paragraph}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Usually letters (A, B, C) or roman numerals (i, ii, iii)
                </p>
              </div>
              
              {paragraphs.length > 2 && (
                <button
                  onClick={() => handleRemoveParagraph(index)}
                  className="p-2 text-red-400 hover:text-red-600"
                  title="Remove paragraph"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          
          {paragraphs.length < 8 && (
            <button
              onClick={handleAddParagraph}
              className="flex items-center px-3 py-2 text-green-600 hover:text-green-700 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Paragraph
            </button>
          )}
        </div>
      </div>

      {/* Correct Matches Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-900 mb-3">Correct Matches:</h4>
        <div className="space-y-2">
          {information.map((info, index) => (
            <div key={index} className="flex items-start text-sm text-green-800">
              <span className="font-medium mr-2">{index + 1}.</span>
              <span className="flex-1">
                {info.substring(0, 50)}{info.length > 50 ? '...' : ''}
              </span>
              <ArrowRight className="w-4 h-4 mx-2 mt-0.5" />
              <span className="font-medium">
                {correctMatches[index] ? 
                  `Paragraph ${correctMatches[index]}` : 
                  'Not matched'
                }
              </span>
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
          placeholder="Explain where each piece of information can be found and why..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Guidelines:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Each piece of information should appear in only one paragraph</li>
          <li>• Information should be specific facts, dates, names, or details</li>
          <li>• Usually more information items than paragraphs (some paragraphs may not be used)</li>
          <li>• Information should be clearly stated, not inferred</li>
          <li>• Test ability to locate specific details in text</li>
        </ul>
      </div>
    </div>
  );
};

export default MatchingInformation; 