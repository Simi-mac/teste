import React from 'react';

type NavView = 'journey' | 'diary' | 'chat';

interface SideNavProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  isExpanded: boolean;
  onToggle: () => void;
  onRestart: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ currentView, onNavigate, isExpanded, onToggle, onRestart }) => {
  const navItems = [
    { id: 'journey', label: 'Jornada', icon: '🗺️' },
    { id: 'diary', label: 'Diário', icon: '📓' },
    { id: 'chat', label: 'Educador AI', icon: '🤖' },
  ];

  return (
    <aside className={`fixed top-0 left-0 h-full bg-white border-r border-slate-200 shadow-md z-20 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
            <div className="p-4 flex items-center justify-center border-b border-slate-200" style={{ minHeight: '80px' }}>
                 <span className={`text-3xl font-bold text-blue-600 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>EducaFin</span>
            </div>
            
            <nav className="flex-grow mt-4">
                <ul>
                    {navItems.map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => onNavigate(item.id as NavView)}
                                className={`flex items-center w-full text-left p-4 my-1 transition-colors duration-200 ${
                                    currentView === item.id
                                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-600'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <span className="text-2xl min-w-[32px]">{item.icon}</span>
                                <span className={`ml-4 font-semibold transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-2">
                 <button
                    onClick={onRestart}
                    className="flex items-center w-full text-left p-4 my-1 transition-colors duration-200 text-slate-600 hover:bg-slate-100"
                    aria-label="Voltar ao início"
                >
                    <span className="text-2xl min-w-[32px]">↩️</span>
                    <span className={`ml-4 font-semibold transition-opacity duration-300 whitespace-nowrap ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Voltar ao Início</span>
                </button>
            </div>

            <div className="p-2 border-t border-slate-200">
                <button 
                    onClick={onToggle} 
                    className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                    aria-label={isExpanded ? "Recolher menu" : "Expandir menu"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
            </div>
        </div>
    </aside>
  );
};

export default SideNav;