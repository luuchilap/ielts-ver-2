import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Plus, 
  Trash2, 
  Move, 
  Copy, 
  ChevronDown, 
  ChevronRight,
  FileText,
  Hash,
  List,
  CheckSquare,
  Edit3
} from 'lucide-react';
import SimpleQuestionEditor from './SimpleQuestionEditor';

const QUESTION_TYPES = {
  'multiple-choice': {
    name: 'Multiple Choice',
    icon: CheckSquare,
    description: 'Questions with 4 options (A, B, C, D)',
    defaultInstruction: 'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes {range} on your answer sheet.'
  },
  'fill-in-blank': {
    name: 'Fill in the Blank',
    icon: Edit3,
    description: 'Complete sentences or passages',
    defaultInstruction: 'Complete the summary below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.\nWrite your answers in boxes {range} on your answer sheet.'
  },
  'matching-headings': {
    name: 'Matching Headings',
    icon: List,
    description: 'Match paragraphs with headings',
    defaultInstruction: 'Choose the correct heading for each paragraph from the list of headings below.\nWrite the correct number, i-viii, in boxes {range} on your answer sheet.'
  },
  'true-false-not-given': {
    name: 'True/False/Not Given',
    icon: CheckSquare,
    description: 'Determine if statements are true, false, or not given',
    defaultInstruction: 'Do the following statements agree with the information given in the reading passage?\nIn boxes {range} on your answer sheet, write:\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this'
  },
  'short-answer': {
    name: 'Short Answer',
    icon: Edit3,
    description: 'Brief answers to specific questions',
    defaultInstruction: 'Answer the questions below.\nChoose NO MORE THAN THREE WORDS from the passage for each answer.\nWrite your answers in boxes {range} on your answer sheet.'
  },
  'sentence-completion': {
    name: 'Sentence Completion',
    icon: Edit3,
    description: 'Complete sentences using words from the passage',
    defaultInstruction: 'Complete the sentences below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.\nWrite your answers in boxes {range} on your answer sheet.'
  }
};

const QuestionGroup = ({ 
  group, 
  onUpdate, 
  onDelete, 
  questionStartNumber = 1,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [localCollapsed, setLocalCollapsed] = useState(isCollapsed);
  
  const handleToggleCollapse = () => {
    const newCollapsed = !localCollapsed;
    setLocalCollapsed(newCollapsed);
    if (onToggleCollapse) {
      onToggleCollapse(newCollapsed);
    }
  };

  const handleGroupUpdate = (updates) => {
    onUpdate({ ...group, ...updates });
  };

  const handleQuestionAdd = () => {
    const newQuestion = {
      id: `question-${Date.now()}`,
      type: group.questionType,
      order: group.questions.length + 1,
      content: getDefaultQuestionContent(group.questionType)
    };

    handleGroupUpdate({
      questions: [...group.questions, newQuestion]
    });
  };

  const handleQuestionUpdate = (questionId, updates) => {
    const updatedQuestions = group.questions.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    );
    handleGroupUpdate({ questions: updatedQuestions });
  };

  const handleQuestionDelete = (questionId) => {
    const updatedQuestions = group.questions.filter(q => q.id !== questionId);
    handleGroupUpdate({ questions: updatedQuestions });
  };

  const handleQuestionDuplicate = (questionId) => {
    const question = group.questions.find(q => q.id === questionId);
    const duplicatedQuestion = {
      ...question,
      id: `question-${Date.now()}`,
      order: group.questions.length + 1
    };
    
    handleGroupUpdate({
      questions: [...group.questions, duplicatedQuestion]
    });
  };

  const handleQuestionReorder = (result) => {
    if (!result.destination) return;

    const questions = Array.from(group.questions);
    const [reorderedItem] = questions.splice(result.source.index, 1);
    questions.splice(result.destination.index, 0, reorderedItem);

    // Update order numbers
    const updatedQuestions = questions.map((q, index) => ({
      ...q,
      order: index + 1
    }));

    handleGroupUpdate({ questions: updatedQuestions });
  };

  const getDefaultQuestionContent = (questionType) => {
    switch (questionType) {
      case 'multiple-choice':
        return {
          statement: '',
          options: ['', '', '', ''],
          correctAnswer: 'A',
          explanation: ''
        };
      case 'true-false-not-given':
        return {
          statement: '',
          correctAnswer: 'TRUE', // TRUE, FALSE, NOT GIVEN
          explanation: ''
        };
      case 'matching-headings':
        return {
          paragraph: '',
          correctHeading: '',
          explanation: ''
        };
      default:
        return {
          statement: '',
          answer: '',
          explanation: '',
          maxWords: 3
        };
    }
  };

  const getQuestionRange = () => {
    if (group.questions.length === 0) return '';
    const start = questionStartNumber;
    const end = questionStartNumber + group.questions.length - 1;
    return start === end ? `${start}` : `${start}-${end}`;
  };

  const questionTypeInfo = QUESTION_TYPES[group.questionType] || QUESTION_TYPES['short-answer'];
  const IconComponent = questionTypeInfo.icon;

  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      {/* Group Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleCollapse}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {localCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            <IconComponent className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-semibold text-gray-900">
                {group.title || questionTypeInfo.name}
              </h4>
              <p className="text-sm text-gray-500">
                Questions {getQuestionRange()} • {group.questions.length} questions
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={group.questionType}
              onChange={(e) => handleGroupUpdate({ questionType: e.target.value })}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              {Object.entries(QUESTION_TYPES).map(([key, type]) => (
                <option key={key} value={key}>{type.name}</option>
              ))}
            </select>
            <button
              onClick={() => onDelete()}
              className="p-1 text-red-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Group Title Input */}
        <div className="mt-3">
          <input
            type="text"
            value={group.title || ''}
            onChange={(e) => handleGroupUpdate({ title: e.target.value })}
            placeholder={`${questionTypeInfo.name} Group`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {!localCollapsed && (
        <div className="p-4">
          {/* Instructions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions for Students
            </label>
            <textarea
              value={group.instructions || ''}
              onChange={(e) => handleGroupUpdate({ instructions: e.target.value })}
              placeholder={questionTypeInfo.defaultInstruction.replace('{range}', getQuestionRange())}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              rows="4"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use {'{range}'} in your instructions - it will be replaced with the question numbers (e.g., "1-5")
            </p>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-gray-900">Questions</h5>
              <button
                onClick={handleQuestionAdd}
                className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Question
              </button>
            </div>

            <DragDropContext onDragEnd={handleQuestionReorder}>
              <Droppable droppableId={`questions-${group.id}`}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {group.questions.map((question, index) => (
                      <Draggable key={question.id} draggableId={question.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="border border-gray-200 rounded-lg p-4 bg-white"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div {...provided.dragHandleProps}>
                                  <Move className="w-4 h-4 text-gray-400 cursor-move" />
                                </div>
                                <span className="font-medium text-gray-900">
                                  Question {questionStartNumber + index}
                                </span>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {questionTypeInfo.name}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleQuestionDuplicate(question.id)}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleQuestionDelete(question.id)}
                                  className="p-1 text-red-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            {/* Question Editor based on type */}
                            {renderQuestionEditor(question, questionTypeInfo, 
                              (updates) => handleQuestionUpdate(question.id, updates))}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {group.questions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No questions in this group yet</p>
                <p className="text-sm">Click "Add Question" to create your first question</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const renderQuestionEditor = (question, questionTypeInfo, onChange) => {
  switch (question.type) {
    case 'multiple-choice':
      return <MultipleChoiceEditor question={question} onChange={onChange} />;
    case 'true-false-not-given':
      return <TrueFalseEditor question={question} onChange={onChange} />;
    case 'matching-headings':
      return <MatchingHeadingsEditor question={question} onChange={onChange} />;
    default:
      return <SimpleQuestionEditor question={question} onChange={onChange} />;
  }
};

// Multiple Choice Editor
const MultipleChoiceEditor = ({ question, onChange }) => {
  const { statement = '', options = ['', '', '', ''], correctAnswer = 'A', explanation = '' } = question.content || {};

  const handleContentChange = (updates) => {
    onChange({
      ...question,
      content: {
        ...question.content,
        ...updates
      }
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    handleContentChange({ options: newOptions });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Question Statement</label>
        <textarea
          value={statement}
          onChange={(e) => handleContentChange({ statement: e.target.value })}
          placeholder="Enter the question..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          rows="2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Answer Options</label>
        <div className="space-y-2">
          {['A', 'B', 'C', 'D'].map((letter, index) => (
            <div key={letter} className="flex items-center space-x-3">
              <input
                type="radio"
                name={`correct-${question.id}`}
                checked={correctAnswer === letter}
                onChange={() => handleContentChange({ correctAnswer: letter })}
                className="text-blue-600"
              />
              <span className="font-medium text-gray-700 w-4">{letter}</span>
              <input
                type="text"
                value={options[index] || ''}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${letter}...`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
        <textarea
          value={explanation}
          onChange={(e) => handleContentChange({ explanation: e.target.value })}
          placeholder="Explain why this answer is correct..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          rows="2"
        />
      </div>
    </div>
  );
};

// True/False/Not Given Editor
const TrueFalseEditor = ({ question, onChange }) => {
  const { statement = '', correctAnswer = 'TRUE', explanation = '' } = question.content || {};

  const handleContentChange = (updates) => {
    onChange({
      ...question,
      content: {
        ...question.content,
        ...updates
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Statement</label>
        <textarea
          value={statement}
          onChange={(e) => handleContentChange({ statement: e.target.value })}
          placeholder="Enter the statement to be verified..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          rows="2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
        <select
          value={correctAnswer}
          onChange={(e) => handleContentChange({ correctAnswer: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="TRUE">TRUE</option>
          <option value="FALSE">FALSE</option>
          <option value="NOT GIVEN">NOT GIVEN</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
        <textarea
          value={explanation}
          onChange={(e) => handleContentChange({ explanation: e.target.value })}
          placeholder="Explain the reasoning..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          rows="2"
        />
      </div>
    </div>
  );
};

// Matching Headings Editor  
const MatchingHeadingsEditor = ({ question, onChange }) => {
  const { paragraph = '', correctHeading = '', explanation = '' } = question.content || {};

  const handleContentChange = (updates) => {
    onChange({
      ...question,
      content: {
        ...question.content,
        ...updates
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph Reference</label>
        <input
          type="text"
          value={paragraph}
          onChange={(e) => handleContentChange({ paragraph: e.target.value })}
          placeholder="e.g., Paragraph A, Section 1, etc."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Correct Heading</label>
        <input
          type="text"
          value={correctHeading}
          onChange={(e) => handleContentChange({ correctHeading: e.target.value })}
          placeholder="Enter the correct heading..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
        <textarea
          value={explanation}
          onChange={(e) => handleContentChange({ explanation: e.target.value })}
          placeholder="Explain why this heading matches the paragraph..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          rows="2"
        />
      </div>
    </div>
  );
};

export default QuestionGroup; 