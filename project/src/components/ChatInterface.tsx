import React, { useState } from 'react';
import { Send, Bot, User, Mic } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { TeacherRequest, TeacherResponse } from '../types/api';

interface RelevantTopic {
  unit: string;
  topic: string;
  unit_number: number;
}

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  topics?: RelevantTopic[];
}

interface ChatInterfaceProps {
  onQuizGenerated: (quiz: any) => void;
  learningPreferences: {
    subject: string;
    topic: string;
    hobby: string;
  };
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onQuizGenerated, learningPreferences }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: "Welcome to your Physics Class! I'm your AI tutor for Maharashtra State Board 11th Grade Physics. Feel free to ask about any physics topic - I'll help you understand how it connects to your syllabus!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);



  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const request: TeacherRequest = {
        topic: learningPreferences.topic || "general",
        hobby: learningPreferences.hobby || "general",
        question: inputValue
      };

      const response = await fetch('http://localhost:3000/ask-teacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: TeacherResponse = await response.json();

      // Create AI response message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.reply,
        timestamp: new Date(),
        topics: data.relevant_topics
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Generate a contextual quiz if specific topics were discussed
      if (data.relevant_topics && data.relevant_topics.length > 0) {
        const topic = data.relevant_topics[0].topic;
        const quiz = {
          question: `Quick check on ${topic}:`,
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correct: 0,
          explanation: "Let's check your understanding of this concept"
        };
        onQuizGenerated(quiz);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice recognition logic would go here
    // For now, just toggle the visual state
  };
  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.type === 'ai' && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-3xl px-4 py-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-blue-400 text-white ml-auto shadow-md'
                  : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
              }`}
            >
              <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-900 prose-strong:text-gray-900 dark:prose-invert">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    // Override how code blocks are rendered
                    code: ({node, inline, className, children, ...props}) => {
                      if (inline) {
                        return <code className="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-600 rounded px-1 font-mono text-sm" {...props}>{children}</code>
                      }
                      return (
                        <pre className="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-600 rounded-lg p-4 overflow-x-auto shadow-inner">
                          <code className="font-mono text-sm" {...props}>{children}</code>
                        </pre>
                      )
                    },
                    // Override how links are rendered
                    a: ({node, children, ...props}) => (
                      <a className="text-blue-500 hover:text-blue-600" {...props}>{children}</a>
                    ),
                    // Override how lists are rendered
                    ul: ({node, children, ...props}) => (
                      <ul className="list-disc list-inside my-2" {...props}>{children}</ul>
                    ),
                    ol: ({node, children, ...props}) => (
                      <ol className="list-decimal list-inside my-2" {...props}>{children}</ol>
                    ),
                    // Override how headings are rendered
                    h1: ({node, children, ...props}) => (
                      <h1 className="text-2xl font-bold mt-6 mb-4" {...props}>{children}</h1>
                    ),
                    h2: ({node, children, ...props}) => (
                      <h2 className="text-xl font-bold mt-5 mb-3" {...props}>{children}</h2>
                    ),
                    h3: ({node, children, ...props}) => (
                      <h3 className="text-lg font-bold mt-4 mb-2" {...props}>{children}</h3>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
              <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {message.type === 'user' && (
              <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything you'd like to learn..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
            />
          </div>
          <button
            onClick={handleVoiceInput}
            className={`px-4 py-3 rounded-lg transition-colors flex items-center justify-center ${
              isListening 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {isListening && (
          <div className="mt-2 flex items-center space-x-2 text-sm text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Listening...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;