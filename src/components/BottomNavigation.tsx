
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, FileText, BarChart2, Settings, PieChart, Target, BarChart } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Início' },
    { path: '/transactions', icon: <FileText size={20} />, label: 'Transações' },
    { path: '/categories', icon: <PieChart size={20} />, label: 'Categorias' },
    { path: '/budgets', icon: <BarChart2 size={20} />, label: 'Orçamentos' },
    { path: '/goals', icon: <Target size={20} />, label: 'Metas' },
    { path: '/planning', icon: <BarChart size={20} />, label: 'Planejamento' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Ajustes' },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white dark:bg-gray-800 shadow-lg z-50 animate-fade-in">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center px-3 py-2 ${
              currentPath === item.path
                ? 'text-finance-primary'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
