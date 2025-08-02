import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';
import toast from 'react-hot-toast';

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

const ProfilePage: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        targetScore: user.targetScore || 7,
        level: user.level || 'Beginner'
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'targetScore' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setValidationErrors([]);
    
    try {
      // Clean the form data - remove empty strings and convert them to undefined
      const cleanedData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value === '' || value === null) {
          acc[key] = undefined;
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      await updateProfile(cleanedData);
      setIsEditing(false);
      setValidationErrors([]);
    } catch (error: any) {
      console.error('Profile update failed:', error);
      
      // Handle validation errors from the backend
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        setValidationErrors(error.response.data.errors);
        toast.error('Please fix the validation errors below');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        targetScore: user.targetScore || 7,
        level: user.level || 'Beginner'
      });
    }
    setIsEditing(false);
    setValidationErrors([]);
  };

  // Helper function to get validation error for a specific field
  const getFieldError = (fieldName: string): string | undefined => {
    const error = validationErrors.find(err => err.field === fieldName);
    return error?.message;
  };

  // Helper function to check if a field has an error
  const hasFieldError = (fieldName: string): boolean => {
    return validationErrors.some(err => err.field === fieldName);
  };

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-red-600">Unable to load user profile. Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            {/* Validation Errors Summary */}
            {validationErrors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Please fix the following errors:
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {validationErrors.map((error, index) => (
                          <li key={index}>
                            <strong>{error.field}:</strong> {error.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName || ''}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          hasFieldError('firstName') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        required
                      />
                      {getFieldError('firstName') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('firstName')}</p>
                      )}
                    </div>
                  ) : (
                    <p className="px-3 py-2 text-gray-900">{user.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName || ''}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          hasFieldError('lastName') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        required
                      />
                      {getFieldError('lastName') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('lastName')}</p>
                      )}
                    </div>
                  ) : (
                    <p className="px-3 py-2 text-gray-900">{user.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <p className="px-3 py-2 text-gray-900 bg-gray-50 rounded-lg">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          hasFieldError('phone') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="e.g., +1234567890"
                      />
                      {getFieldError('phone') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">Include country code (e.g., +1234567890)</p>
                    </div>
                  ) : (
                    <p className="px-3 py-2 text-gray-900">{user.phone || 'Not provided'}</p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country || ''}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          hasFieldError('country') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {getFieldError('country') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('country')}</p>
                      )}
                    </div>
                  ) : (
                    <p className="px-3 py-2 text-gray-900">{user.country || 'Not provided'}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth || ''}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          hasFieldError('dateOfBirth') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        max={new Date().toISOString().split('T')[0]}
                      />
                      {getFieldError('dateOfBirth') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('dateOfBirth')}</p>
                      )}
                    </div>
                  ) : (
                    <p className="px-3 py-2 text-gray-900">
                      {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </p>
                  )}
                </div>

                {/* Target Score */}
                <div>
                  <label htmlFor="targetScore" className="block text-sm font-medium text-gray-700 mb-2">
                    Target IELTS Score
                  </label>
                  {isEditing ? (
                    <div>
                      <select
                        id="targetScore"
                        name="targetScore"
                        value={formData.targetScore || 7}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          hasFieldError('targetScore') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      >
                        {[4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map(score => (
                          <option key={score} value={score}>{score}</option>
                        ))}
                      </select>
                      {getFieldError('targetScore') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('targetScore')}</p>
                      )}
                    </div>
                  ) : (
                    <p className="px-3 py-2 text-gray-900">{user.targetScore || 'Not set'}</p>
                  )}
                </div>

                {/* Level */}
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Level
                  </label>
                  {isEditing ? (
                    <div>
                      <select
                        id="level"
                        name="level"
                        value={formData.level || 'Beginner'}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          hasFieldError('level') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                      {getFieldError('level') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('level')}</p>
                      )}
                    </div>
                  ) : (
                    <p className="px-3 py-2 text-gray-900">{user.level || 'Beginner'}</p>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <p className="px-3 py-2 text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Updated
                    </label>
                    <p className="px-3 py-2 text-gray-900">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
