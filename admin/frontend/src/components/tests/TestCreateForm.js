import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { 
  Save, 
  ArrowLeft, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic,
  Plus,
  Clock,
  AlertCircle
} from 'lucide-react';
import { testsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const TestCreateForm = () => {
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState({
    reading: false,
    listening: false,
    writing: false,
    speaking: false
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'intermediate',
      totalTime: 180,
      tags: [],
      status: 'draft'
    }
  });

  // Create test mutation
  const createTestMutation = useMutation(testsAPI.create, {
    onSuccess: (response) => {
      toast.success('Test created successfully!');
      navigate(`/tests/${response.data.data.test._id}/edit`);
    },
    onError: (error) => {
      toast.error('Failed to create test');
    }
  });

  const onSubmit = async (data) => {
    // Validate at least one skill is selected
    const hasSkills = Object.values(selectedSkills).some(Boolean);
    if (!hasSkills) {
      toast.error('Please select at least one skill');
      return;
    }

    // Prepare test data
    const testData = {
      ...data,
      tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      reading: selectedSkills.reading ? { sections: [], totalTime: 60 } : { sections: [], totalTime: 0 },
      listening: selectedSkills.listening ? { sections: [], totalTime: 40 } : { sections: [], totalTime: 0 },
      writing: selectedSkills.writing ? { tasks: [], totalTime: 60 } : { tasks: [], totalTime: 0 },
      speaking: selectedSkills.speaking ? { parts: [], totalTime: 15 } : { parts: [], totalTime: 0 }
    };

    createTestMutation.mutate(testData);
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => ({
      ...prev,
      [skill]: !prev[skill]
    }));
  };

  const skillsConfig = [
    {
      key: 'reading',
      name: 'Reading',
      icon: BookOpen,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 border-blue-200',
      description: 'Text comprehension and analysis',
      defaultTime: 60
    },
    {
      key: 'listening',
      name: 'Listening',
      icon: Headphones,
      color: 'text-green-500',
      bgColor: 'bg-green-50 border-green-200',
      description: 'Audio comprehension and note-taking',
      defaultTime: 40
    },
    {
      key: 'writing',
      name: 'Writing',
      icon: PenTool,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 border-yellow-200',
      description: 'Essay writing and task completion',
      defaultTime: 60
    },
    {
      key: 'speaking',
      name: 'Speaking',
      icon: Mic,
      color: 'text-red-500',
      bgColor: 'bg-red-50 border-red-200',
      description: 'Oral communication and fluency',
      defaultTime: 15
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Create New Test</h1>
          <p className="text-secondary-600">
            Set up a new IELTS test with your preferred skills and configuration
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Basic Information</h2>
            <p className="card-description">
              Provide basic details about your test
            </p>
          </div>
          <div className="card-content space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Test Title *
              </label>
              <input
                type="text"
                className={`input ${errors.title ? 'input-error' : ''}`}
                placeholder="Enter test title (e.g., IELTS Academic Practice Test #1)"
                {...register('title', {
                  required: 'Test title is required',
                  minLength: {
                    value: 3,
                    message: 'Title must be at least 3 characters'
                  }
                })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-error-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                className={`input ${errors.description ? 'input-error' : ''}`}
                placeholder="Describe what this test covers..."
                {...register('description', {
                  maxLength: {
                    value: 1000,
                    message: 'Description must not exceed 1000 characters'
                  }
                })}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
              )}
            </div>

            {/* Difficulty & Total Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Difficulty Level
                </label>
                <select
                  className="input"
                  {...register('difficulty')}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Total Time (minutes)
                </label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  className={`input ${errors.totalTime ? 'input-error' : ''}`}
                  {...register('totalTime', {
                    required: 'Total time is required',
                    min: {
                      value: 30,
                      message: 'Minimum time is 30 minutes'
                    },
                    max: {
                      value: 300,
                      message: 'Maximum time is 300 minutes'
                    }
                  })}
                />
                {errors.totalTime && (
                  <p className="mt-1 text-sm text-error-600">{errors.totalTime.message}</p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                className="input"
                placeholder="Enter tags separated by commas (e.g., academic, practice, beginner)"
                {...register('tags')}
              />
              <p className="mt-1 text-sm text-secondary-500">
                Separate multiple tags with commas
              </p>
            </div>
          </div>
        </div>

        {/* Skills Selection */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Skills Selection</h2>
            <p className="card-description">
              Choose which skills to include in this test
            </p>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillsConfig.map((skill) => {
                const Icon = skill.icon;
                const isSelected = selectedSkills[skill.key];
                
                return (
                  <div
                    key={skill.key}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected 
                        ? `${skill.bgColor} border-opacity-100` 
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}
                    onClick={() => handleSkillToggle(skill.key)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-white' : 'bg-secondary-50'}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? skill.color : 'text-secondary-400'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-secondary-900">{skill.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-secondary-500">
                            <Clock className="w-4 h-4" />
                            {skill.defaultTime}min
                          </div>
                        </div>
                        <p className="text-sm text-secondary-600 mt-1">
                          {skill.description}
                        </p>
                        {isSelected && (
                          <div className="mt-2 text-sm text-success-600 font-medium">
                            ✓ Selected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {!Object.values(selectedSkills).some(Boolean) && (
              <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-md">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-warning-600" />
                  <p className="text-sm text-warning-700">
                    Please select at least one skill to continue
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Test Status */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Test Status</h2>
            <p className="card-description">
              Set the initial status for this test
            </p>
          </div>
          <div className="card-content">
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="draft"
                  className="text-primary-600"
                  {...register('status')}
                />
                <span className="text-sm font-medium text-secondary-700">Draft</span>
                <span className="text-sm text-secondary-500">- Save as draft for later editing</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="published"
                  className="text-primary-600"
                  {...register('status')}
                />
                <span className="text-sm font-medium text-secondary-700">Published</span>
                <span className="text-sm text-secondary-500">- Make immediately available</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-secondary-200">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-outline btn-md"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={createTestMutation.isLoading}
            className="btn btn-primary btn-md"
          >
            {createTestMutation.isLoading ? (
              <div className="flex items-center">
                <div className="loading-spinner mr-2"></div>
                Creating...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Create Test
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestCreateForm; 