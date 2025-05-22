
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, FileText, PieChart, BarChart2, Settings, MoreHorizontal, BarChart, Target } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // All navigation items
  const allNavItems = [
    { path: '/', icon: <Home size={20} />, label: 'Início' },
    { path: '/transactions', icon: <FileText size={20} />, label: 'Transações' },
    { path: '/categories', icon: <PieChart size={20} />, label: 'Categorias' },
    { path: '/budgets', icon: <BarChart2 size={20} />, label: 'Orçamentos' },
    { path: '/goals', icon: <Target size={20} />, label: 'Metas' },
    { path: '/planning', icon: <BarChart size={20} />, label: 'Planejamento' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Ajustes' },
  ];

  // Main items to always show in the bottom navigation
  const mainNavItems = allNavItems.slice(0, isMobile ? 4 : allNavItems.length);
  
  // Secondary items to show in the drawer/sheet
  const secondaryNavItems = isMobile ? allNavItems.slice(4) : [];

  // Navigation item component
  const NavItem = ({ item, onClick = () => {} }) => (
    <Link
      to={item.path}
      className={`flex flex-col items-center px-3 py-2 ${
        currentPath === item.path
          ? 'text-finance-primary'
          : 'text-gray-500 dark:text-gray-400'
      }`}
      onClick={onClick}
    >
      {item.icon}
      <span className="text-xs mt-1">{item.label}</span>
    </Link>
  );

  // Component to render navigation items in a list (for the drawer/sheet)
  const NavItemsList = ({ items, onClick = () => {} }) => (
    <div className="flex flex-col space-y-2 p-4">
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center space-x-3 rounded-md p-3 ${
            currentPath === item.path
              ? 'bg-finance-primary/10 text-finance-primary'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          onClick={onClick}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );

  // Conditional rendering of the "More" menu based on device type
  const MoreMenu = isMobile ? (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <button 
          className="flex flex-col items-center px-3 py-2 text-gray-500 dark:text-gray-400"
          aria-label="Mais opções"
        >
          <MoreHorizontal size={20} />
          <span className="text-xs mt-1">Mais</span>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Menu de Navegação</DrawerTitle>
        </DrawerHeader>
        <NavItemsList 
          items={secondaryNavItems} 
          onClick={() => setIsDrawerOpen(false)} 
        />
      </DrawerContent>
    </Drawer>
  ) : null;

  return (
    <nav className="fixed bottom-0 w-full bg-white dark:bg-gray-800 shadow-lg z-50 animate-fade-in">
      <div className="flex justify-around items-center py-2">
        {mainNavItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
        {isMobile && secondaryNavItems.length > 0 && MoreMenu}
      </div>
    </nav>
  );
};
