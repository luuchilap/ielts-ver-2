import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  ArrowLeft, 
  Eye, 
  Save,
  PenTool,
  BarChart3,
  BookOpen,
  Image,
  Award
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { testsAPI } from '../../services/api';
import WritingTask1Editor from './writing/WritingTask1Editor';
import WritingTask2Editor from './writing/WritingTask2Editor';
import WritingPreview from './writing/WritingPreview';

const WritingTestEditor = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [writingData, setWritingData] = useState({
    task1: {
      id: 'task-1',
      title: 'Task 1',
      timeLimit: 20, // minutes
      minWords: 150,
      type: 'academic', // academic or general
      prompt: '',
      imageUrl: '',
      imageFile: null,
      chartType: '', // line, bar, pie, table, process, map
      sampleAnswer: '',
      rubric: {
        taskAchievement: '',
        coherenceCohesion: '',
        lexicalResource: '',
        grammaticalRange: ''
      }
    },
    task2: {
      id: 'task-2',
      title: 'Task 2',
      timeLimit: 40, // minutes
      minWords: 250,
      type: 'academic', // academic or general
      prompt: '',
      essayType: '', // opinion, discussion, problem-solution, advantage-disadvantage
      sampleAnswer: '',
      rubric: {
        taskResponse: '',
        coherenceCohesion: '',
        lexicalResource: '',
        grammaticalRange: ''
      }
    }
  });

  const [activeTask, setActiveTask] = useState('task1');
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
        
        // Try to load from flat structure first, then fallback to legacy structure
        let tasksData = testData?.writingTasks;
        if (!tasksData || tasksData.length === 0) {
          tasksData = testData?.writing?.tasks;
        }
        
        if (tasksData) {
          setWritingData({
            task1: tasksData.find(t => t.id === 'task-1') || {
              id: 'task-1', title: 'Task 1', timeLimit: 20, minWords: 150, type: 'academic', prompt: '', imageUrl: '', imageFile: null, chartType: '', sampleAnswer: '', rubric: { taskAchievement: '', coherenceCohesion: '', lexicalResource: '', grammaticalRange: '' }
            },
            task2: tasksData.find(t => t.id === 'task-2') || {
              id: 'task-2', title: 'Task 2', timeLimit: 40, minWords: 250, type: 'academic', prompt: '', essayType: '', sampleAnswer: '', rubric: { taskResponse: '', coherenceCohesion: '', lexicalResource: '', grammaticalRange: '' }
            }
          });
        } else {
          setWritingData({
            task1: { id: 'task-1', title: 'Task 1', timeLimit: 20, minWords: 150, type: 'academic', prompt: '', imageUrl: '', imageFile: null, chartType: '', sampleAnswer: '', rubric: { taskAchievement: '', coherenceCohesion: '', lexicalResource: '', grammaticalRange: '' } },
            task2: { id: 'task-2', title: 'Task 2', timeLimit: 40, minWords: 250, type: 'academic', prompt: '', essayType: '', sampleAnswer: '', rubric: { taskResponse: '', coherenceCohesion: '', lexicalResource: '', grammaticalRange: '' } }
          });
        }
      }
    }
  );

  // Reset state khi testId thay đổi (tránh giữ lại state cũ)
  useEffect(() => {
    setWritingData({
      task1: { id: 'task-1', title: 'Task 1', timeLimit: 20, minWords: 150, type: 'academic', prompt: '', imageUrl: '', imageFile: null, chartType: '', sampleAnswer: '', rubric: { taskAchievement: '', coherenceCohesion: '', lexicalResource: '', grammaticalRange: '' } },
      task2: { id: 'task-2', title: 'Task 2', timeLimit: 40, minWords: 250, type: 'academic', prompt: '', essayType: '', sampleAnswer: '', rubric: { taskResponse: '', coherenceCohesion: '', lexicalResource: '', grammaticalRange: '' } }
    });
    refetch(); // Luôn fetch lại dữ liệu khi mount
    return () => {
      setWritingData({
        task1: { id: 'task-1', title: 'Task 1', timeLimit: 20, minWords: 150, type: 'academic', prompt: '', imageUrl: '', imageFile: null, chartType: '', sampleAnswer: '', rubric: { taskAchievement: '', coherenceCohesion: '', lexicalResource: '', grammaticalRange: '' } },
        task2: { id: 'task-2', title: 'Task 2', timeLimit: 40, minWords: 250, type: 'academic', prompt: '', essayType: '', sampleAnswer: '', rubric: { taskResponse: '', coherenceCohesion: '', lexicalResource: '', grammaticalRange: '' } }
      });
    };
  }, [testId]);

  // Save test data mutation
  const saveTestMutation = useMutation(
    (data) => testsAPI.update(testId, data),
    {
      onSuccess: () => {
        toast.success('Writing test saved successfully!');
        queryClient.invalidateQueries(['test', testId]);
        queryClient.invalidateQueries(['tests']);
      },
      onError: (error) => {
        console.error('Save error:', error);
        toast.error('Failed to save writing test');
      }
    }
  );

  useEffect(() => {
    // No longer needed as data is loaded by useQuery
  }, [testId]);

  const handleBack = () => {
    navigate('/tests');
  };

  const handleTaskUpdate = (taskId, updates) => {
    setWritingData(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        ...updates
      }
    }));
  };

  const handleSave = async () => {
    // Validate data
    const errors = validateWritingData();
    if (errors.length > 0) {
      toast.error(`Please fix the following errors: ${errors.join(', ')}`);
      return;
    }

    // Prepare data for API
    const tasks = [writingData.task1, writingData.task2];
    const updateData = {
      // Flat structure (primary)
      writingTasks: tasks,
      // Legacy structure (backward compatibility)
      writing: {
        tasks: tasks,
        totalTime: writingData.task1.timeLimit + writingData.task2.timeLimit
      }
    };

    saveTestMutation.mutate(updateData);
  };

  const validateWritingData = () => {
    const errors = [];
    
    // Task 1 validation
    if (!writingData.task1.prompt.trim()) {
      errors.push('Task 1 prompt is required');
    }
    
    if (writingData.task1.type === 'academic' && !writingData.task1.imageUrl && !writingData.task1.imageFile) {
      errors.push('Task 1 requires a chart/graph/diagram');
    }

    // Task 2 validation
    if (!writingData.task2.prompt.trim()) {
      errors.push('Task 2 prompt is required');
    }

    if (!writingData.task2.essayType) {
      errors.push('Task 2 essay type is required');
    }

    return errors;
  };

  // Show loading state
  if (isLoadingTest || (testId !== 'new' && !test)) {
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

  // Get current task with safety check
  const currentTask = writingData[activeTask];
  if (!currentTask) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Task Not Found</h2>
          <p className="text-gray-600 mb-4">The selected task doesn't exist.</p>
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
      <WritingPreview 
        data={writingData}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
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
          <h1 className="text-2xl font-bold text-gray-900">Writing Test Editor</h1>
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

      {/* Task Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTask('task1')}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
              activeTask === 'task1'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Image className="w-4 h-4 mr-2" />
            <div className="text-left">
              <div>Task 1</div>
              <div className="text-xs text-gray-500">
                {writingData.task1.timeLimit} min • {writingData.task1.minWords}+ words
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTask('task2')}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
              activeTask === 'task2'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <PenTool className="w-4 h-4 mr-2" />
            <div className="text-left">
              <div>Task 2</div>
              <div className="text-xs text-gray-500">
                {writingData.task2.timeLimit} min • {writingData.task2.minWords}+ words
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Task Editor */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {activeTask === 'task1' ? (
          <WritingTask1Editor
            task={writingData.task1}
            onChange={(updates) => handleTaskUpdate('task1', updates)}
          />
        ) : (
          <WritingTask2Editor
            task={writingData.task2}
            onChange={(updates) => handleTaskUpdate('task2', updates)}
          />
        )}
      </div>

      {/* Writing Guidelines */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task 1 Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="flex items-center text-sm font-medium text-blue-900 mb-3">
            <Image className="w-4 h-4 mr-2" />
            Task 1 Guidelines
          </h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• <strong>Academic:</strong> Describe charts, graphs, tables, diagrams</li>
            <li>• <strong>General:</strong> Write letters (formal, semi-formal, informal)</li>
            <li>• <strong>Time:</strong> 20 minutes recommended</li>
            <li>• <strong>Words:</strong> At least 150 words</li>
            <li>• <strong>Focus:</strong> Factual, objective description</li>
            <li>• <strong>Structure:</strong> Introduction, overview, key features</li>
          </ul>
        </div>

        {/* Task 2 Guidelines */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="flex items-center text-sm font-medium text-green-900 mb-3">
            <PenTool className="w-4 h-4 mr-2" />
            Task 2 Guidelines
          </h3>
          <ul className="text-xs text-green-800 space-y-1">
            <li>• <strong>Essay Types:</strong> Opinion, Discussion, Problem-Solution</li>
            <li>• <strong>Time:</strong> 40 minutes recommended</li>
            <li>• <strong>Words:</strong> At least 250 words</li>
            <li>• <strong>Focus:</strong> Argument, analysis, evaluation</li>
            <li>• <strong>Structure:</strong> Introduction, body paragraphs, conclusion</li>
            <li>• <strong>Skills:</strong> Critical thinking, coherent argument</li>
          </ul>
        </div>
      </div>

      {/* Scoring Criteria */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="flex items-center text-sm font-medium text-yellow-900 mb-3">
          <Award className="w-4 h-4 mr-2" />
          IELTS Writing Assessment Criteria
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-yellow-800">
          <div>
            <strong>Task 1 Criteria:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Task Achievement (25%)</li>
              <li>• Coherence and Cohesion (25%)</li>
              <li>• Lexical Resource (25%)</li>
              <li>• Grammatical Range and Accuracy (25%)</li>
            </ul>
          </div>
          <div>
            <strong>Task 2 Criteria:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Task Response (25%)</li>
              <li>• Coherence and Cohesion (25%)</li>
              <li>• Lexical Resource (25%)</li>
              <li>• Grammatical Range and Accuracy (25%)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingTestEditor; 