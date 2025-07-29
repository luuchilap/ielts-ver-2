import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Save,
  ArrowLeft,
  Eye,
  Clock,
  Users,
  MessageSquare,
  FileText,
  Award
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { testsAPI } from '../../services/api';
import SpeakingPart1Editor from './speaking/SpeakingPart1Editor';
import SpeakingPart2Editor from './speaking/SpeakingPart2Editor';
import SpeakingPart3Editor from './speaking/SpeakingPart3Editor';
import SpeakingPreview from './speaking/SpeakingPreview';

const SpeakingTestEditor = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [speakingData, setSpeakingData] = useState({
    part1: {
      id: 'part-1',
      title: 'Part 1: Introduction & Interview',
      timeLimit: 5, // 4-5 minutes
      description: 'General questions about yourself and familiar topics',
      topics: [
        {
          id: 'topic-1',
          name: 'Home/Accommodation',
          questions: []
        },
        {
          id: 'topic-2', 
          name: 'Work/Study',
          questions: []
        },
        {
          id: 'topic-3',
          name: 'Familiar Topic',
          questions: []
        }
      ]
    },
    part2: {
      id: 'part-2',
      title: 'Part 2: Long Turn',
      timeLimit: 4, // 3-4 minutes (1 min prep + 2 min speaking + 1 min follow-up)
      preparationTime: 1, // 1 minute
      speakingTime: 2, // 2 minutes
      description: 'Speak about a given topic using cue card',
      cueCard: {
        topic: '',
        description: '',
        points: ['', '', '', ''],
        instructions: 'You will have to talk about the topic for one to two minutes. You have one minute to think about what you are going to say. You can make some notes to help you if you wish.'
      },
      followUpQuestions: []
    },
    part3: {
      id: 'part-3',
      title: 'Part 3: Discussion',
      timeLimit: 5, // 4-5 minutes
      description: 'Discussion of more abstract ideas related to Part 2 topic',
      themes: [
        {
          id: 'theme-1',
          name: 'Abstract Theme 1',
          questions: []
        },
        {
          id: 'theme-2',
          name: 'Abstract Theme 2', 
          questions: []
        }
      ]
    }
  });

  const [activePart, setActivePart] = useState('part1');
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
        let partsData = testData?.speakingParts;
        if (!partsData || partsData.length === 0) {
          partsData = testData?.speaking?.parts;
        }
        
        if (partsData) {
          setSpeakingData({
            part1: partsData.find(p => p.id === 'part-1') || {
              id: 'part-1', title: 'Part 1: Introduction & Interview', timeLimit: 5, description: 'General questions about yourself and familiar topics', topics: [ { id: 'topic-1', name: 'Home/Accommodation', questions: [] }, { id: 'topic-2', name: 'Work/Study', questions: [] }, { id: 'topic-3', name: 'Familiar Topic', questions: [] } ]
            },
            part2: partsData.find(p => p.id === 'part-2') || {
              id: 'part-2', title: 'Part 2: Long Turn', timeLimit: 4, preparationTime: 1, speakingTime: 2, description: 'Speak about a given topic using cue card', cueCard: { topic: '', description: '', points: ['', '', '', ''], instructions: 'You will have to talk about the topic for one to two minutes. You have one minute to think about what you are going to say. You can make some notes to help you if you wish.' }, followUpQuestions: []
            },
            part3: partsData.find(p => p.id === 'part-3') || {
              id: 'part-3', title: 'Part 3: Discussion', timeLimit: 5, description: 'Discussion of more abstract ideas related to Part 2 topic', themes: [ { id: 'theme-1', name: 'Abstract Theme 1', questions: [] }, { id: 'theme-2', name: 'Abstract Theme 2', questions: [] } ]
            }
          });
        } else {
          setSpeakingData({
            part1: { id: 'part-1', title: 'Part 1: Introduction & Interview', timeLimit: 5, description: 'General questions about yourself and familiar topics', topics: [ { id: 'topic-1', name: 'Home/Accommodation', questions: [] }, { id: 'topic-2', name: 'Work/Study', questions: [] }, { id: 'topic-3', name: 'Familiar Topic', questions: [] } ] },
            part2: { id: 'part-2', title: 'Part 2: Long Turn', timeLimit: 4, preparationTime: 1, speakingTime: 2, description: 'Speak about a given topic using cue card', cueCard: { topic: '', description: '', points: ['', '', '', ''], instructions: 'You will have to talk about the topic for one to two minutes. You have one minute to think about what you are going to say. You can make some notes to help you if you wish.' }, followUpQuestions: [] },
            part3: { id: 'part-3', title: 'Part 3: Discussion', timeLimit: 5, description: 'Discussion of more abstract ideas related to Part 2 topic', themes: [ { id: 'theme-1', name: 'Abstract Theme 1', questions: [] }, { id: 'theme-2', name: 'Abstract Theme 2', questions: [] } ] }
          });
        }
      }
    }
  );

  // Reset state khi testId thay đổi (tránh giữ lại state cũ)
  useEffect(() => {
    setSpeakingData({
      part1: { id: 'part-1', title: 'Part 1: Introduction & Interview', timeLimit: 5, description: 'General questions about yourself and familiar topics', topics: [ { id: 'topic-1', name: 'Home/Accommodation', questions: [] }, { id: 'topic-2', name: 'Work/Study', questions: [] }, { id: 'topic-3', name: 'Familiar Topic', questions: [] } ] },
      part2: { id: 'part-2', title: 'Part 2: Long Turn', timeLimit: 4, preparationTime: 1, speakingTime: 2, description: 'Speak about a given topic using cue card', cueCard: { topic: '', description: '', points: ['', '', '', ''], instructions: 'You will have to talk about the topic for one to two minutes. You have one minute to think about what you are going to say. You can make some notes to help you if you wish.' }, followUpQuestions: [] },
      part3: { id: 'part-3', title: 'Part 3: Discussion', timeLimit: 5, description: 'Discussion of more abstract ideas related to Part 2 topic', themes: [ { id: 'theme-1', name: 'Abstract Theme 1', questions: [] }, { id: 'theme-2', name: 'Abstract Theme 2', questions: [] } ] }
    });
    refetch(); // Luôn fetch lại dữ liệu khi mount
    return () => {
      setSpeakingData({
        part1: { id: 'part-1', title: 'Part 1: Introduction & Interview', timeLimit: 5, description: 'General questions about yourself and familiar topics', topics: [ { id: 'topic-1', name: 'Home/Accommodation', questions: [] }, { id: 'topic-2', name: 'Work/Study', questions: [] }, { id: 'topic-3', name: 'Familiar Topic', questions: [] } ] },
        part2: { id: 'part-2', title: 'Part 2: Long Turn', timeLimit: 4, preparationTime: 1, speakingTime: 2, description: 'Speak about a given topic using cue card', cueCard: { topic: '', description: '', points: ['', '', '', ''], instructions: 'You will have to talk about the topic for one to two minutes. You have one minute to think about what you are going to say. You can make some notes to help you if you wish.' }, followUpQuestions: [] },
        part3: { id: 'part-3', title: 'Part 3: Discussion', timeLimit: 5, description: 'Discussion of more abstract ideas related to Part 2 topic', themes: [ { id: 'theme-1', name: 'Abstract Theme 1', questions: [] }, { id: 'theme-2', name: 'Abstract Theme 2', questions: [] } ] }
      });
    };
  }, [testId]);

  // Save test data mutation
  const saveTestMutation = useMutation(
    (data) => testsAPI.update(testId, data),
    {
      onSuccess: () => {
        toast.success('Speaking test saved successfully!');
        queryClient.invalidateQueries(['test', testId]);
        queryClient.invalidateQueries(['tests']);
      },
      onError: (error) => {
        console.error('Save error:', error);
        toast.error('Failed to save speaking test');
      }
    }
  );

  useEffect(() => {
    // No longer needed as data is loaded via useQuery
  }, [testId]);

  const handleBack = () => {
    navigate('/tests');
  };

  const handlePartUpdate = (partId, updates) => {
    setSpeakingData(prev => ({
      ...prev,
      [partId]: {
        ...prev[partId],
        ...updates
      }
    }));
  };

  const handleSave = async () => {
    // Validate data
    const errors = validateSpeakingData();
    if (errors.length > 0) {
      toast.error(`Please fix the following errors: ${errors.join(', ')}`);
      return;
    }

    // Prepare data for API
    const parts = [speakingData.part1, speakingData.part2, speakingData.part3];
    const updateData = {
      // Flat structure (primary)
      speakingParts: parts,
      // Legacy structure (backward compatibility)
      speaking: {
        parts: parts,
        totalTime: speakingData.part1.timeLimit + speakingData.part2.timeLimit + speakingData.part3.timeLimit
      }
    };

    saveTestMutation.mutate(updateData);
  };

  const validateSpeakingData = () => {
    const errors = [];
    
    // Part 1 validation
    const part1HasQuestions = speakingData.part1.topics.some(topic => topic.questions.length > 0);
    if (!part1HasQuestions) {
      errors.push('Part 1 must have at least one question in any topic');
    }

    // Part 2 validation
    if (!speakingData.part2.cueCard.topic.trim()) {
      errors.push('Part 2 cue card topic is required');
    }

    // Part 3 validation
    const part3HasQuestions = speakingData.part3.themes.some(theme => theme.questions.length > 0);
    if (!part3HasQuestions) {
      errors.push('Part 3 must have at least one question in any theme');
    }

    return errors;
  };

  const getTotalTime = () => {
    return speakingData.part1.timeLimit + 
           speakingData.part2.timeLimit + 
           speakingData.part3.timeLimit;
  };

  if (showPreview) {
    return (
      <SpeakingPreview 
        data={speakingData}
        onBack={() => setShowPreview(false)}
      />
    );
  }

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

  // Get current part with safety check
  const currentPart = speakingData[activePart];
  if (!currentPart) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Part Not Found</h2>
          <p className="text-gray-600 mb-4">The selected part doesn't exist.</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Speaking Test Editor</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Total: {getTotalTime()} minutes</span>
          </div>
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

      {/* Part Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActivePart('part1')}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
              activePart === 'part1'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            <div className="text-left">
              <div>Part 1</div>
              <div className="text-xs text-gray-500">
                Introduction & Interview • {speakingData.part1.timeLimit} min
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setActivePart('part2')}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
              activePart === 'part2'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            <div className="text-left">
              <div>Part 2</div>
              <div className="text-xs text-gray-500">
                Long Turn • {speakingData.part2.timeLimit} min
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setActivePart('part3')}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
              activePart === 'part3'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            <div className="text-left">
              <div>Part 3</div>
              <div className="text-xs text-gray-500">
                Discussion • {speakingData.part3.timeLimit} min
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Part Editor */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {activePart === 'part1' && (
          <SpeakingPart1Editor
            part={speakingData.part1}
            onChange={(updates) => handlePartUpdate('part1', updates)}
          />
        )}
        {activePart === 'part2' && (
          <SpeakingPart2Editor
            part={speakingData.part2}
            onChange={(updates) => handlePartUpdate('part2', updates)}
          />
        )}
        {activePart === 'part3' && (
          <SpeakingPart3Editor
            part={speakingData.part3}
            onChange={(updates) => handlePartUpdate('part3', updates)}
          />
        )}
      </div>

      {/* Speaking Test Guidelines */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Part 1 Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="flex items-center text-sm font-medium text-blue-900 mb-3">
            <Users className="w-4 h-4 mr-2" />
            Part 1 Guidelines
          </h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• <strong>Time:</strong> 4-5 minutes</li>
            <li>• <strong>Format:</strong> Questions about yourself</li>
            <li>• <strong>Topics:</strong> Home, work/study, familiar topics</li>
            <li>• <strong>Questions:</strong> 10-12 questions total</li>
            <li>• <strong>Answers:</strong> 1-2 sentences each</li>
            <li>• <strong>Purpose:</strong> Warm-up and introduction</li>
          </ul>
        </div>

        {/* Part 2 Guidelines */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="flex items-center text-sm font-medium text-green-900 mb-3">
            <FileText className="w-4 h-4 mr-2" />
            Part 2 Guidelines
          </h3>
          <ul className="text-xs text-green-800 space-y-1">
            <li>• <strong>Time:</strong> 3-4 minutes total</li>
            <li>• <strong>Preparation:</strong> 1 minute to prepare</li>
            <li>• <strong>Speaking:</strong> 1-2 minutes monologue</li>
            <li>• <strong>Format:</strong> Cue card with topic</li>
            <li>• <strong>Follow-up:</strong> 1-2 questions</li>
            <li>• <strong>Purpose:</strong> Extended speaking</li>
          </ul>
        </div>

        {/* Part 3 Guidelines */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="flex items-center text-sm font-medium text-purple-900 mb-3">
            <MessageSquare className="w-4 h-4 mr-2" />
            Part 3 Guidelines
          </h3>
          <ul className="text-xs text-purple-800 space-y-1">
            <li>• <strong>Time:</strong> 4-5 minutes</li>
            <li>• <strong>Format:</strong> Discussion with examiner</li>
            <li>• <strong>Topics:</strong> Abstract ideas related to Part 2</li>
            <li>• <strong>Questions:</strong> 4-6 questions</li>
            <li>• <strong>Answers:</strong> Extended responses</li>
            <li>• <strong>Purpose:</strong> Abstract thinking and analysis</li>
          </ul>
        </div>
      </div>

      {/* Assessment Criteria */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="flex items-center text-sm font-medium text-yellow-900 mb-3">
          <Award className="w-4 h-4 mr-2" />
          IELTS Speaking Assessment Criteria
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-yellow-800">
          <div>
            <strong>Fluency and Coherence (25%)</strong>
            <ul className="mt-1 space-y-1">
              <li>• Ability to speak at length</li>
              <li>• Coherence of ideas</li>
              <li>• Appropriate use of discourse markers</li>
            </ul>
          </div>
          <div>
            <strong>Lexical Resource (25%)</strong>
            <ul className="mt-1 space-y-1">
              <li>• Range of vocabulary</li>
              <li>• Appropriateness of vocabulary</li>
              <li>• Ability to paraphrase</li>
            </ul>
          </div>
          <div>
            <strong>Grammatical Range (25%)</strong>
            <ul className="mt-1 space-y-1">
              <li>• Range of structures</li>
              <li>• Accuracy of grammar</li>
              <li>• Appropriate use of complex structures</li>
            </ul>
          </div>
          <div>
            <strong>Pronunciation (25%)</strong>
            <ul className="mt-1 space-y-1">
              <li>• Individual sounds</li>
              <li>• Word stress</li>
              <li>• Sentence stress and intonation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakingTestEditor; 