import React from 'react';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';

const MultipleChoiceMultiple = ({ content, onChange }) => {
  const { 
    question = '', 
    options = ['', '', '', '', ''], 
    correctAnswers = [], 
    requiredAnswers = 2,
    explanation = '' 
  } = content;

  const handleQuestionChange = (value) => {
    onChange({ question: value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onChange({ options: newOptions });
  };

  const handleAddOption = () => {
    if (options.length < 8) {
      onChange({ options: [...options, ''] });
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 3) {
      const newOptions = options.filter((_, i) => i !== index);
      const newCorrectAnswers = correctAnswers.filter(answerIndex => answerIndex !== index)
        .map(answerIndex => answerIndex > index ? answerIndex - 1 : answerIndex);
      onChange({ 
        options: newOptions,
        correctAnswers: newCorrectAnswers
      });
    }
  };

  const handleCorrectAnswerToggle = (index) => {
    const newCorrectAnswers = correctAnswers.includes(index)
      ? correctAnswers.filter(i => i !== index)
      : [...correctAnswers, index];
    onChange({ correctAnswers: newCorrectAnswers });
  };

  const handleRequiredAnswersChange = (value) => {
    onChange({ requiredAnswers: parseInt(value) });
  };

  const handleExplanationChange = (value) => {
    onChange({ explanation: value });
  };

  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  return (
    <div className="space-y-6">
      {/* Question Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question
        </label>
        <textarea
          value={question}
          onChange={(e) => handleQuestionChange(e.target.value)}
          placeholder="Enter your multiple choice question (multiple answers)..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>

      {/* Required Answers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of correct answers students must select
        </label>
        <select
          value={requiredAnswers}
          onChange={(e) => handleRequiredAnswersChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {[2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num} answers</option>
          ))}
        </select>
      </div>

      {/* Options */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Answer Options (Select multiple correct answers)
        </label>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-3">
              <button
                onClick={() => handleCorrectAnswerToggle(index)}
                className={`flex items-center justify-center w-8 h-8 rounded border-2 ${
                  correctAnswers.includes(index)
                    ? 'border-green-500 bg-green-50 text-green-600'
                    : 'border-gray-300 hover:border-green-400'
                }`}
                title={correctAnswers.includes(index) ? "Correct answer" : "Mark as correct"}
              >
                {correctAnswers.includes(index) ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{optionLabels[index]}</span>
                )}
              </button>
              
              <div className="flex-1">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${optionLabels[index]}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {options.length > 3 && (
                <button
                  onClick={() => handleRemoveOption(index)}
                  className="p-2 text-red-400 hover:text-red-600"
                  title="Remove option"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          
          {options.length < 8 && (
            <button
              onClick={handleAddOption}
              className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Option
            </button>
          )}
        </div>
      </div>

      {/* Correct Answers Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-start">
          <CheckSquare className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
          <div>
            <span className="text-sm text-green-800 font-medium">
              Correct Answers ({correctAnswers.length} selected):
            </span>
            <div className="mt-1 text-sm text-green-700">
              {correctAnswers.length > 0 ? (
                correctAnswers.map(index => (
                  <div key={index}>
                    Option {optionLabels[index]}: {options[index] || 'Not set'}
                  </div>
                ))
              ) : (
                <span className="text-green-600">No correct answers selected</span>
              )}
            </div>
          </div>
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
          placeholder="Explain why these answers are correct..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Guidelines:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Students must select exactly {requiredAnswers} answers</li>
          <li>• Make sure there are {requiredAnswers} clearly correct options</li>
          <li>• Include plausible distractors</li>
          <li>• Avoid overlapping or contradictory correct answers</li>
        </ul>
      </div>
    </div>
  );
};

export default MultipleChoiceMultiple; 