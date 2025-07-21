import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Play, 
  Pause, 
  Volume2, 
  FileAudio, 
  Trash2,
  Clock,
  Download,
  FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ListeningAudioManager = ({ section, onChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid audio file (MP3, WAV, OGG, M4A)');
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 50MB');
      return;
    }

    // Create object URL for preview
    const audioUrl = URL.createObjectURL(file);
    
    onChange({
      audioFile: file,
      audioUrl: audioUrl
    });

    toast.success('Audio file uploaded successfully!');
  };

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTranscriptChange = (value) => {
    onChange({ transcript: value });
  };

  const handleRemoveAudio = () => {
    if (section.audioUrl) {
      URL.revokeObjectURL(section.audioUrl);
    }
    onChange({
      audioFile: null,
      audioUrl: '',
      transcript: ''
    });
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    toast.success('Audio file removed');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Volume2 className="w-5 h-5 mr-2" />
          Audio File
        </h3>
        {section.audioUrl && (
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <FileText className="w-4 h-4 mr-1" />
            {showTranscript ? 'Hide' : 'Show'} Transcript
          </button>
        )}
      </div>

      {/* Audio Upload */}
      {!section.audioUrl ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
          <div className="text-center">
            <FileAudio className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Audio File</h4>
            <p className="text-gray-600 mb-4">
              Drag and drop an audio file here, or click to browse
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: MP3, WAV, OGG, M4A (Max 50MB)
            </p>
          </div>
        </div>
      ) : (
        /* Audio Player */
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileAudio className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">
                  {section.audioFile?.name || 'Audio File'}
                </p>
                <p className="text-sm text-gray-500">
                  {section.audioFile && `${(section.audioFile.size / 1024 / 1024).toFixed(1)} MB`}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveAudio}
              className="p-2 text-red-400 hover:text-red-600"
              title="Remove audio file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Audio Element */}
          <audio
            ref={audioRef}
            src={section.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />

          {/* Player Controls */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlay}
                className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div 
                  className="w-full h-2 bg-gray-200 rounded-full cursor-pointer"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            </div>

            {/* Audio Info */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded p-3">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  Duration
                </div>
                <div className="font-medium">{formatTime(duration)}</div>
              </div>
              <div className="bg-white rounded p-3">
                <div className="flex items-center text-gray-600">
                  <FileAudio className="w-4 h-4 mr-1" />
                  Format
                </div>
                <div className="font-medium">
                  {section.audioFile?.type?.split('/')[1]?.toUpperCase() || 'Unknown'}
                </div>
              </div>
              <div className="bg-white rounded p-3">
                <div className="flex items-center text-gray-600">
                  <Download className="w-4 h-4 mr-1" />
                  Size
                </div>
                <div className="font-medium">
                  {section.audioFile && `${(section.audioFile.size / 1024 / 1024).toFixed(1)} MB`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transcript Editor */}
      {section.audioUrl && showTranscript && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Transcript (Optional)</h4>
          <textarea
            value={section.transcript}
            onChange={(e) => handleTranscriptChange(e.target.value)}
            placeholder="Enter the transcript of the audio file here. This will help with question creation and can be used for accessibility..."
            className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h5 className="text-sm font-medium text-blue-900 mb-1">Transcript Tips:</h5>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Include speaker labels (A:, B:) for conversations</li>
              <li>• Mark unclear words with [unclear] or [inaudible]</li>
              <li>• Use timestamps for long recordings (e.g., [2:30])</li>
              <li>• Include pauses and emphasis where relevant</li>
              <li>• This helps create accurate questions and answers</li>
            </ul>
          </div>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">Audio Guidelines:</h4>
        <ul className="text-xs text-yellow-800 space-y-1">
          <li>• <strong>Section 1:</strong> Conversation (2 people) - everyday social context</li>
          <li>• <strong>Section 2:</strong> Monologue - everyday social context (e.g., speech about facilities)</li>
          <li>• <strong>Section 3:</strong> Conversation (2-4 people) - educational/training context</li>
          <li>• <strong>Section 4:</strong> Monologue - academic subject (e.g., university lecture)</li>
          <li>• Audio should be clear with natural pace and pronunciation</li>
          <li>• Include variety of accents (British, American, Australian, etc.)</li>
        </ul>
      </div>
    </div>
  );
};

export default ListeningAudioManager; 