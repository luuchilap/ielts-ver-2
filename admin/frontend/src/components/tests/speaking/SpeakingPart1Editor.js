import React, { useState, useRef } from 'react';
import { 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  Users, 
  Home, 
  Briefcase, 
  Heart,
  Upload,
  Play,
  Pause,
  Volume2,
  RotateCcw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const SpeakingPart1Editor = ({ part, onChange }) => {
  const [editingTopic, setEditingTopic] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const audioInputRefs = useRef({});

  const commonTopics = [
    { name: 'Home/Accommodation', icon: Home, questions: [
      "Do you live in a house or an apartment?",
      "Can you describe your home?",
      "What's your favorite room in your home?",
      "Would you like to move to a different home in the future?"
    ]},
    { name: 'Work/Study', icon: Briefcase, questions: [
      "Do you work or are you a student?",
      "What do you do for work?",
      "Do you enjoy your job?",
      "What are your future career plans?"
    ]},
    { name: 'Hobbies/Interests', icon: Heart, questions: [
      "What do you like to do in your free time?",
      "Do you have any hobbies?",
      "How long have you been interested in this hobby?",
      "Do you think hobbies are important?"
    ]},
    { name: 'Food', icon: Users, questions: [
      "What's your favorite food?",
      "Do you like cooking?",
      "What food is popular in your country?",
      "Do you prefer eating at home or in restaurants?"
    ]},
    { name: 'Transport', icon: Users, questions: [
      "How do you usually travel to work/school?",
      "What's the most popular means of transport in your hometown?",
      "Do you prefer public transport or private transport?",
      "How do you think transport will change in the future?"
    ]},
    { name: 'Weather/Seasons', icon: Users, questions: [
      "What's the weather like in your hometown?",
      "What's your favorite season?",
      "Does weather affect your mood?",
      "How does weather affect people's activities?"
    ]}
  ];

  const handleTopicNameChange = (topicId, newName) => {
    const updatedTopics = part.topics.map(topic =>
      topic.id === topicId ? { ...topic, name: newName } : topic
    );
    onChange({ topics: updatedTopics });
    setEditingTopic(null);
  };

  const handleAddTopic = () => {
    const newTopic = {
      id: `topic-${Date.now()}`,
      name: 'New Topic',
      questions: []
    };
    onChange({ topics: [...part.topics, newTopic] });
  };

  const handleDeleteTopic = (topicId) => {
    const updatedTopics = part.topics.filter(topic => topic.id !== topicId);
    onChange({ topics: updatedTopics });
    toast.success('Topic deleted');
  };

  const handleAddQuestion = (topicId) => {
    const newQuestion = {
      id: `question-${Date.now()}`,
      text: '',
      audioUrl: '',
      audioFile: null
    };
    
    const updatedTopics = part.topics.map(topic =>
      topic.id === topicId 
        ? { ...topic, questions: [...(topic.questions || []), newQuestion] }
        : topic
    );
    onChange({ topics: updatedTopics });
  };

  const handleQuestionChange = (topicId, questionId, updates) => {
    const updatedTopics = part.topics.map(topic =>
      topic.id === topicId 
        ? {
            ...topic,
            questions: topic.questions.map(q =>
              q.id === questionId ? { ...q, ...updates } : q
            )
          }
        : topic
    );
    onChange({ topics: updatedTopics });
  };

  const handleDeleteQuestion = (topicId, questionId) => {
    const updatedTopics = part.topics.map(topic =>
      topic.id === topicId 
        ? {
            ...topic,
            questions: topic.questions.filter(q => q.id !== questionId)
          }
        : topic
    );
    onChange({ topics: updatedTopics });
    toast.success('Question deleted');
  };

  const handleAudioUpload = (topicId, questionId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid audio file (MP3, WAV, OGG, M4A)');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const audioUrl = URL.createObjectURL(file);
    handleQuestionChange(topicId, questionId, {
      audioFile: file,
      audioUrl: audioUrl
    });

    toast.success('Audio uploaded successfully!');
  };

  const handleLoadQuestions = (topicId, questions) => {
    const updatedQuestions = questions.map(text => ({
      id: `question-${Date.now()}-${Math.random()}`,
      text,
      audioUrl: '',
      audioFile: null
    }));

    const updatedTopics = part.topics.map(topic =>
      topic.id === topicId 
        ? { ...topic, questions: [...(topic.questions || []), ...updatedQuestions] }
        : topic
    );
    onChange({ topics: updatedTopics });
    toast.success(`${questions.length} questions added`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Part Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Part 1: Introduction & Interview</h2>
            <p className="text-gray-500 mt-1">{part.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={part.timeLimit}
                onChange={(e) => onChange({ timeLimit: parseInt(e.target.value) })}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                min="4"
                max="6"
              />
              <span className="text-sm text-gray-500">min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Topic Templates */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Add Common Topics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {commonTopics.map((template) => {
            const IconComponent = template.icon;
            return (
              <button
                key={template.name}
                onClick={() => handleLoadQuestions('topic-new', template.questions)}
                className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <IconComponent className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{template.name}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {template.questions.length} questions
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Topics */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Interview Topics</h3>
          <button
            onClick={handleAddTopic}
            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Topic
          </button>
        </div>

        {part.topics.map((topic) => (
          <div key={topic.id} className="border border-gray-200 rounded-lg p-4">
            {/* Topic Header */}
            <div className="flex items-center justify-between mb-4">
              {editingTopic === topic.id ? (
                <input
                  type="text"
                  value={topic.name}
                  onChange={(e) => handleTopicNameChange(topic.id, e.target.value)}
                  onBlur={() => setEditingTopic(null)}
                  onKeyPress={(e) => e.key === 'Enter' && setEditingTopic(null)}
                  className="text-lg font-medium border border-gray-300 rounded px-2 py-1"
                  autoFocus
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <h4 className="text-lg font-medium text-gray-900">{topic.name}</h4>
                  <button
                    onClick={() => setEditingTopic(topic.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {topic.questions?.length || 0} questions
                </span>
                <button
                  onClick={() => handleAddQuestion(topic.id)}
                  className="flex items-center px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Question
                </button>
                <button
                  onClick={() => handleDeleteTopic(topic.id)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-3">
              {topic.questions?.map((question, index) => (
                <div key={question.id} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    
                    <div className="flex-1 space-y-3">
                      {/* Question Text */}
                      <div>
                        {editingQuestion === question.id ? (
                          <input
                            type="text"
                            value={question.text}
                            onChange={(e) => handleQuestionChange(topic.id, question.id, { text: e.target.value })}
                            onBlur={() => setEditingQuestion(null)}
                            onKeyPress={(e) => e.key === 'Enter' && setEditingQuestion(null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter question text..."
                            autoFocus
                          />
                        ) : (
                          <div
                            onClick={() => setEditingQuestion(question.id)}
                            className="cursor-text p-2 border border-transparent rounded hover:border-gray-300 hover:bg-white"
                          >
                            {question.text || 'Click to add question text...'}
                          </div>
                        )}
                      </div>

                      {/* Audio Upload */}
                      <div className="flex items-center space-x-3">
                        {!question.audioUrl ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => audioInputRefs.current[question.id]?.click()}
                              className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            >
                              <Upload className="w-3 h-3 mr-1" />
                              Upload Audio
                            </button>
                            <input
                              ref={el => audioInputRefs.current[question.id] = el}
                              type="file"
                              accept="audio/*"
                              onChange={(e) => handleAudioUpload(topic.id, question.id, e)}
                              className="hidden"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <audio
                              controls
                              src={question.audioUrl}
                              className="h-8"
                              style={{ maxWidth: '200px' }}
                            />
                            <button
                              onClick={() => handleQuestionChange(topic.id, question.id, { audioUrl: '', audioFile: null })}
                              className="p-1 text-red-400 hover:text-red-600"
                              title="Remove audio"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteQuestion(topic.id, question.id)}
                      className="flex-shrink-0 p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {(!topic.questions || topic.questions.length === 0) && (
                <div className="text-center py-4 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  No questions added yet. Click "Add Question" to get started.
                </div>
              )}
            </div>
          </div>
        ))}

        {part.topics.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No topics added yet</h3>
            <p className="text-gray-600 mb-4">
              Start by adding interview topics or use the quick templates above
            </p>
          </div>
        )}
      </div>

      {/* Part 1 Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-3">
          <Users className="w-4 h-4 inline mr-2" />
          Part 1 Question Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-800">
          <div>
            <strong>Question Types:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Personal information questions</li>
              <li>• Familiar topic questions</li>
              <li>• Simple opinion questions</li>
              <li>• Experience-based questions</li>
            </ul>
          </div>
          <div>
            <strong>Best Practices:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Keep questions simple and direct</li>
              <li>• Use present tense mostly</li>
              <li>• Ask about familiar topics</li>
              <li>• Aim for 10-12 questions total</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakingPart1Editor; 