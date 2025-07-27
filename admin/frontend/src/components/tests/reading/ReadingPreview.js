import React, { useState } from 'react';
import { ArrowLeft, Clock, FileText, Eye } from 'lucide-react';

const ReadingPreview = ({ data, onBack }) => {
  const [activeSection, setActiveSection] = useState(0);

  const renderQuestionPreview = (question, questionNumber) => {
    const { statement = '', maxWords = 3, options = [], correctAnswer = '', paragraph = '', correctHeading = '' } = question.content || {};
    
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div key={question.id} className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              {questionNumber}. {statement}
            </h4>
            <div className="space-y-2 ml-4">
              {['A', 'B', 'C', 'D'].map((letter, index) => (
                <div key={letter} className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-500">{letter}</span>
                  </div>
                  <span className="text-gray-700">{options[index] || `Option ${letter}`}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'true-false-not-given':
        return (
          <div key={question.id} className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              {questionNumber}. {statement}
            </h4>
            <div className="space-y-2 ml-4">
              {['TRUE', 'FALSE', 'NOT GIVEN'].map((option) => (
                <div key={option} className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  <span className="text-gray-700">{option}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'matching-headings':
        return (
          <div key={question.id} className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              {questionNumber}. {paragraph || `Paragraph ${questionNumber}`}
            </h4>
            <div className="ml-4">
              <div className="border-b-2 border-gray-400 border-dashed w-32 h-8 flex items-center">
                <span className="text-gray-400">_____</span>
              </div>
            </div>
          </div>
        );

      case 'short-answer':
      case 'fill-in-blank':
      case 'sentence-completion':
      default:
        return (
          <div key={question.id} className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              {questionNumber}. 
            </h4>
            
            {statement ? (
              <div className="text-gray-800 leading-relaxed mb-3">
                {statement.split('_____').map((part, index, array) => (
                  <React.Fragment key={index}>
                    {part}
                    {index < array.length - 1 && (
                      <span className="inline-block border-b-2 border-gray-400 border-dashed mx-2 min-w-[80px] h-6">
                        <span className="invisible">answer</span>
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic mb-3">No statement provided</p>
            )}
            
            {statement.includes('_____') && (
              <p className="text-sm text-blue-600">
                (Maximum {maxWords} word{maxWords > 1 ? 's' : ''} per answer)
              </p>
            )}
          </div>
        );
    }
  };

  const renderQuestionGroup = (group, sectionIndex, groupIndex) => {
    if (!group.questions || group.questions.length === 0) {
      return null;
    }

    // Calculate question start number for this group
    let questionStartNumber = 1;
    const currentSection = data.sections[sectionIndex];
    for (let i = 0; i < groupIndex; i++) {
      questionStartNumber += currentSection.questionGroups[i].questions.length;
    }

    // Replace {range} in instructions with actual question numbers
    const questionRange = group.questions.length === 1 
      ? questionStartNumber.toString()
      : `${questionStartNumber}-${questionStartNumber + group.questions.length - 1}`;
    
    const instructions = group.instructions?.replace('{range}', questionRange) || '';

    return (
      <div key={group.id} className="mb-8">
        {/* Group Instructions */}
        {instructions && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">
              Questions {questionRange}
            </h4>
            <div className="text-sm text-gray-700 whitespace-pre-line">
              {instructions}
            </div>
          </div>
        )}

        {/* Questions in this group */}
        <div className="space-y-6">
          {group.questions.map((question, questionIndex) => 
            renderQuestionPreview(question, questionStartNumber + questionIndex)
          )}
        </div>
      </div>
    );
  };

  const currentSection = data.sections[activeSection];
  
  // Calculate total questions across all sections
  const getTotalQuestions = () => {
    return data.sections.reduce((total, section) => {
      if (section.questionGroups) {
        return total + section.questionGroups.reduce((sectionTotal, group) => 
          sectionTotal + (group.questions?.length || 0), 0);
      }
      return total + (section.questions?.length || 0); // Fallback for old format
    }, 0);
  };

  const totalQuestions = getTotalQuestions();

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Editor
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Reading Test Preview</h1>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <FileText className="w-4 h-4 mr-1" />
            {totalQuestions} questions
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {data.sections.reduce((total, section) => total + section.suggestedTime, 0)} minutes
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {data.sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(index)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === index
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>

      {/* Section Content */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Section Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {currentSection.title}
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              Suggested time: {currentSection.suggestedTime} minutes
            </div>
          </div>
        </div>

        {/* Reading Passage */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Reading Passage</h3>
          <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
            {currentSection.passage ? (
              <div dangerouslySetInnerHTML={{ __html: currentSection.passage }} />
            ) : (
              <p className="text-gray-500 italic">No passage content added yet</p>
            )}
          </div>
        </div>

        {/* Questions */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Questions</h3>
          
          {/* New QuestionGroups format */}
          {currentSection.questionGroups && currentSection.questionGroups.length > 0 ? (
            <div className="space-y-8">
              {currentSection.questionGroups.map((group, groupIndex) => 
                renderQuestionGroup(group, activeSection, groupIndex)
              )}
            </div>
          ) : (
            /* Fallback for old questions format */
            currentSection.questions && currentSection.questions.length > 0 ? (
              <div className="space-y-8">
                {currentSection.questions.map((question, index) => 
                  renderQuestionPreview(question, index + 1)
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No questions added to this section yet</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Eye className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Preview Notes:</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• This is how students will see the reading test</li>
              <li>• Input fields and interactive elements are shown as placeholders</li>
              <li>• Correct answers and explanations are not visible to students</li>
              <li>• Navigate between sections using the tabs above</li>
              <li>• Each question group shows its specific instructions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingPreview; 