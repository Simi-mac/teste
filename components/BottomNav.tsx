import React from 'react';

type NavView = 'journey' | 'diary' | 'chat';

interface BottomNavProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'journey', label: 'Jornada', icon: '🗺️' },
    { id: 'diary', label: 'Diário', icon: '📓' },
    { id: 'chat', label: 'Educador AI', icon: '🤖' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-t-md z-10">
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as NavView)}
            className={`flex flex-col items-center justify-center w-full py-2 px-1 text-sm transition-colors duration-200 ${
              currentView === item.id
                ? 'text-blue-600'
                : 'text-slate-500 hover:text-blue-500'
            }`}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
