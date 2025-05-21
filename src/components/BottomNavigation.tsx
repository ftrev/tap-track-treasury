
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, List, BarChart, Settings, Plus } from 'lucide-react';

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const getNavItemClass = (path: string) => {
    const baseClass = "flex flex-col items-center py-1";
    return `${baseClass} ${currentPath === path ? 'text-finance-primary' : 'text-gray-500'}`;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-10">
      <button onClick={() => navigate('/')} className={getNavItemClass('/')}>
        <Home size={20} />
        <span className="text-xs mt-1">Home</span>
      </button>
      <button onClick={() => navigate('/transactions')} className={getNavItemClass('/transactions')}>
        <List size={20} />
        <span className="text-xs mt-1">Transações</span>
      </button>
      {/* Center Add Button (placeholder) */}
      <div className="invisible">
        <div className="flex flex-col items-center">
          <Plus size={20} />
          <span className="text-xs mt-1">Adicionar</span>
        </div>
      </div>
      <button onClick={() => navigate('/reports')} className={getNavItemClass('/reports')}>
        <BarChart size={20} />
        <span className="text-xs mt-1">Relatórios</span>
      </button>
      <button onClick={() => navigate('/settings')} className={getNavItemClass('/settings')}>
        <Settings size={20} />
        <span className="text-xs mt-1">Mais</span>
      </button>
    </div>
  );
}
