import React, { useState } from 'react';
import { 
  Clock, 
  Type, 
  MessageSquare, 
  Users, 
  AlertTriangle, 
  TrendingUp,
  FileText,
  Award,
  BookOpen,
  Target
} from 'lucide-react';

const WritingTask2Editor = ({ task, onChange }) => {
  const [showRubric, setShowRubric] = useState(false);

  const essayTypes = [
    { 
      value: 'opinion', 
      label: 'Opinion Essay', 
      icon: MessageSquare,
      description: 'Give your opinion on a topic',
      structure: 'Introduction → Your Opinion → Supporting Arguments → Conclusion',
      example: 'To what extent do you agree or disagree with this statement?'
    },
    { 
      value: 'discussion', 
      label: 'Discussion Essay', 
      icon: Users,
      description: 'Discuss both sides of an issue',
      structure: 'Introduction → Side A → Side B → Your Opinion → Conclusion',
      example: 'Discuss both views and give your own opinion.'
    },
    { 
      value: 'problem-solution', 
      label: 'Problem-Solution', 
      icon: AlertTriangle,
      description: 'Identify problems and suggest solutions',
      structure: 'Introduction → Problems → Solutions → Conclusion',
      example: 'What are the causes of this problem and what measures can be taken?'
    },
    { 
      value: 'advantage-disadvantage', 
      label: 'Advantages & Disadvantages', 
      icon: TrendingUp,
      description: 'Compare pros and cons',
      structure: 'Introduction → Advantages → Disadvantages → Conclusion',
      example: 'What are the advantages and disadvantages of this development?'
    }
  ];

  const testTypes = [
    { value: 'academic', label: 'Academic', description: 'Formal academic topics' },
    { value: 'general', label: 'General Training', description: 'General interest topics' }
  ];

  const promptTemplates = {
    opinion: [
      "Some people believe that [topic]. To what extent do you agree or disagree with this statement?",
      "It is often argued that [topic]. Do you agree or disagree?",
      "[Statement about topic]. What is your opinion on this matter?"
    ],
    discussion: [
      "Some people think [view A], while others believe [view B]. Discuss both views and give your own opinion.",
      "There are different opinions about [topic]. Discuss both sides and provide your perspective.",
      "[Topic] has both supporters and critics. Examine both viewpoints and state your position."
    ],
    'problem-solution': [
      "[Problem description]. What are the causes of this problem and what measures can be taken to solve it?",
      "Many countries face the problem of [issue]. What are the reasons for this and how can it be addressed?",
      "[Situation] is becoming a serious concern. What factors contribute to this problem and what solutions can you suggest?"
    ],
    'advantage-disadvantage': [
      "[Development/trend] is becoming increasingly common. What are the advantages and disadvantages of this trend?",
      "More and more people are [activity/behavior]. Do the benefits outweigh the drawbacks?",
      "[Topic] has both positive and negative aspects. Discuss the advantages and disadvantages."
    ]
  };

  const handleTemplateSelect = (template) => {
    onChange({ prompt: template });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Task Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Task 2</h2>
            <p className="text-gray-500 mt-1">Essay Writing</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={task.timeLimit}
                onChange={(e) => onChange({ timeLimit: parseInt(e.target.value) })}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                min="30"
                max="50"
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
                min="200"
                max="300"
              />
              <span className="text-sm text-gray-500">words</span>
            </div>
          </div>
        </div>
      </div>

      {/* Test Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Test Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          {testTypes.map((type) => (
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

      {/* Essay Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Essay Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {essayTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => onChange({ essayType: type.value })}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  task.essayType === type.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-gray-500 mt-1">{type.description}</div>
                    <div className="text-xs text-gray-400 mt-2">
                      Structure: {type.structure}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prompt Templates */}
      {task.essayType && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Prompt Templates
          </label>
          <div className="space-y-2">
            {promptTemplates[task.essayType]?.map((template, index) => (
              <button
                key={index}
                onClick={() => handleTemplateSelect(template)}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="text-sm text-gray-800">{template}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Task Prompt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Essay Prompt
        </label>
        <textarea
          value={task.prompt}
          onChange={(e) => onChange({ prompt: e.target.value })}
          placeholder="Enter the essay question or topic. Be clear about what students need to discuss, argue, or analyze."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="4"
        />
        
        {/* Essay Guidelines based on type */}
        {task.essayType && (
          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Target className="w-4 h-4 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {essayTypes.find(t => t.value === task.essayType)?.label} Guidelines
              </span>
            </div>
            <div className="text-xs text-gray-600">
              <div className="mb-1">
                <strong>Structure:</strong> {essayTypes.find(t => t.value === task.essayType)?.structure}
              </div>
              <div>
                <strong>Example Question:</strong> {essayTypes.find(t => t.value === task.essayType)?.example}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sample Answer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sample Answer (Optional)
        </label>
        <textarea
          value={task.sampleAnswer}
          onChange={(e) => onChange({ sampleAnswer: e.target.value })}
          placeholder="Provide a model essay for reference. Include clear introduction, body paragraphs with examples, and conclusion."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="12"
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
                  Task Response
                </label>
                <textarea
                  value={task.rubric.taskResponse}
                  onChange={(e) => onChange({ 
                    rubric: { ...task.rubric, taskResponse: e.target.value }
                  })}
                  placeholder="Criteria for task response (addressing the question, position, development of ideas)..."
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
                  placeholder="Criteria for coherence and cohesion (logical organization, linking words, paragraphing)..."
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
                  placeholder="Criteria for lexical resource (vocabulary range, accuracy, appropriateness)..."
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
                  placeholder="Criteria for grammatical range and accuracy (sentence variety, error frequency)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  rows="3"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Essay Writing Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="flex items-center text-sm font-medium text-green-900 mb-3">
          <BookOpen className="w-4 h-4 mr-2" />
          Task 2 Essay Writing Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-green-800">
          <div>
            <strong>Structure Tips:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Introduction: Paraphrase + Thesis statement</li>
              <li>• Body: 2-3 paragraphs with clear topic sentences</li>
              <li>• Conclusion: Summarize main points</li>
              <li>• Use linking words for coherence</li>
            </ul>
          </div>
          <div>
            <strong>Content Tips:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Answer all parts of the question</li>
              <li>• Support ideas with examples/evidence</li>
              <li>• Stay on topic throughout</li>
              <li>• Show critical thinking and analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingTask2Editor; 