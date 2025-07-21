import React, { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignJustify,
  Type,
  FileText
} from 'lucide-react';

const ReadingPassageEditor = ({ passage, onChange }) => {
  const [activeFormats, setActiveFormats] = useState({});

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    setActiveFormats(prev => ({
      ...prev,
      [command]: !prev[command]
    }));
  };

  const handleContentChange = (e) => {
    onChange(e.target.innerHTML);
  };

  const formatButtons = [
    { command: 'bold', icon: Bold, label: 'Bold' },
    { command: 'italic', icon: Italic, label: 'Italic' },
    { command: 'underline', icon: Underline, label: 'Underline' },
    { command: 'insertUnorderedList', icon: List, label: 'Bullet List' },
    { command: 'insertOrderedList', icon: ListOrdered, label: 'Numbered List' },
    { command: 'justifyLeft', icon: AlignLeft, label: 'Align Left' },
    { command: 'justifyCenter', icon: AlignCenter, label: 'Align Center' },
    { command: 'justifyFull', icon: AlignJustify, label: 'Justify' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Reading Passage
        </h3>
        <div className="text-sm text-gray-500">
          Word count: {passage.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
        <div className="flex items-center space-x-1">
          {formatButtons.map(({ command, icon: Icon, label }) => (
            <button
              key={command}
              type="button"
              onClick={() => handleFormat(command)}
              className={`p-2 rounded hover:bg-gray-200 ${
                activeFormats[command] ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
              title={label}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
          
          <div className="w-px h-6 bg-gray-300 mx-2" />
          
          <select
            onChange={(e) => handleFormat('formatBlock', e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded"
            defaultValue=""
          >
            <option value="">Format</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="p">Paragraph</option>
          </select>

          <select
            onChange={(e) => handleFormat('fontSize', e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded"
            defaultValue="3"
          >
            <option value="1">Small</option>
            <option value="3">Normal</option>
            <option value="5">Large</option>
            <option value="7">Extra Large</option>
          </select>
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="border border-gray-200 rounded-lg">
        <div
          contentEditable
          className="min-h-[400px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onInput={handleContentChange}
          dangerouslySetInnerHTML={{ __html: passage }}
          style={{
            lineHeight: '1.6',
            fontSize: '16px'
          }}
        />
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Passage Guidelines:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Academic passages should be 700-900 words</li>
          <li>• General Training passages should be 500-700 words</li>
          <li>• Use clear paragraph breaks for better readability</li>
          <li>• Include topic sentences and supporting details</li>
          <li>• Ensure content is appropriate for IELTS level</li>
        </ul>
      </div>

      {/* Quick Templates */}
      <div className="space-y-2">
        <h4 className="font-medium text-gray-900">Quick Templates:</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onChange(`
              <h2>Academic Research Article</h2>
              <p>Recent studies in [field] have revealed significant findings that challenge conventional understanding...</p>
              <p>The methodology employed in this research involved...</p>
              <p>Results indicate that...</p>
              <p>These findings have important implications for...</p>
            `)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Academic Article
          </button>
          <button
            onClick={() => onChange(`
              <h2>General Information Text</h2>
              <p>In today's modern world, [topic] has become increasingly important...</p>
              <p>There are several key factors to consider:</p>
              <ul>
                <li>Factor one</li>
                <li>Factor two</li>
                <li>Factor three</li>
              </ul>
              <p>In conclusion...</p>
            `)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            General Info
          </button>
          <button
            onClick={() => onChange(`
              <h2>Historical Account</h2>
              <p>During the [time period], significant events shaped the course of [subject]...</p>
              <p>The timeline of events was as follows:</p>
              <p>Initially...</p>
              <p>Subsequently...</p>
              <p>Finally...</p>
              <p>The lasting impact of these events...</p>
            `)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Historical
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadingPassageEditor; 