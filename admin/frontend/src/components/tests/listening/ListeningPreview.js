import React, { useState, useRef } from 'react';
import { ArrowLeft, Clock, Volume2, Play, Pause, Eye } from 'lucide-react';

const ListeningPreview = ({ data, onBack }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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

      case 'note-completion':
        const notesPreview = question.content.notes.replace(
          /\{(\d+)\}/g, 
          (match, number) => `______${number}______`
        );
        return (
          <div key={question.id} className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Questions {questionNumber}-{questionNumber + (question.content.notes.match(/\{\d+\}/g) || []).length - 1}
            </h4>
            <p className="text-gray-800 mb-4">Complete the notes below.</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre className="text-gray-800 whitespace-pre-wrap leading-relaxed font-mono text-sm">
                {notesPreview}
              </pre>
            </div>
            <p className="text-sm text-blue-600 mt-2">
              (Maximum {question.content.maxWords} word{question.content.maxWords > 1 ? 's' : ''} per blank)
            </p>
          </div>
        );

      case 'form-completion':
        return (
          <div key={question.id} className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Questions {questionNumber}-{questionNumber + question.content.formFields.length - 1}
            </h4>
            <p className="text-gray-800 mb-4">Complete the form below.</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="bg-white rounded border p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Form</h3>
                <div className="space-y-3">
                  {question.content.formFields.map((field, fIndex) => (
                    <div key={fIndex} className="flex items-center space-x-4">
                      <label className="text-sm font-medium text-gray-700 w-32">
                        {field.label}:
                      </label>
                      <div className="border-b-2 border-gray-300 border-dashed flex-1 h-8"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
          <h1 className="text-2xl font-bold text-gray-900">Listening Test Preview</h1>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Volume2 className="w-4 h-4 mr-1" />
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
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentSection.title}
              </h2>
              <p className="text-gray-500 mt-1">
                {currentSection.description}
              </p>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              Suggested time: {currentSection.suggestedTime} minutes
            </div>
          </div>
        </div>

        {/* Audio Player */}
        {currentSection.audioUrl && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Audio</h3>
            
            <audio
              ref={audioRef}
              src={currentSection.audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePlay}
                  className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!currentSection.audioUrl && (
          <div className="p-6 border-b border-gray-200">
            <div className="text-center py-8 text-gray-500">
              <Volume2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No audio file uploaded for this section</p>
            </div>
          </div>
        )}

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
              <Volume2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
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
              <li>• This is how students will see the listening test</li>
              <li>• Audio player controls are shown as they would appear</li>
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

export default ListeningPreview; 