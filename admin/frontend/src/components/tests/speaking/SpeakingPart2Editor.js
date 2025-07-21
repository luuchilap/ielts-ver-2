import React, { useState, useRef } from 'react';
import { 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  FileText, 
  Upload,
  Play,
  Pause,
  Volume2,
  MessageSquare,
  Lightbulb
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const SpeakingPart2Editor = ({ part, onChange }) => {
  const [editingFollowUp, setEditingFollowUp] = useState(null);
  const audioInputRefs = useRef({});

  const cueCardTemplates = [
    {
      topic: "Describe a person who has influenced you",
      description: "You should say:",
      points: [
        "who this person is",
        "how you know this person", 
        "what influence this person has had on you",
        "and explain why this person has been important to you"
      ]
    },
    {
      topic: "Describe a place you would like to visit",
      description: "You should say:",
      points: [
        "where this place is",
        "what you know about this place",
        "what you would like to do there",
        "and explain why you want to visit this place"
      ]
    },
    {
      topic: "Describe an important event in your life",
      description: "You should say:",
      points: [
        "what the event was",
        "when it happened",
        "who was involved",
        "and explain why it was important to you"
      ]
    },
    {
      topic: "Describe a skill you would like to learn",
      description: "You should say:",
      points: [
        "what the skill is",
        "why you want to learn it",
        "how you would learn it",
        "and explain how this skill would help you"
      ]
    },
    {
      topic: "Describe your favorite book or movie",
      description: "You should say:",
      points: [
        "what it is about",
        "when you first read/watched it",
        "why you like it",
        "and explain what you learned from it"
      ]
    },
    {
      topic: "Describe a memorable meal you had",
      description: "You should say:",
      points: [
        "what you ate",
        "where you had this meal",
        "who you were with",
        "and explain why it was memorable"
      ]
    }
  ];

  const followUpTemplates = [
    "Do you think this is common in your country?",
    "How has this changed over the years?",
    "What advice would you give to others about this?",
    "Do you think this will be different in the future?",
    "How does this compare to other countries?",
    "What are the advantages and disadvantages of this?"
  ];

  const handleCueCardChange = (field, value) => {
    onChange({
      cueCard: {
        ...part.cueCard,
        [field]: value
      }
    });
  };

  const handlePointChange = (index, value) => {
    const newPoints = [...part.cueCard.points];
    newPoints[index] = value;
    handleCueCardChange('points', newPoints);
  };

  const handleLoadTemplate = (template) => {
    onChange({
      cueCard: {
        ...part.cueCard,
        topic: template.topic,
        description: template.description,
        points: [...template.points]
      }
    });
    toast.success('Template loaded successfully!');
  };

  const handleAddFollowUp = () => {
    const newQuestion = {
      id: `followup-${Date.now()}`,
      text: '',
      audioUrl: '',
      audioFile: null
    };
    onChange({
      followUpQuestions: [...(part.followUpQuestions || []), newQuestion]
    });
  };

  const handleFollowUpChange = (questionId, updates) => {
    const updatedQuestions = part.followUpQuestions.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    );
    onChange({ followUpQuestions: updatedQuestions });
  };

  const handleDeleteFollowUp = (questionId) => {
    const updatedQuestions = part.followUpQuestions.filter(q => q.id !== questionId);
    onChange({ followUpQuestions: updatedQuestions });
    toast.success('Follow-up question deleted');
  };

  const handleAudioUpload = (questionId, event) => {
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
    handleFollowUpChange(questionId, {
      audioFile: file,
      audioUrl: audioUrl
    });

    toast.success('Audio uploaded successfully!');
  };

  const addTemplateQuestion = (template) => {
    const newQuestion = {
      id: `followup-${Date.now()}`,
      text: template,
      audioUrl: '',
      audioFile: null
    };
    onChange({
      followUpQuestions: [...(part.followUpQuestions || []), newQuestion]
    });
    toast.success('Question added');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Part Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Part 2: Long Turn</h2>
            <p className="text-gray-500 mt-1">{part.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Prep:</span>
              <input
                type="number"
                value={part.preparationTime}
                onChange={(e) => onChange({ preparationTime: parseInt(e.target.value) })}
                className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                min="1"
                max="2"
              />
              <span className="text-sm text-gray-500">min</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Talk:</span>
              <input
                type="number"
                value={part.speakingTime}
                onChange={(e) => onChange({ speakingTime: parseInt(e.target.value) })}
                className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                min="1"
                max="3"
              />
              <span className="text-sm text-gray-500">min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cue Card Templates */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Cue Card Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {cueCardTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => handleLoadTemplate(template)}
              className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                {template.topic}
              </div>
              <div className="text-xs text-gray-500">
                {template.points.length} bullet points
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cue Card Editor */}
      <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="flex items-center mb-4">
          <FileText className="w-5 h-5 text-orange-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Cue Card</h3>
        </div>

        <div className="space-y-4">
          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic
            </label>
            <input
              type="text"
              value={part.cueCard.topic}
              onChange={(e) => handleCueCardChange('topic', e.target.value)}
              placeholder="e.g., Describe a person who has influenced you"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={part.cueCard.description}
              onChange={(e) => handleCueCardChange('description', e.target.value)}
              placeholder="You should say:"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Bullet Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bullet Points
            </label>
            <div className="space-y-2">
              {part.cueCard.points.map((point, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-orange-600 font-medium">•</span>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handlePointChange(index, e.target.value)}
                    placeholder={`Bullet point ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions
            </label>
            <textarea
              value={part.cueCard.instructions}
              onChange={(e) => handleCueCardChange('instructions', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              rows="2"
            />
          </div>
        </div>

        {/* Cue Card Preview */}
        <div className="mt-6 p-4 bg-white border border-orange-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Preview:</h4>
          <div className="text-sm">
            <div className="font-medium mb-2">{part.cueCard.topic || 'Topic will appear here'}</div>
            <div className="mb-2">{part.cueCard.description}</div>
            <ul className="space-y-1 mb-3">
              {part.cueCard.points.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span>{point || `Bullet point ${index + 1}`}</span>
                </li>
              ))}
            </ul>
            <div className="text-xs text-gray-600 italic">
              {part.cueCard.instructions}
            </div>
          </div>
        </div>
      </div>

      {/* Follow-up Questions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Follow-up Questions</h3>
          <button
            onClick={handleAddFollowUp}
            className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Question
          </button>
        </div>

        {/* Quick Templates */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Add Templates</h4>
          <div className="flex flex-wrap gap-2">
            {followUpTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => addTemplateQuestion(template)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {template}
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          {part.followUpQuestions?.map((question, index) => (
            <div key={question.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                
                <div className="flex-1 space-y-3">
                  {/* Question Text */}
                  <div>
                    {editingFollowUp === question.id ? (
                      <input
                        type="text"
                        value={question.text}
                        onChange={(e) => handleFollowUpChange(question.id, { text: e.target.value })}
                        onBlur={() => setEditingFollowUp(null)}
                        onKeyPress={(e) => e.key === 'Enter' && setEditingFollowUp(null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter follow-up question..."
                        autoFocus
                      />
                    ) : (
                      <div
                        onClick={() => setEditingFollowUp(question.id)}
                        className="cursor-text p-2 border border-transparent rounded hover:border-gray-300 hover:bg-white"
                      >
                        {question.text || 'Click to add follow-up question...'}
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
                          onChange={(e) => handleAudioUpload(question.id, e)}
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
                          onClick={() => handleFollowUpChange(question.id, { audioUrl: '', audioFile: null })}
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
                  onClick={() => handleDeleteFollowUp(question.id)}
                  className="flex-shrink-0 p-1 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {(!part.followUpQuestions || part.followUpQuestions.length === 0) && (
            <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm">No follow-up questions added yet</p>
              <p className="text-xs text-gray-400">Add 1-2 follow-up questions related to the cue card topic</p>
            </div>
          )}
        </div>
      </div>

      {/* Part 2 Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-green-900 mb-3">
          <Lightbulb className="w-4 h-4 inline mr-2" />
          Part 2 Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-green-800">
          <div>
            <strong>Cue Card Tips:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Use clear, specific topics</li>
              <li>• Include 4 bullet points</li>
              <li>• Make points guide the structure</li>
              <li>• Allow for personal experiences</li>
            </ul>
          </div>
          <div>
            <strong>Follow-up Questions:</strong>
            <ul className="mt-1 space-y-1">
              <li>• 1-2 questions maximum</li>
              <li>• Related to the cue card topic</li>
              <li>• Slightly more abstract</li>
              <li>• Bridge to Part 3 topics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakingPart2Editor; 