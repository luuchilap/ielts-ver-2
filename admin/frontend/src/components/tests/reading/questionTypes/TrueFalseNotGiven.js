import React from 'react';
import { CheckCircle } from 'lucide-react';

const TrueFalseNotGiven = ({ content, onChange }) => {
  const { statement = '', answer = 'true', explanation = '' } = content;

  const handleStatementChange = (value) => {
    onChange({ statement: value });
  };

  const handleAnswerChange = (value) => {
    onChange({ answer: value });
  };

  const handleExplanationChange = (value) => {
    onChange({ explanation: value });
  };

  const answerOptions = [
    { value: 'true', label: 'TRUE', description: 'The statement agrees with the information' },
    { value: 'false', label: 'FALSE', description: 'The statement contradicts the information' },
    { value: 'not-given', label: 'NOT GIVEN', description: 'There is no information on this' }
  ];

  return (
    <div className="space-y-6">
      {/* Statement Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Statement
        </label>
        <textarea
          value={statement}
          onChange={(e) => handleStatementChange(e.target.value)}
          placeholder="Enter the statement to be evaluated as True, False, or Not Given..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>

      {/* Answer Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Correct Answer
        </label>
        <div className="space-y-3">
          {answerOptions.map((option) => (
            <div key={option.value} className="flex items-start space-x-3">
              <button
                onClick={() => handleAnswerChange(option.value)}
                className={`flex items-center justify-center w-6 h-6 rounded-full border-2 mt-1 ${
                  answer === option.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                {answer === option.value && (
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    answer === option.value ? 'text-green-700' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </span>
                  {answer === option.value && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Answer Display */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-sm text-green-800">
            Correct Answer: <strong>
              {answerOptions.find(opt => opt.value === answer)?.label}
            </strong>
          </span>
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
          placeholder="Explain why this answer is correct. Reference specific parts of the passage..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="4"
        />
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Guidelines:</h4>
        <div className="space-y-3 text-xs text-blue-800">
          <div>
            <strong>TRUE:</strong> The statement agrees with the information in the passage
            <ul className="list-disc list-inside mt-1 ml-2">
              <li>Information is explicitly stated</li>
              <li>Can be logically inferred from given information</li>
            </ul>
          </div>
          <div>
            <strong>FALSE:</strong> The statement contradicts the information in the passage
            <ul className="list-disc list-inside mt-1 ml-2">
              <li>Information directly contradicts the statement</li>
              <li>Opposite meaning is clearly stated</li>
            </ul>
          </div>
          <div>
            <strong>NOT GIVEN:</strong> There is no information about this in the passage
            <ul className="list-disc list-inside mt-1 ml-2">
              <li>Topic is not mentioned at all</li>
              <li>Insufficient information to determine true or false</li>
              <li>Related topic mentioned but specific detail is not</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrueFalseNotGiven; 