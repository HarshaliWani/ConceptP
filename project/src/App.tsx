import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import QuizSection from './components/QuizSection';
import QuizzesTab from './components/QuizzesTab';
import FlashcardsTab from './components/FlashcardsTab';
import ProgressTab from './components/ProgressTab';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentQuiz, setCurrentQuiz] = useState(null);

  const handleQuizGenerated = (quiz: any) => {
    setCurrentQuiz(quiz);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main className="flex-1 flex flex-col lg:flex-row">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {activeSection === 'dashboard' && (
              <div className="flex-1 bg-white">
                <ChatInterface onQuizGenerated={handleQuizGenerated} />
              </div>
            )}
            {activeSection === 'quizzes' && (
              <div className="flex-1 bg-gray-50">
                <QuizzesTab />
              </div>
            )}
            {activeSection === 'flashcards' && (
              <div className="flex-1 bg-gray-50">
                <FlashcardsTab />
              </div>
            )}
            {activeSection === 'progress' && (
              <div className="flex-1 bg-gray-50">
                <ProgressTab />
              </div>
            )}
            {activeSection === 'profile' && (
              <div className="flex-1 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h2>
                  <p className="text-gray-600">Coming soon...</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Quiz Section */}
          {activeSection === 'dashboard' && (
            <div className="w-full lg:w-96 p-6 bg-gray-50 border-l border-gray-200">
              <QuizSection quiz={currentQuiz} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;