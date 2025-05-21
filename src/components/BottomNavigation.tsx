
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BarChart2, Settings, Wallet, Tags } from 'lucide-react';

export const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getNavItemClass = (path: string) => {
    const baseClass = "flex flex-1 flex-col items-center justify-center py-2 text-xs font-medium";
    return `${baseClass} ${currentPath === path ? 'text-finance-primary' : 'text-gray-500'}`;
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-10 bg-white border-t border-gray-200 dark:border-gray-800 dark:bg-gray-950 shadow-lg">
      <div className="flex h-16 max-w-md mx-auto">
        <NavLink to="/" className={getNavItemClass('/')}>
          <Home strokeWidth={1.5} className="h-6 w-6 mb-1" />
          <span>Início</span>
        </NavLink>
        
        <NavLink to="/transactions" className={getNavItemClass('/transactions')}>
          <Wallet strokeWidth={1.5} className="h-6 w-6 mb-1" />
          <span>Transações</span>
        </NavLink>

        <NavLink to="/categories" className={getNavItemClass('/categories')}>
          <Tags strokeWidth={1.5} className="h-6 w-6 mb-1" />
          <span>Categorias</span>
        </NavLink>
        
        <NavLink to="/reports" className={getNavItemClass('/reports')}>
          <BarChart2 strokeWidth={1.5} className="h-6 w-6 mb-1" />
          <span>Relatórios</span>
        </NavLink>
        
        <NavLink to="/settings" className={getNavItemClass('/settings')}>
          <Settings strokeWidth={1.5} className="h-6 w-6 mb-1" />
          <span>Ajustes</span>
        </NavLink>
      </div>
    </div>
  );
};
