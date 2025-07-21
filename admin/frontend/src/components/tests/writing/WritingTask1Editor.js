import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image, 
  Trash2, 
  Clock, 
  Type, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Table,
  MapPin,
  Workflow,
  FileText,
  Award
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const WritingTask1Editor = ({ task, onChange }) => {
  const [showRubric, setShowRubric] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Create object URL for preview
    const imageUrl = URL.createObjectURL(file);
    
    onChange({
      imageFile: file,
      imageUrl: imageUrl
    });

    toast.success('Image uploaded successfully!');
  };

  const handleRemoveImage = () => {
    if (task.imageUrl) {
      URL.revokeObjectURL(task.imageUrl);
    }
    onChange({
      imageFile: null,
      imageUrl: ''
    });
    toast.success('Image removed');
  };

  const chartTypes = [
    { value: 'line', label: 'Line Chart', icon: TrendingUp, description: 'Shows trends over time' },
    { value: 'bar', label: 'Bar Chart', icon: BarChart3, description: 'Compares different categories' },
    { value: 'pie', label: 'Pie Chart', icon: PieChart, description: 'Shows proportions of a whole' },
    { value: 'table', label: 'Table', icon: Table, description: 'Displays data in rows and columns' },
    { value: 'process', label: 'Process Diagram', icon: Workflow, description: 'Shows steps in a process' },
    { value: 'map', label: 'Map/Layout', icon: MapPin, description: 'Shows geographical information' }
  ];

  const essayTypes = [
    { value: 'academic', label: 'Academic', description: 'Charts, graphs, tables, diagrams' },
    { value: 'general', label: 'General Training', description: 'Letters (formal, semi-formal, informal)' }
  ];

  const letterTypes = [
    { value: 'formal', label: 'Formal Letter', description: 'To unknown person, official purpose' },
    { value: 'semi-formal', label: 'Semi-formal Letter', description: 'To known person, polite tone' },
    { value: 'informal', label: 'Informal Letter', description: 'To friend/family, casual tone' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Task Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Task 1</h2>
            <p className="text-gray-500 mt-1">
              {task.type === 'academic' ? 'Describe visual information' : 'Write a letter'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={task.timeLimit}
                onChange={(e) => onChange({ timeLimit: parseInt(e.target.value) })}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                min="15"
                max="30"
              />
              <span className="text-sm text-gray-500">min</span>
            </div>
            <div className="flex items-center space-x-2">
              <Type className="w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={task.minWords}
                onChange={(e) => onChange({ minWords: parseInt(e.target.value) })}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                min="100"
                max="200"
              />
              <span className="text-sm text-gray-500">words</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Task Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          {essayTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onChange({ type: type.value })}
              className={`p-4 border rounded-lg text-left transition-colors ${
                task.type === type.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{type.label}</div>
              <div className="text-sm text-gray-500 mt-1">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Academic Task - Chart/Image Upload */}
      {task.type === 'academic' && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Chart/Graph/Diagram
          </label>
          
          {/* Chart Type Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Chart Type (Optional)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {chartTypes.map((chart) => {
                const IconComponent = chart.icon;
                return (
                  <button
                    key={chart.value}
                    onClick={() => onChange({ chartType: chart.value })}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      task.chartType === chart.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">{chart.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Upload */}
          {!task.imageUrl ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Chart/Graph</h4>
                <p className="text-gray-600 mb-4">
                  Upload an image of the chart, graph, table, or diagram
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: JPEG, PNG, GIF, WebP (Max 10MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-gray-900">Uploaded Image</h4>
                <button
                  onClick={handleRemoveImage}
                  className="p-1 text-red-400 hover:text-red-600"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <img
                src={task.imageUrl}
                alt="Chart/Graph"
                className="max-w-full h-auto rounded border border-gray-200"
                style={{ maxHeight: '400px' }}
              />
              {task.chartType && (
                <div className="mt-2 text-sm text-gray-600">
                  Chart Type: {chartTypes.find(c => c.value === task.chartType)?.label}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* General Training - Letter Type */}
      {task.type === 'general' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Letter Type
          </label>
          <div className="space-y-3">
            {letterTypes.map((letter) => (
              <button
                key={letter.value}
                onClick={() => onChange({ letterType: letter.value })}
                className={`w-full p-3 border rounded-lg text-left transition-colors ${
                  task.letterType === letter.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{letter.label}</div>
                <div className="text-sm text-gray-500 mt-1">{letter.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Task Prompt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Prompt
        </label>
        <textarea
          value={task.prompt}
          onChange={(e) => onChange({ prompt: e.target.value })}
          placeholder={
            task.type === 'academic'
              ? "Enter the task prompt. Example: 'The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.'"
              : "Enter the letter writing prompt. Example: 'You recently bought a piece of equipment for your kitchen but it did not work. You phoned the shop but no action was taken. Write a letter to the shop manager.'"
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="4"
        />
      </div>

      {/* Sample Answer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sample Answer (Optional)
        </label>
        <textarea
          value={task.sampleAnswer}
          onChange={(e) => onChange({ sampleAnswer: e.target.value })}
          placeholder="Provide a model answer for reference..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="8"
        />
        <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
          <span>Word count: {task.sampleAnswer.split(/\s+/).filter(word => word.length > 0).length}</span>
          <span>Target: {task.minWords}+ words</span>
        </div>
      </div>

      {/* Rubric Section */}
      <div>
        <button
          onClick={() => setShowRubric(!showRubric)}
          className="flex items-center justify-between w-full p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
        >
          <div className="flex items-center">
            <Award className="w-5 h-5 text-gray-600 mr-2" />
            <span className="font-medium text-gray-900">Assessment Rubric</span>
          </div>
          <span className="text-gray-500">
            {showRubric ? 'Hide' : 'Show'}
          </span>
        </button>

        {showRubric && (
          <div className="mt-4 space-y-4 border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Achievement
                </label>
                <textarea
                  value={task.rubric.taskAchievement}
                  onChange={(e) => onChange({ 
                    rubric: { ...task.rubric, taskAchievement: e.target.value }
                  })}
                  placeholder="Criteria for task achievement..."
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coherence and Cohesion
                </label>
                <textarea
                  value={task.rubric.coherenceCohesion}
                  onChange={(e) => onChange({ 
                    rubric: { ...task.rubric, coherenceCohesion: e.target.value }
                  })}
                  placeholder="Criteria for coherence and cohesion..."
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lexical Resource
                </label>
                <textarea
                  value={task.rubric.lexicalResource}
                  onChange={(e) => onChange({ 
                    rubric: { ...task.rubric, lexicalResource: e.target.value }
                  })}
                  placeholder="Criteria for lexical resource..."
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grammatical Range and Accuracy
                </label>
                <textarea
                  value={task.rubric.grammaticalRange}
                  onChange={(e) => onChange({ 
                    rubric: { ...task.rubric, grammaticalRange: e.target.value }
                  })}
                  placeholder="Criteria for grammatical range..."
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  rows="3"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingTask1Editor; 