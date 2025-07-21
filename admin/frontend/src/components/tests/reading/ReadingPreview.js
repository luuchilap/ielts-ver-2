import React, { useState } from 'react';
import { ArrowLeft, Clock, FileText, Eye } from 'lucide-react';

const ReadingPreview = ({ data, onBack }) => {
  const [activeSection, setActiveSection] = useState(0);

  const renderQuestionPreview = (question, index) => {
    const questionNumber = index + 1;
    
    switch (question.type) {
      case 'multiple-choice-single':
        return (
          <div key={question.id} className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Question {questionNumber}
            </h4>
            <p className="text-gray-800 mb-3">{question.content.question}</p>
            <div className="space-y-2">
              {question.content.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  <span className="text-gray-700">
                    {String.fromCharCode(65 + optIndex)}. {option}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'multiple-choice-multiple':
        return (
          <div key={question.id} className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Question {questionNumber}
            </h4>
            <p className="text-gray-800 mb-3">{question.content.question}</p>
            <p className="text-sm text-blue-600 mb-3">
              Choose {question.content.requiredAnswers} answers
            </p>
            <div className="space-y-2">
              {question.content.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                  <span className="text-gray-700">
                    {String.fromCharCode(65 + optIndex)}. {option}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'true-false-not-given':
        return (
          <div key={question.id} className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Question {questionNumber}
            </h4>
            <p className="text-gray-800 mb-3">{question.content.statement}</p>
            <div className="space-y-2">
              {['TRUE', 'FALSE', 'NOT GIVEN'].map((option, optIndex) => (
                <div key={optIndex} className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  <span className="text-gray-700">{option}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'fill-in-blanks':
        const previewSentence = question.content.sentence.replace(
          /\{(\d+)\}/g, 
          (match, number) => `______${number}______`
        );
        return (
          <div key={question.id} className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Question {questionNumber}
            </h4>
            <p className="text-gray-800 mb-2">{previewSentence}</p>
            <p className="text-sm text-blue-600">
              (Maximum {question.content.maxWords} word{question.content.maxWords > 1 ? 's' : ''} per blank)
            </p>
          </div>
        );

      case 'matching-headings':
        return (
          <div key={question.id} className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Questions {questionNumber}-{questionNumber + question.content.paragraphs.length - 1}
            </h4>
            <p className="text-gray-800 mb-4">
              Match each paragraph with the correct heading.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-700 mb-3">Headings:</h5>
                <div className="space-y-2">
                  {question.content.headings.map((heading, hIndex) => (
                    <div key={hIndex} className="text-sm text-gray-700">
                      {String.fromCharCode(65 + hIndex)}. {heading}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-700 mb-3">Paragraphs:</h5>
                <div className="space-y-3">
                  {question.content.paragraphs.map((paragraph, pIndex) => (
                    <div key={pIndex} className="border border-gray-200 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Paragraph {String.fromCharCode(105 + pIndex)}</span>
                        <div className="w-12 h-6 border border-gray-300 rounded"></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {paragraph.substring(0, 100)}{paragraph.length > 100 ? '...' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'matching-information':
        return (
          <div key={question.id} className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Questions {questionNumber}-{questionNumber + question.content.information.length - 1}
            </h4>
            <p className="text-gray-800 mb-4">
              Match each piece of information with the correct paragraph.
            </p>
            
            <div className="space-y-3">
              {question.content.information.map((info, iIndex) => (
                <div key={iIndex} className="flex items-center space-x-3">
                  <span className="font-medium">{iIndex + 1}.</span>
                  <span className="flex-1 text-gray-700">{info}</span>
                  <div className="w-16 h-8 border border-gray-300 rounded"></div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              Paragraphs: {question.content.paragraphs.join(', ')}
            </div>
          </div>
        );

      case 'summary-completion':
        const summaryPreview = question.content.summary.replace(
          /\{(\d+)\}/g, 
          (match, number) => `______${number}______`
        );
        return (
          <div key={question.id} className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Questions {questionNumber}-{questionNumber + (question.content.summary.match(/\{\d+\}/g) || []).length - 1}
            </h4>
            <p className="text-gray-800 mb-4">Complete the summary below.</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {summaryPreview}
              </p>
            </div>
            
            {question.content.useWordBank && question.content.wordBank.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Choose from:</p>
                <div className="flex flex-wrap gap-2">
                  {question.content.wordBank.map((word, wIndex) => (
                    <span key={wIndex} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {!question.content.useWordBank && (
              <p className="text-sm text-blue-600">
                (Maximum {question.content.maxWords} word{question.content.maxWords > 1 ? 's' : ''} per blank)
              </p>
            )}
          </div>
        );

      case 'sentence-completion':
        return (
          <div key={question.id} className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Question {questionNumber}
            </h4>
            <p className="text-gray-800 mb-2">Complete the sentence below.</p>
            <div className="flex items-center space-x-2">
              <span className="text-gray-800">{question.content.beginning}</span>
              <div className="border-b-2 border-gray-400 border-dashed min-w-[100px] h-8"></div>
            </div>
            <p className="text-sm text-blue-600 mt-2">
              (Maximum {question.content.maxWords} word{question.content.maxWords > 1 ? 's' : ''})
            </p>
          </div>
        );

      case 'short-answer':
        return (
          <div key={question.id} className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Question {questionNumber}
            </h4>
            <p className="text-gray-800 mb-3">{question.content.question}</p>
            <div className="border-b-2 border-gray-400 border-dashed w-64 h-8"></div>
            <p className="text-sm text-blue-600 mt-2">
              (Answer in {question.content.maxWords} word{question.content.maxWords > 1 ? 's' : ''} or fewer)
            </p>
          </div>
        );

      default:
        return (
          <div key={question.id} className="mb-6">
            <div className="text-center py-4 text-gray-500">
              Unknown question type: {question.type}
            </div>
          </div>
        );
    }
  };

  const currentSection = data.sections[activeSection];
  const totalQuestions = data.sections.reduce((total, section) => total + section.questions.length, 0);

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
          <div 
            className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: currentSection.passage || '<p className="text-gray-500 italic">No passage content added yet</p>' }}
          />
        </div>

        {/* Questions */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Questions</h3>
          
          {currentSection.questions.length > 0 ? (
            <div className="space-y-8">
              {currentSection.questions.map((question, index) => 
                renderQuestionPreview(question, index)
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No questions added to this section yet</p>
            </div>
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
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingPreview; 