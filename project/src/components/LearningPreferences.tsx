import React, { useState } from 'react';

interface LearningPreferencesProps {
  onPreferencesSubmit: (preferences: {
    subject: string;
    topic: string;
    hobby: string;
  }) => void;
}

const LearningPreferences: React.FC<LearningPreferencesProps> = ({ onPreferencesSubmit }) => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [hobby, setHobby] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPreferencesSubmit({ subject, topic, hobby });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Learning Preferences</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Mathematics"
            required
          />
        </div>

        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
            Topic
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Algebra"
            required
          />
        </div>

        <div>
          <label htmlFor="hobby" className="block text-sm font-medium text-gray-700 mb-1">
            Hobby/Interest
          </label>
          <input
            type="text"
            id="hobby"
            value={hobby}
            onChange={(e) => setHobby(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Gaming"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Update Learning Style
        </button>
      </form>
    </div>
  );
};

export default LearningPreferences;