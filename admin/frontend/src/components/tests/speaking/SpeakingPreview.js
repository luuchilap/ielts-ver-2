import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  FileText, 
  MessageSquare, 
  Play,
  Pause,
  Volume2,
  Mic,
  Timer
} from 'lucide-react';

const SpeakingPreview = ({ data, onBack }) => {
  const [activePart, setActivePart] = useState('part1');

  const PartCard = ({ part, partId, partNumber, icon: IconComponent }) => {
    const isActive = activePart === partId;

    return (
      <button
        onClick={() => setActivePart(partId)}
        className={`w-full p-4 border rounded-lg text-left transition-colors ${
          isActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <IconComponent className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Part {partNumber}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{part.timeLimit} min</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          {part.title.split(': ')[1]}
        </div>
      </button>
    );
  };

  const currentPart = data[activePart];

  return (
    <div className="max-w-6xl mx-auto p-6">
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
          <h1 className="text-2xl font-bold text-gray-900">Speaking Test Preview</h1>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Total: {data.part1.timeLimit + data.part2.timeLimit + data.part3.timeLimit} minutes
          </span>
          <span className="flex items-center">
            <Mic className="w-4 h-4 mr-1" />
            3 parts
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Part Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <h3 className="font-medium text-gray-900 mb-3">Speaking Parts</h3>
            
            <PartCard 
              part={data.part1} 
              partId="part1" 
              partNumber="1"
              icon={Users}
            />
            
            <PartCard 
              part={data.part2} 
              partId="part2" 
              partNumber="2"
              icon={FileText}
            />
            
            <PartCard 
              part={data.part3} 
              partId="part3" 
              partNumber="3"
              icon={MessageSquare}
            />

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Instructions</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Speak clearly and naturally</li>
                <li>• Take your time to think</li>
                <li>• Give full answers with examples</li>
                <li>• Don't worry about making mistakes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Part Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentPart.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {currentPart.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Time allowed</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {currentPart.timeLimit} minutes
                  </div>
                </div>
              </div>
            </div>

            {/* Part Content */}
            <div className="p-6">
              {/* Part 1 - Interview Questions */}
              {activePart === 'part1' && (
                <div className="space-y-6">
                  {currentPart.topics.map((topic, topicIndex) => (
                    <div key={topic.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-2">
                          {topicIndex + 1}
                        </span>
                        {topic.name}
                      </h3>
                      
                      <div className="space-y-3">
                        {topic.questions?.map((question, questionIndex) => (
                          <div key={question.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-start space-x-3">
                              <span className="flex-shrink-0 w-5 h-5 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs">
                                {questionIndex + 1}
                              </span>
                              <div className="flex-1">
                                <p className="text-gray-800">{question.text}</p>
                                {question.audioUrl && (
                                  <div className="mt-2">
                                    <audio controls src={question.audioUrl} className="h-8" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Part 2 - Cue Card */}
              {activePart === 'part2' && (
                <div className="space-y-6">
                  {/* Timing Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Timer className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-900">Preparation Time</span>
                      </div>
                      <div className="text-lg font-semibold text-yellow-900">
                        {currentPart.preparationTime} minute
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Mic className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Speaking Time</span>
                      </div>
                      <div className="text-lg font-semibold text-green-900">
                        {currentPart.speakingTime} minutes
                      </div>
                    </div>
                  </div>

                  {/* Cue Card */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-orange-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <FileText className="w-5 h-5 text-orange-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">Cue Card</h3>
                    </div>
                    
                    <div className="bg-white border border-orange-200 rounded-lg p-4">
                      <div className="text-lg font-medium text-gray-900 mb-3">
                        {currentPart.cueCard.topic}
                      </div>
                      
                      <div className="text-sm text-gray-700 mb-3">
                        {currentPart.cueCard.description}
                      </div>
                      
                      <ul className="space-y-2 mb-4">
                        {currentPart.cueCard.points.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-orange-600 mr-2">•</span>
                            <span className="text-gray-800">{point}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="text-xs text-gray-600 italic border-t border-gray-200 pt-3">
                        {currentPart.cueCard.instructions}
                      </div>
                    </div>
                  </div>

                  {/* Follow-up Questions */}
                  {currentPart.followUpQuestions?.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-4">Follow-up Questions</h3>
                      <div className="space-y-3">
                        {currentPart.followUpQuestions.map((question, index) => (
                          <div key={question.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-start space-x-3">
                              <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">
                                {index + 1}
                              </span>
                              <div className="flex-1">
                                <p className="text-gray-800">{question.text}</p>
                                {question.audioUrl && (
                                  <div className="mt-2">
                                    <audio controls src={question.audioUrl} className="h-8" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Part 3 - Discussion */}
              {activePart === 'part3' && (
                <div className="space-y-6">
                  {currentPart.themes.map((theme, themeIndex) => (
                    <div key={theme.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                        <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium mr-2">
                          {themeIndex + 1}
                        </span>
                        {theme.name}
                      </h3>
                      
                      <div className="space-y-3">
                        {theme.questions?.map((question, questionIndex) => (
                          <div key={question.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-start space-x-3">
                              <span className="flex-shrink-0 w-5 h-5 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs">
                                {questionIndex + 1}
                              </span>
                              <div className="flex-1">
                                <p className="text-gray-800">{question.text}</p>
                                {question.type && (
                                  <div className="mt-1">
                                    <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                                      {question.type.charAt(0).toUpperCase() + question.type.slice(1)} Question
                                    </span>
                                  </div>
                                )}
                                {question.audioUrl && (
                                  <div className="mt-2">
                                    <audio controls src={question.audioUrl} className="h-8" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Speaking Test Information */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Speaking Test Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <div className="font-medium text-gray-900">Format</div>
                <div>Face-to-face interview with examiner</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Duration</div>
                <div>{data.part1.timeLimit + data.part2.timeLimit + data.part3.timeLimit} minutes total</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Assessment</div>
                <div>Fluency, Vocabulary, Grammar, Pronunciation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakingPreview; 