import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Type, 
  Image, 
  PenTool, 
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const WritingPreview = ({ data, onBack }) => {
  const [activeTask, setActiveTask] = useState('task1');
  const [studentAnswers, setStudentAnswers] = useState({
    task1: '',
    task2: ''
  });

  const getWordCount = (text) => {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };

  const isWordCountSufficient = (text, minWords) => {
    return getWordCount(text) >= minWords;
  };

  const TaskCard = ({ task, taskId, taskNumber }) => {
    const isActive = activeTask === taskId;
    const wordCount = getWordCount(studentAnswers[taskId]);
    const isComplete = isWordCountSufficient(studentAnswers[taskId], task.minWords);

    return (
      <button
        onClick={() => setActiveTask(taskId)}
        className={`w-full p-4 border rounded-lg text-left transition-colors ${
          isActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {taskId === 'task1' ? (
              <Image className="w-5 h-5 text-gray-600" />
            ) : (
              <PenTool className="w-5 h-5 text-gray-600" />
            )}
            <span className="font-medium text-gray-900">Task {taskNumber}</span>
            {isComplete ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-orange-500" />
            )}
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {task.timeLimit} min
            </span>
            <span className="flex items-center">
              <Type className="w-4 h-4 mr-1" />
              {task.minWords}+ words
            </span>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          {taskId === 'task1' 
            ? (task.type === 'academic' ? 'Describe visual information' : 'Write a letter')
            : 'Essay writing'
          }
        </div>
        
        <div className="mt-2 text-xs">
          <span className={`${wordCount >= task.minWords ? 'text-green-600' : 'text-orange-600'}`}>
            Words: {wordCount}/{task.minWords}
          </span>
        </div>
      </button>
    );
  };

  const currentTask = data[activeTask];

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
          <h1 className="text-2xl font-bold text-gray-900">Writing Test Preview</h1>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Total: {data.task1.timeLimit + data.task2.timeLimit} minutes
          </span>
          <span className="flex items-center">
            <FileText className="w-4 h-4 mr-1" />
            2 tasks
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Task Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <h3 className="font-medium text-gray-900 mb-3">Writing Tasks</h3>
            
            <TaskCard 
              task={data.task1} 
              taskId="task1" 
              taskNumber="1"
            />
            
            <TaskCard 
              task={data.task2} 
              taskId="task2" 
              taskNumber="2"
            />

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Instructions</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Complete both tasks</li>
                <li>• Manage your time carefully</li>
                <li>• Check word count requirements</li>
                <li>• Review your answers before submitting</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Task Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentTask.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {activeTask === 'task1' 
                      ? (currentTask.type === 'academic' ? 'Describe the visual information' : 'Write a letter')
                      : 'Write an essay'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Suggested time</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {currentTask.timeLimit} minutes
                  </div>
                </div>
              </div>
            </div>

            {/* Task Content */}
            <div className="p-6 space-y-6">
              {/* Task 1 - Image Display */}
              {activeTask === 'task1' && currentTask.type === 'academic' && currentTask.imageUrl && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <img
                    src={currentTask.imageUrl}
                    alt="Chart/Graph for Task 1"
                    className="max-w-full h-auto mx-auto"
                    style={{ maxHeight: '400px' }}
                  />
                  {currentTask.chartType && (
                    <div className="text-center mt-2 text-sm text-gray-600">
                      {currentTask.chartType.charAt(0).toUpperCase() + currentTask.chartType.slice(1)} Chart
                    </div>
                  )}
                </div>
              )}

              {/* Task Prompt */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Task Instructions</h3>
                <div className="text-gray-800 whitespace-pre-wrap">
                  {currentTask.prompt}
                </div>
                
                {/* Requirements */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Type className="w-4 h-4 text-gray-500" />
                    <span>Minimum {currentTask.minWords} words</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>Suggested {currentTask.timeLimit} minutes</span>
                  </div>
                  {activeTask === 'task2' && currentTask.essayType && (
                    <div className="flex items-center space-x-2">
                      <PenTool className="w-4 h-4 text-gray-500" />
                      <span className="capitalize">{currentTask.essayType.replace('-', ' ')} essay</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Answer Area */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Your Answer
                  </label>
                  <div className="text-sm text-gray-500">
                    <span className={`${
                      getWordCount(studentAnswers[activeTask]) >= currentTask.minWords 
                        ? 'text-green-600' 
                        : 'text-orange-600'
                    }`}>
                      {getWordCount(studentAnswers[activeTask])} words
                    </span>
                    <span className="text-gray-400 ml-1">
                      (minimum {currentTask.minWords})
                    </span>
                  </div>
                </div>
                
                <textarea
                  value={studentAnswers[activeTask]}
                  onChange={(e) => setStudentAnswers(prev => ({
                    ...prev,
                    [activeTask]: e.target.value
                  }))}
                  placeholder={
                    activeTask === 'task1'
                      ? currentTask.type === 'academic'
                        ? "Begin your description of the chart/graph here. Remember to include an overview, key features, and comparisons where relevant..."
                        : "Begin your letter here. Remember to include appropriate greeting, clear purpose, main points, and appropriate closing..."
                      : "Begin your essay here. Remember to include a clear introduction, well-developed body paragraphs with examples, and a conclusion..."
                  }
                  className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.5' }}
                />
                
                {/* Progress Indicator */}
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>Characters: {studentAnswers[activeTask].length}</span>
                    <span>Lines: {studentAnswers[activeTask].split('\n').length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isWordCountSufficient(studentAnswers[activeTask], currentTask.minWords) ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Word count requirement met</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-orange-600">
                          {currentTask.minWords - getWordCount(studentAnswers[activeTask])} more words needed
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Answer (if available) */}
          {currentTask.sampleAnswer && (
            <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="border-b border-gray-200 p-4">
                <h3 className="font-medium text-gray-900">Sample Answer (For Reference)</h3>
                <p className="text-sm text-gray-600 mt-1">
                  This is a model answer for guidance. Word count: {getWordCount(currentTask.sampleAnswer)}
                </p>
              </div>
              <div className="p-6">
                <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {currentTask.sampleAnswer}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WritingPreview; 