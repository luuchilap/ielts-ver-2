import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Plus, 
  Trash2, 
  Eye, 
  Move, 
  FileText, 
  Clock,
  Save,
  ArrowLeft,
  Copy,
  Layers
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { testsAPI } from '../../services/api';
import ReadingPassageEditor from './reading/ReadingPassageEditor';
import QuestionGroup from './QuestionGroup';
import ReadingPreview from './reading/ReadingPreview';

const ReadingTestEditor = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [readingData, setReadingData] = useState({
    sections: [
      {
        id: 'section-1',
        title: 'Section 1',
        passage: '',
        suggestedTime: 20,
        questionGroups: []
      },
      {
        id: 'section-2', 
        title: 'Section 2',
        passage: '',
        suggestedTime: 20,
        questionGroups: []
      },
      {
        id: 'section-3',
        title: 'Section 3', 
        passage: '',
        suggestedTime: 20,
        questionGroups: []
      }
    ]
  });

  const [activeSection, setActiveSection] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Load test data
  const {
    data: test,
    isLoading: isLoadingTest,
    error: testError,
    refetch
  } = useQuery(
    ['test', testId],
    () => testsAPI.getById(testId),
    {
      enabled: !!testId && testId !== 'new',
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const testData = data?.data?.data?.test;
        console.log('Loading test data:', testData); // Debug log
        
        if (testData?.reading?.sections && testData.reading.sections.length > 0) {
          // Load existing sections from database
          const loadedSections = testData.reading.sections.map((section, index) => {
            // Convert old question format to question groups if needed
            let questionGroups = section.questionGroups || [];
            
            // If old format with direct questions, convert to groups
            if (section.questions && section.questions.length > 0 && questionGroups.length === 0) {
              questionGroups = [{
                id: `group-${Date.now()}`,
                title: 'Questions',
                questionType: 'short-answer',
                instructions: 'Answer the questions below.\nChoose NO MORE THAN THREE WORDS from the passage for each answer.\nWrite your answers in boxes {range} on your answer sheet.',
                questions: section.questions
              }];
            }
            
            return {
              id: section.id || `section-${index + 1}`,
              title: section.title || `Section ${index + 1}`,
              passage: section.passage || '',
              suggestedTime: section.suggestedTime || 20,
              questionGroups: questionGroups
            };
          });
          
          console.log('Loaded sections:', loadedSections, 'Current activeSection:', activeSection); // Debug log
          
          setReadingData({
            sections: loadedSections
          });
          
          // Reset activeSection if it's out of bounds
          if (activeSection >= loadedSections.length) {
            console.log('Resetting activeSection from', activeSection, 'to 0'); // Debug log
            setActiveSection(0);
          }
        } else {
          // No sections in database, initialize with default sections
          console.log('No reading sections found, initializing with defaults');
          setReadingData({
            sections: [
              { id: 'section-1', title: 'Section 1', passage: '', suggestedTime: 20, questionGroups: [] },
              { id: 'section-2', title: 'Section 2', passage: '', suggestedTime: 20, questionGroups: [] },
              { id: 'section-3', title: 'Section 3', passage: '', suggestedTime: 20, questionGroups: [] }
            ]
          });
          setActiveSection(0);
        }
      }
    }
  );

  // Save test data mutation
  const saveTestMutation = useMutation(
    (data) => testsAPI.update(testId, data),
    {
      onSuccess: () => {
        toast.success('Reading test saved successfully!');
        queryClient.invalidateQueries(['test', testId]);
        queryClient.invalidateQueries(['tests']);
      },
      onError: (error) => {
        console.error('Save error:', error);
        toast.error('Failed to save reading test');
      }
    }
  );

  // Reset state when testId changes
  useEffect(() => {
    setActiveSection(0); // Reset active section first
    setReadingData({
      sections: [
        { id: 'section-1', title: 'Section 1', passage: '', suggestedTime: 20, questionGroups: [] },
        { id: 'section-2', title: 'Section 2', passage: '', suggestedTime: 20, questionGroups: [] },
        { id: 'section-3', title: 'Section 3', passage: '', suggestedTime: 20, questionGroups: [] }
      ]
    });
    // Only refetch if not a new test
    if (testId !== 'new') {
      refetch();
    }
  }, [testId, refetch]);

  const handleBack = () => {
    navigate('/tests');
  };

  const handleSectionUpdate = (sectionIndex, updates) => {
    setReadingData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) => 
        index === sectionIndex ? { ...section, ...updates } : section
      )
    }));
  };

  const handleQuestionGroupAdd = (sectionIndex) => {
    const newGroup = {
      id: `group-${Date.now()}`,
      title: '',
      questionType: 'short-answer',
      instructions: '',
      questions: []
    };

    const currentGroups = readingData.sections[sectionIndex].questionGroups;
    handleSectionUpdate(sectionIndex, {
      questionGroups: [...currentGroups, newGroup]
    });
  };

  const handleQuestionGroupUpdate = (sectionIndex, groupId, updates) => {
    const updatedGroups = readingData.sections[sectionIndex].questionGroups.map(group =>
      group.id === groupId ? { ...group, ...updates } : group
    );
    handleSectionUpdate(sectionIndex, { questionGroups: updatedGroups });
  };

  const handleQuestionGroupDelete = (sectionIndex, groupId) => {
    const updatedGroups = readingData.sections[sectionIndex].questionGroups.filter(group => group.id !== groupId);
    handleSectionUpdate(sectionIndex, { questionGroups: updatedGroups });
  };

  const handleQuestionGroupReorder = (sectionIndex, result) => {
    if (!result.destination) return;

    const groups = Array.from(readingData.sections[sectionIndex].questionGroups);
    const [reorderedItem] = groups.splice(result.source.index, 1);
    groups.splice(result.destination.index, 0, reorderedItem);

    handleSectionUpdate(sectionIndex, { questionGroups: groups });
  };

  const handleSave = async () => {
    // Validate data
    const errors = validateReadingData();
    if (errors.length > 0) {
      toast.error(`Please fix the following errors: ${errors.join(', ')}`);
      return;
    }

    // Prepare data for API - convert questionGroups back to questions for backend compatibility
    const sectionsForSave = readingData.sections.map(section => {
      // Flatten all questions from all groups
      const allQuestions = [];
      let questionNumber = 1;
      
      section.questionGroups.forEach(group => {
        group.questions.forEach(question => {
          allQuestions.push({
            ...question,
            order: questionNumber++,
            groupId: group.id,
            groupType: group.questionType,
            groupInstructions: group.instructions
          });
        });
      });

      return {
        ...section,
        questions: allQuestions,
        questionGroups: section.questionGroups // Keep groups for future use
      };
    });

    const updateData = {
      reading: {
        sections: sectionsForSave,
        totalTime: readingData.sections.reduce((total, section) => total + section.suggestedTime, 0)
      }
    };

    saveTestMutation.mutate(updateData);
  };

  const validateReadingData = () => {
    const errors = [];
    
    readingData.sections.forEach((section, index) => {
      if (!section.passage || section.passage.trim().length < 50) {
        errors.push(`Section ${index + 1} needs a longer passage (at least 50 characters)`);
      }
      if (section.questionGroups.length === 0) {
        errors.push(`Section ${index + 1} must have at least one question group`);
      }
      
      section.questionGroups.forEach((group, gIndex) => {
        if (group.questions.length === 0) {
          errors.push(`Section ${index + 1}, Group ${gIndex + 1}: Must have at least one question`);
        }
        
        group.questions.forEach((question, qIndex) => {
          if (!question.content?.statement?.trim()) {
            errors.push(`Section ${index + 1}, Group ${gIndex + 1}, Question ${qIndex + 1}: Statement is required`);
          }
          // Different validation based on question type
          if (question.type === 'multiple-choice') {
            if (!question.content?.correctAnswer) {
              errors.push(`Section ${index + 1}, Group ${gIndex + 1}, Question ${qIndex + 1}: Correct answer is required`);
            }
          } else {
            if (!question.content?.answer?.trim()) {
              errors.push(`Section ${index + 1}, Group ${gIndex + 1}, Question ${qIndex + 1}: Answer is required`);
            }
          }
        });
      });
    });

    return errors;
  };

  const getTotalQuestions = (sectionIndex) => {
    return readingData.sections[sectionIndex].questionGroups.reduce(
      (total, group) => total + group.questions.length, 0
    );
  };

  const getQuestionStartNumber = (sectionIndex, groupIndex) => {
    let startNumber = 1;
    for (let i = 0; i < groupIndex; i++) {
      startNumber += readingData.sections[sectionIndex].questionGroups[i].questions.length;
    }
    return startNumber;
  };

  // Show loading state
  if (isLoadingTest || (testId !== 'new' && !test)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  // Show loading while sections are being initialized for existing tests
  if (testId !== 'new' && test && readingData.sections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  // Show error state
  if (testError) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Test</h2>
          <p className="text-gray-600 mb-4">Failed to load test data. Please try again.</p>
          <button
            onClick={() => navigate('/tests')}
            className="btn btn-primary"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  // Get current section with safety check
  const currentSection = readingData.sections[activeSection];
  if (!currentSection) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Section Not Found</h2>
          <p className="text-gray-600 mb-4">The selected section doesn't exist.</p>
          <button
            onClick={() => navigate('/tests')}
            className="btn btn-primary"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <ReadingPreview 
        data={readingData}
        onBack={() => setShowPreview(false)}
      />
    );
  }

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
            disabled={saveTestMutation.isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveTestMutation.isLoading ? 'Saving...' : 'Save'}
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
                    <FileText className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {getTotalQuestions(index)} questions • {section.questionGroups.length} groups
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {section.suggestedTime} minutes
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
                    Reading passage and question groups for this section
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={readingData.sections[activeSection].suggestedTime}
                    onChange={(e) => handleSectionUpdate(activeSection, { suggestedTime: parseInt(e.target.value) })}
                    className="w-20 px-3 py-1 border border-gray-300 rounded text-center"
                    min="5"
                    max="30"
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

            {/* Question Groups Section */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Question Groups</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Organize questions by type with specific instructions for each group
                  </p>
                </div>
                <button
                  onClick={() => handleQuestionGroupAdd(activeSection)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question Group
                </button>
              </div>

              {/* Question Groups List */}
              <DragDropContext onDragEnd={(result) => handleQuestionGroupReorder(activeSection, result)}>
                <Droppable droppableId="question-groups">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {readingData.sections[activeSection].questionGroups.map((group, groupIndex) => (
                        <Draggable key={group.id} draggableId={group.id} index={groupIndex}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <div className="flex items-center mb-2" {...provided.dragHandleProps}>
                                <Move className="w-4 h-4 text-gray-400 cursor-move mr-2" />
                                <span className="text-sm text-gray-500">Drag to reorder groups</span>
                              </div>
                              <QuestionGroup
                                group={group}
                                onUpdate={(updates) => handleQuestionGroupUpdate(activeSection, group.id, updates)}
                                onDelete={() => handleQuestionGroupDelete(activeSection, group.id)}
                                questionStartNumber={getQuestionStartNumber(activeSection, groupIndex)}
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

              {readingData.sections[activeSection].questionGroups.length === 0 && (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  <Layers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">No question groups yet</p>
                  <p className="text-sm mt-1">Add a passage first, then create question groups</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Example: Multiple Choice (1-5), Fill in the Blank (6-8), Matching Headings (9-13)
                  </p>
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