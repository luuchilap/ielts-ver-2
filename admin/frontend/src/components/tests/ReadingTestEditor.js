import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Trash2, 
  Eye, 
  Move, 
  Clock,
  Save,
  ArrowLeft,
  Copy
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReadingPassageEditor from './reading/ReadingPassageEditor';
import QuestionEditor from './reading/QuestionEditor';
import ReadingPreview from './reading/ReadingPreview';

const ReadingTestEditor = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [readingData, setReadingData] = useState({
    sections: [
      {
        id: 'section-1',
        title: 'Section 1',
        passage: '',
        suggestedTime: 20,
        questions: []
      },
      {
        id: 'section-2', 
        title: 'Section 2',
        passage: '',
        suggestedTime: 20,
        questions: []
      },
      {
        id: 'section-3',
        title: 'Section 3', 
        passage: '',
        suggestedTime: 20,
        questions: []
      }
    ]
  });

  const [activeSection, setActiveSection] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSectionUpdate = (sectionIndex, updates) => {
    setReadingData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) => 
        index === sectionIndex ? { ...section, ...updates } : section
      )
    }));
  };

  const handleQuestionAdd = (sectionIndex, questionType) => {
    const newQuestion = {
      id: `question-${Date.now()}`,
      type: questionType,
      order: readingData.sections[sectionIndex].questions.length + 1,
      content: getDefaultQuestionContent(questionType)
    };

    handleSectionUpdate(sectionIndex, {
      questions: [...readingData.sections[sectionIndex].questions, newQuestion]
    });
  };

  const handleQuestionUpdate = (sectionIndex, questionId, updates) => {
    const updatedQuestions = readingData.sections[sectionIndex].questions.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    );
    handleSectionUpdate(sectionIndex, { questions: updatedQuestions });
  };

  const handleQuestionDelete = (sectionIndex, questionId) => {
    const updatedQuestions = readingData.sections[sectionIndex].questions.filter(q => q.id !== questionId);
    handleSectionUpdate(sectionIndex, { questions: updatedQuestions });
  };

  const handleQuestionDuplicate = (sectionIndex, questionId) => {
    const question = readingData.sections[sectionIndex].questions.find(q => q.id === questionId);
    const duplicatedQuestion = {
      ...question,
      id: `question-${Date.now()}`,
      order: readingData.sections[sectionIndex].questions.length + 1
    };
    
    handleSectionUpdate(sectionIndex, {
      questions: [...readingData.sections[sectionIndex].questions, duplicatedQuestion]
    });
  };

  const handleQuestionReorder = (sectionIndex, result) => {
    if (!result.destination) return;

    const questions = Array.from(readingData.sections[sectionIndex].questions);
    const [reorderedItem] = questions.splice(result.source.index, 1);
    questions.splice(result.destination.index, 0, reorderedItem);

    // Update order numbers
    const updatedQuestions = questions.map((q, index) => ({
      ...q,
      order: index + 1
    }));

    handleSectionUpdate(sectionIndex, { questions: updatedQuestions });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // API call to save reading test data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Reading test saved successfully!');
    } catch (error) {
      toast.error('Failed to save reading test');
    } finally {
      setSaving(false);
    }
  };

  const getDefaultQuestionContent = (type) => {
    const defaults = {
      'multiple-choice-single': {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      },
      'multiple-choice-multiple': {
        question: '',
        options: ['', '', '', '', ''],
        correctAnswers: [],
        requiredAnswers: 2,
        explanation: ''
      },
      'true-false-not-given': {
        statement: '',
        answer: 'true',
        explanation: ''
      },
      'fill-in-blanks': {
        sentence: '',
        blanks: [''],
        maxWords: 1,
        explanation: ''
      },
      'matching-headings': {
        headings: ['', '', '', ''],
        paragraphs: ['', '', ''],
        correctMatches: {},
        explanation: ''
      },
      'matching-information': {
        information: ['', '', '', ''],
        paragraphs: ['A', 'B', 'C', 'D'],
        correctMatches: {},
        explanation: ''
      },
      'summary-completion': {
        summary: '',
        wordBank: [],
        useWordBank: true,
        maxWords: 2,
        explanation: ''
      },
      'sentence-completion': {
        beginning: '',
        completion: '',
        maxWords: 3,
        explanation: ''
      },
      'short-answer': {
        question: '',
        answer: '',
        maxWords: 3,
        explanation: ''
      }
    };
    return defaults[type] || {};
  };

  const questionTypes = [
    { value: 'multiple-choice-single', label: 'Multiple Choice (Single)', icon: '○' },
    { value: 'multiple-choice-multiple', label: 'Multiple Choice (Multiple)', icon: '☑' },
    { value: 'true-false-not-given', label: 'True/False/Not Given', icon: '✓' },
    { value: 'fill-in-blanks', label: 'Fill in the Blanks', icon: '___' },
    { value: 'matching-headings', label: 'Matching Headings', icon: '↔' },
    { value: 'matching-information', label: 'Matching Information', icon: '⟷' },
    { value: 'summary-completion', label: 'Summary Completion', icon: '📝' },
    { value: 'sentence-completion', label: 'Sentence Completion', icon: '→' },
    { value: 'short-answer', label: 'Short Answer Questions', icon: '?' }
  ];

  if (showPreview) {
    return (
      <ReadingPreview 
        data={readingData}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  const handleBack = () => {
    navigate('/tests');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Tests
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Reading Test Editor</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Section Tabs */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Sections</h3>
            <div className="space-y-2">
              {readingData.sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(index)}
                  className={`w-full text-left p-3 rounded-lg border ${
                    activeSection === index
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{section.title}</span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {section.suggestedTime}m
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {section.questions.length} questions
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="col-span-9">
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Section Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {readingData.sections[activeSection].title}
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Suggested time: {readingData.sections[activeSection].suggestedTime} minutes
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={readingData.sections[activeSection].suggestedTime}
                    onChange={(e) => handleSectionUpdate(activeSection, { suggestedTime: parseInt(e.target.value) })}
                    className="w-20 px-3 py-1 border border-gray-300 rounded text-center"
                    min="1"
                    max="60"
                  />
                  <span className="text-sm text-gray-500">minutes</span>
                </div>
              </div>
            </div>

            {/* Passage Editor */}
            <div className="p-6 border-b border-gray-200">
              <ReadingPassageEditor
                passage={readingData.sections[activeSection].passage}
                onChange={(passage) => handleSectionUpdate(activeSection, { passage })}
              />
            </div>

            {/* Questions Section */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
                <div className="flex items-center space-x-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleQuestionAdd(activeSection, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    defaultValue=""
                  >
                    <option value="">Add Question Type</option>
                    {questionTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Questions List */}
              <DragDropContext onDragEnd={(result) => handleQuestionReorder(activeSection, result)}>
                <Droppable droppableId="questions">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {readingData.sections[activeSection].questions.map((question, index) => (
                        <Draggable key={question.id} draggableId={question.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <div {...provided.dragHandleProps}>
                                    <Move className="w-4 h-4 text-gray-400 cursor-move" />
                                  </div>
                                  <span className="font-medium text-gray-900">
                                    Question {question.order}
                                  </span>
                                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {questionTypes.find(t => t.value === question.type)?.label}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleQuestionDuplicate(activeSection, question.id)}
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleQuestionDelete(activeSection, question.id)}
                                    className="p-1 text-red-400 hover:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              
                              <QuestionEditor
                                question={question}
                                onChange={(updates) => handleQuestionUpdate(activeSection, question.id, updates)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {readingData.sections[activeSection].questions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No questions added yet</p>
                  <p className="text-sm">Use the dropdown above to add your first question</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingTestEditor; 