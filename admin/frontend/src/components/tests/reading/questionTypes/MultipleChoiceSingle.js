import React from 'react';
import { Plus, Trash2, CheckCircle } from 'lucide-react';

const MultipleChoiceSingle = ({ content, onChange }) => {
  const { question = '', options = ['', '', '', ''], correctAnswer = 0, explanation = '' } = content;

  const handleQuestionChange = (value) => {
    onChange({ question: value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onChange({ options: newOptions });
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      onChange({ options: [...options, ''] });
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      onChange({ 
        options: newOptions,
        correctAnswer: correctAnswer >= newOptions.length ? 0 : correctAnswer
      });
    }
  };

  const handleCorrectAnswerChange = (index) => {
    onChange({ correctAnswer: index });
  };

  const handleExplanationChange = (value) => {
    onChange({ explanation: value });
  };

  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

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
          placeholder="Enter your multiple choice question..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>

      {/* Options */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Answer Options
        </label>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-3">
              <button
                onClick={() => handleCorrectAnswerChange(index)}
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  correctAnswer === index
                    ? 'border-green-500 bg-green-50 text-green-600'
                    : 'border-gray-300 hover:border-green-400'
                }`}
                title="Mark as correct answer"
              >
                {correctAnswer === index ? (
                  <CheckCircle className="w-5 h-5" />
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
              
              {options.length > 2 && (
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
          
          {options.length < 6 && (
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

      {/* Correct Answer Indicator */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-sm text-green-800">
            Correct Answer: <strong>Option {optionLabels[correctAnswer]} - {options[correctAnswer] || 'Not set'}</strong>
          </span>
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
          placeholder="Explain why this is the correct answer..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Guidelines:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Make sure only one answer is clearly correct</li>
          <li>• Distractors should be plausible but incorrect</li>
          <li>• Keep options roughly the same length</li>
          <li>• Avoid "all of the above" or "none of the above"</li>
        </ul>
      </div>
    </div>
  );
};

export default MultipleChoiceSingle; 