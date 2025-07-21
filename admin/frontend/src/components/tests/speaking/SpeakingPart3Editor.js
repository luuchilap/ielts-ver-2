import React, { useState, useRef } from 'react';
import { 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  MessageSquare, 
  Upload,
  Brain,
  Lightbulb
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const SpeakingPart3Editor = ({ part, onChange }) => {
  const [editingTheme, setEditingTheme] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const audioInputRefs = useRef({});

  const abstractThemes = [
    {
      name: 'Technology and Society',
      questions: [
        "How has technology changed the way people communicate?",
        "Do you think technology has made people's lives better or worse?",
        "What role should technology play in education?",
        "How might technology develop in the future?"
      ]
    },
    {
      name: 'Education and Learning',
      questions: [
        "What makes a good teacher?",
        "Should education be free for everyone?",
        "How important is formal education compared to life experience?",
        "What changes would you like to see in the education system?"
      ]
    },
    {
      name: 'Work and Career',
      questions: [
        "How has the nature of work changed in recent years?",
        "What factors should people consider when choosing a career?",
        "Do you think work-life balance is important?",
        "How might working patterns change in the future?"
      ]
    }
  ];

  const handleThemeNameChange = (themeId, newName) => {
    const updatedThemes = part.themes.map(theme =>
      theme.id === themeId ? { ...theme, name: newName } : theme
    );
    onChange({ themes: updatedThemes });
    setEditingTheme(null);
  };

  const handleAddTheme = () => {
    const newTheme = {
      id: `theme-${Date.now()}`,
      name: 'New Abstract Theme',
      questions: []
    };
    onChange({ themes: [...part.themes, newTheme] });
  };

  const handleDeleteTheme = (themeId) => {
    const updatedThemes = part.themes.filter(theme => theme.id !== themeId);
    onChange({ themes: updatedThemes });
    toast.success('Theme deleted');
  };

  const handleAddQuestion = (themeId) => {
    const newQuestion = {
      id: `question-${Date.now()}`,
      text: '',
      audioUrl: '',
      audioFile: null
    };
    
    const updatedThemes = part.themes.map(theme =>
      theme.id === themeId 
        ? { ...theme, questions: [...(theme.questions || []), newQuestion] }
        : theme
    );
    onChange({ themes: updatedThemes });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Part Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Part 3: Discussion</h2>
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

      {/* Abstract Theme Templates */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Abstract Theme Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {abstractThemes.map((template) => (
            <button
              key={template.name}
              className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-2 mb-1">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">{template.name}</span>
              </div>
              <div className="text-xs text-gray-500">
                {template.questions.length} questions
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Themes */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Discussion Themes</h3>
          <button
            onClick={handleAddTheme}
            className="flex items-center px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Theme
          </button>
        </div>

        {part.themes.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No themes added yet</h3>
            <p className="text-gray-600 mb-4">
              Start by adding abstract themes or use the templates above
            </p>
          </div>
        )}
      </div>

      {/* Part 3 Tips */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-purple-900 mb-3">
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Part 3 Question Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-purple-800">
          <div>
            <strong>Question Characteristics:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Abstract and analytical</li>
              <li>• Related to Part 2 topic</li>
              <li>• Require extended responses</li>
              <li>• Test critical thinking</li>
            </ul>
          </div>
          <div>
            <strong>Best Practices:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Use varied question types</li>
              <li>• Progress from concrete to abstract</li>
              <li>• Allow for personal opinions</li>
              <li>• Aim for 4-6 questions total</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakingPart3Editor; 