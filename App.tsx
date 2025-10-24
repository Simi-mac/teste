import React, { useState, useEffect, useRef } from 'react';
import Questionnaire from './components/Questionnaire';
import Results from './components/Results';
import LoadingSpinner from './components/LoadingSpinner';
import InputField from './components/InputField';
import ChatBubble from './components/ChatBubble';
import TrackProgress from './components/TrackProgress';
import SideNav from './components/SideNav';
import Diary from './components/Diary';
import { getFinancialAdvice, generateOnboarding } from './services/geminiService';
import type { Message, Assessment, OnboardingData, Expense, ExpenseCategory, Feeling } from './types';

type AppStage = 'questionnaire' | 'results' | 'onboarding' | 'main_app';
type NavView = 'journey' | 'diary' | 'chat';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('questionnaire');
  const [navView, setNavView] = useState<NavView>('journey');
  const [isLoading, setIsLoading] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  // User & Onboarding State
  const [userName, setUserName] = useState('');
  const [userGoal, setUserGoal] = useState('');
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Diary State
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
        const savedExpenses = window.localStorage.getItem('expenses');
        return savedExpenses ? JSON.parse(savedExpenses).map((e: any) => ({...e, date: new Date(e.date)})) : [];
    } catch (error) {
        console.error("Failed to parse expenses from localStorage", error);
        return [];
    }
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    try {
        window.localStorage.setItem('expenses', JSON.stringify(expenses));
    } catch (error) {
        console.error("Failed to save expenses to localStorage", error);
    }
  }, [expenses]);

  const handleQuestionnaireComplete = async (
    completedAssessment: Assessment,
    name: string,
    goal: string
  ) => {
    setAssessment(completedAssessment);
    setUserName(name);
    setUserGoal(goal);
    setStage('results');
  };

  const handleProceedToOnboarding = async () => {
    if (!assessment) return;
    setIsLoading(true);
    try {
      const data = await generateOnboarding(assessment.score, userName, userGoal);
      setOnboardingData(data);
      setMessages([{ role: 'model', content: data.welcomeMessage }]);
      setStage('onboarding');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartApp = () => {
    setStage('main_app');
    setNavView('journey');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || isLoading) return;

    const newUserMessage: Message = { role: 'user', content: currentMessage };
    setMessages((prev) => [...prev, newUserMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await getFinancialAdvice(currentMessage);
      const newModelMessage: Message = { role: 'model', content: response };
      setMessages((prev) => [...prev, newModelMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'model',
        content: 'Desculpe, não consegui processar sua solicitação. Tente novamente mais tarde.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddExpense = (description: string, amount: number, category: ExpenseCategory, feeling: Feeling) => {
    const newExpense: Expense = {
        id: new Date().toISOString() + Math.random(),
        description,
        amount,
        category,
        feeling,
        date: new Date(),
    };
    setExpenses(prev => [...prev, newExpense]);
  };
  
  const handleRestart = () => {
    setStage('questionnaire');
    setNavView('journey');
    setIsLoading(false);
    setIsNavExpanded(false);
    setUserName('');
    setUserGoal('');
    setAssessment(null);
    setOnboardingData(null);
    setMessages([]);
    setCurrentMessage('');
    // Note: expenses are intentionally not cleared to preserve user data.
  };

  const renderInitialStages = () => {
    switch (stage) {
      case 'questionnaire':
        return <Questionnaire onComplete={handleQuestionnaireComplete} />;
      case 'results':
        return assessment ? (
          <Results assessment={assessment} onProceed={handleProceedToOnboarding} />
        ) : null;
      default: return null;
    }
  };

  const renderMainApp = () => (
    <div className="flex w-full">
      <SideNav 
        currentView={navView} 
        onNavigate={setNavView}
        isExpanded={isNavExpanded}
        onToggle={() => setIsNavExpanded(!isNavExpanded)}
        onRestart={handleRestart}
      />
      <main className={`flex-grow p-4 md:p-6 transition-all duration-300 ${isNavExpanded ? 'ml-64' : 'ml-20'}`}>
        {navView === 'journey' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Sua Jornada</h2>
            {onboardingData && <TrackProgress steps={onboardingData.trackSteps} />}
            <div className="mt-8 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <ChatBubble message={onboardingData?.welcomeMessage || 'Bem-vindo!'} role="model" />
            </div>
            {assessment && assessment.score <= 50 && expenses.length === 0 && (
                 <button
                      onClick={() => setNavView('diary')}
                      className="mt-8 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
                  >
                      Começar a Registrar Meus Gastos
                  </button>
            )}
            {stage === 'onboarding' && (
                 <button
                      onClick={handleStartApp}
                      className="mt-8 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                      Começar a Explorar
                  </button>
            )}
          </div>
        )}
        {navView === 'diary' && <Diary expenses={expenses} onAddExpense={handleAddExpense} />}
        {navView === 'chat' && (
          <div className="flex flex-col h-[calc(100vh-150px)]">
            <div className="flex-grow space-y-4 overflow-y-auto pr-2">
              {messages.map((msg, index) => (
                  <ChatBubble key={index} message={msg.content} role={msg.role} />
              ))}
              {isLoading && <ChatBubble message="..." role="model" />}
              <div ref={chatEndRef} />
            </div>
            <div className="mt-4 flex-shrink-0">
              <InputField
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onSubmit={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col items-center font-sans text-slate-900">
      <div className={`w-full ${stage === 'main_app' || stage === 'onboarding' ? '' : 'max-w-4xl mx-auto p-4 md:p-6'}`}>
        {stage !== 'main_app' && stage !== 'onboarding' && (
             <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-blue-600">EducaFin</h1>
                <p className="text-slate-600">Seu assistente pessoal para uma vida financeira mais saudável.</p>
            </header>
        )}
        {isLoading && (stage === 'results' || stage === 'onboarding') ? (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
                <LoadingSpinner />
                <p className="mt-4 text-slate-600">Gerando sua trilha personalizada...</p>
            </div>
        ) : (
            stage === 'main_app' || stage === 'onboarding' ? renderMainApp() : renderInitialStages()
        )}
      </div>
    </div>
  );
};

export default App;