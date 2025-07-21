import React from 'react';
import { Plus, Trash2, User, Calendar, MapPin, Phone, Mail, Hash } from 'lucide-react';

const FormCompletion = ({ content, onChange }) => {
  const { formFields = [{ label: '', answer: '', type: 'text' }], explanation = '' } = content;

  const handleFieldChange = (index, field, value) => {
    const newFields = [...formFields];
    newFields[index] = { ...newFields[index], [field]: value };
    onChange({ formFields: newFields });
  };

  const handleAddField = () => {
    if (formFields.length < 15) {
      onChange({ 
        formFields: [...formFields, { label: '', answer: '', type: 'text' }] 
      });
    }
  };

  const handleRemoveField = (index) => {
    if (formFields.length > 1) {
      const newFields = formFields.filter((_, i) => i !== index);
      onChange({ formFields: newFields });
    }
  };

  const handleExplanationChange = (value) => {
    onChange({ explanation: value });
  };

  const fieldTypes = [
    { value: 'text', label: 'Text', icon: User },
    { value: 'name', label: 'Name', icon: User },
    { value: 'date', label: 'Date', icon: Calendar },
    { value: 'address', label: 'Address', icon: MapPin },
    { value: 'phone', label: 'Phone', icon: Phone },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'number', label: 'Number', icon: Hash }
  ];

  const getFieldIcon = (type) => {
    const fieldType = fieldTypes.find(ft => ft.value === type);
    const IconComponent = fieldType?.icon || User;
    return <IconComponent className="w-4 h-4" />;
  };

  const getPlaceholderText = (type) => {
    const placeholders = {
      text: 'Enter text...',
      name: 'Full name',
      date: 'DD/MM/YYYY',
      address: 'Street address',
      phone: 'Phone number',
      email: 'Email address',
      number: 'Number'
    };
    return placeholders[type] || 'Enter value...';
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Instructions:</h4>
        <p className="text-sm text-blue-800">
          Students complete a form by filling in missing information while listening to the audio.
          This tests ability to identify specific details in a structured format.
        </p>
      </div>

      {/* Form Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Form Fields
        </label>
        <div className="space-y-4">
          {formFields.map((field, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900">Field {index + 1}</span>
                {formFields.length > 1 && (
                  <button
                    onClick={() => handleRemoveField(index)}
                    className="p-1 text-red-400 hover:text-red-600"
                    title="Remove field"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Field Label
                  </label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                    placeholder="e.g., First Name, Date of Birth"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Field Type
                  </label>
                  <select
                    value={field.type}
                    onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    {fieldTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Correct Answer
                  </label>
                  <input
                    type="text"
                    value={field.answer}
                    onChange={(e) => handleFieldChange(index, 'answer', e.target.value)}
                    placeholder="Correct answer (use | for alternatives)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {formFields.length < 15 && (
            <button
              onClick={handleAddField}
              className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Form Field
            </button>
          )}
        </div>
      </div>

      {/* Form Preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Form Preview:</h4>
        <div className="bg-white rounded-lg border border-gray-300 p-6 max-w-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Form</h3>
          <div className="space-y-4">
            {formFields.map((field, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 w-40">
                  {getFieldIcon(field.type)}
                  <label className="text-sm font-medium text-gray-700">
                    {field.label || `Field ${index + 1}`}:
                  </label>
                </div>
                <div className="flex-1">
                  <div className="border-b-2 border-gray-300 border-dashed h-8 flex items-center px-2">
                    <span className="text-xs text-gray-400">
                      {getPlaceholderText(field.type)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Answer Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-900 mb-3">Answer Key:</h4>
        <div className="space-y-2">
          {formFields.map((field, index) => (
            <div key={index} className="flex items-center justify-between text-sm text-green-800">
              <span className="font-medium">
                {field.label || `Field ${index + 1}`}:
              </span>
              <span>
                {field.answer || 'Not set'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Explanation (Optional)
        </label>
        <textarea
          value={explanation}
          onChange={(e) => handleExplanationChange(e.target.value)}
          placeholder="Explain where in the audio each piece of information can be found..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Guidelines:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Use realistic form fields that might appear in real applications</li>
          <li>• Information should be clearly stated in the audio</li>
          <li>• Use appropriate field types for different kinds of information</li>
          <li>• Include mix of personal details and specific information</li>
          <li>• Use | to separate acceptable alternative answers</li>
          <li>• Keep form logical and well-organized</li>
        </ul>
      </div>

      {/* Form Examples */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">Common Form Types:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-yellow-800">
          <div>
            <strong>Registration Form:</strong>
            <ul className="mt-1 space-y-1">
              <li>• First Name, Last Name</li>
              <li>• Date of Birth</li>
              <li>• Address, Phone</li>
              <li>• Email, Occupation</li>
            </ul>
          </div>
          <div>
            <strong>Booking Form:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Name, Contact Number</li>
              <li>• Date, Time</li>
              <li>• Number of People</li>
              <li>• Special Requirements</li>
            </ul>
          </div>
          <div>
            <strong>Application Form:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Personal Details</li>
              <li>• Education Background</li>
              <li>• Work Experience</li>
              <li>• References</li>
            </ul>
          </div>
          <div>
            <strong>Survey Form:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Age Group, Gender</li>
              <li>• Preferences</li>
              <li>• Frequency of Use</li>
              <li>• Satisfaction Rating</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCompletion; 