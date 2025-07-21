import React from 'react';
import { Plus, Trash2, ArrowRight, Shuffle } from 'lucide-react';

const MatchingHeadings = ({ content, onChange }) => {
  const { 
    headings = ['', '', '', ''], 
    paragraphs = ['', '', ''], 
    correctMatches = {},
    explanation = '' 
  } = content;

  const handleHeadingChange = (index, value) => {
    const newHeadings = [...headings];
    newHeadings[index] = value;
    onChange({ headings: newHeadings });
  };

  const handleParagraphChange = (index, value) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = value;
    onChange({ paragraphs: newParagraphs });
  };

  const handleAddHeading = () => {
    if (headings.length < 10) {
      onChange({ headings: [...headings, ''] });
    }
  };

  const handleRemoveHeading = (index) => {
    if (headings.length > 2) {
      const newHeadings = headings.filter((_, i) => i !== index);
      // Remove any matches that used this heading
      const newCorrectMatches = { ...correctMatches };
      Object.keys(newCorrectMatches).forEach(paragraphIndex => {
        if (newCorrectMatches[paragraphIndex] === index) {
          delete newCorrectMatches[paragraphIndex];
        } else if (newCorrectMatches[paragraphIndex] > index) {
          newCorrectMatches[paragraphIndex] -= 1;
        }
      });
      onChange({ headings: newHeadings, correctMatches: newCorrectMatches });
    }
  };

  const handleAddParagraph = () => {
    if (paragraphs.length < 8) {
      onChange({ paragraphs: [...paragraphs, ''] });
    }
  };

  const handleRemoveParagraph = (index) => {
    if (paragraphs.length > 2) {
      const newParagraphs = paragraphs.filter((_, i) => i !== index);
      // Remove any matches for this paragraph and adjust indices
      const newCorrectMatches = { ...correctMatches };
      delete newCorrectMatches[index];
      
      // Adjust paragraph indices
      const adjustedMatches = {};
      Object.keys(newCorrectMatches).forEach(paragraphIndex => {
        const numIndex = parseInt(paragraphIndex);
        if (numIndex > index) {
          adjustedMatches[numIndex - 1] = newCorrectMatches[paragraphIndex];
        } else if (numIndex < index) {
          adjustedMatches[numIndex] = newCorrectMatches[paragraphIndex];
        }
      });
      
      onChange({ paragraphs: newParagraphs, correctMatches: adjustedMatches });
    }
  };

  const handleMatchChange = (paragraphIndex, headingIndex) => {
    const newCorrectMatches = { ...correctMatches };
    if (headingIndex === '') {
      delete newCorrectMatches[paragraphIndex];
    } else {
      newCorrectMatches[paragraphIndex] = parseInt(headingIndex);
    }
    onChange({ correctMatches: newCorrectMatches });
  };

  const handleExplanationChange = (value) => {
    onChange({ explanation: value });
  };

  const getHeadingLabel = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, etc.
  };

  const getParagraphLabel = (index) => {
    return String.fromCharCode(105 + index); // i, ii, iii, etc. (Roman numerals style)
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Instructions:</h4>
        <p className="text-sm text-blue-800">
          Students will match headings to paragraphs. There are usually more headings than paragraphs.
        </p>
      </div>

      {/* Headings Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Headings (List of options)
        </label>
        <div className="space-y-3">
          {headings.map((heading, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded font-medium text-sm">
                {getHeadingLabel(index)}
              </div>
              
              <div className="flex-1">
                <input
                  type="text"
                  value={heading}
                  onChange={(e) => handleHeadingChange(index, e.target.value)}
                  placeholder={`Heading ${getHeadingLabel(index)}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {headings.length > 2 && (
                <button
                  onClick={() => handleRemoveHeading(index)}
                  className="p-2 text-red-400 hover:text-red-600"
                  title="Remove heading"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          
          {headings.length < 10 && (
            <button
              onClick={handleAddHeading}
              className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Heading
            </button>
          )}
        </div>
      </div>

      {/* Paragraphs Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Paragraphs (To be matched)
        </label>
        <div className="space-y-4">
          {paragraphs.map((paragraph, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded font-medium text-sm">
                    {getParagraphLabel(index)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Paragraph {getParagraphLabel(index)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <select
                    value={correctMatches[index] !== undefined ? correctMatches[index] : ''}
                    onChange={(e) => handleMatchChange(index, e.target.value)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded"
                  >
                    <option value="">Select heading</option>
                    {headings.map((heading, headingIndex) => (
                      <option key={headingIndex} value={headingIndex}>
                        {getHeadingLabel(headingIndex)} - {heading.substring(0, 30)}{heading.length > 30 ? '...' : ''}
                      </option>
                    ))}
                  </select>
                  
                  {paragraphs.length > 2 && (
                    <button
                      onClick={() => handleRemoveParagraph(index)}
                      className="p-1 text-red-400 hover:text-red-600"
                      title="Remove paragraph"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <textarea
                value={paragraph}
                onChange={(e) => handleParagraphChange(index, e.target.value)}
                placeholder={`Enter paragraph ${getParagraphLabel(index)} content...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
              />
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
          {paragraphs.map((paragraph, index) => (
            <div key={index} className="flex items-center text-sm text-green-800">
              <span className="font-medium">
                Paragraph {getParagraphLabel(index)}
              </span>
              <ArrowRight className="w-4 h-4 mx-2" />
              <span>
                {correctMatches[index] !== undefined ? 
                  `Heading ${getHeadingLabel(correctMatches[index])}` : 
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
          placeholder="Explain the correct matches and why they work..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Guidelines:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Usually more headings than paragraphs (extra distractors)</li>
          <li>• Each paragraph should have one clear main idea</li>
          <li>• Headings should summarize the main point of each paragraph</li>
          <li>• Avoid headings that are too similar to each other</li>
          <li>• Test understanding of paragraph structure and main ideas</li>
        </ul>
      </div>
    </div>
  );
};

export default MatchingHeadings; 