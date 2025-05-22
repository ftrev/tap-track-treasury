
import React from 'react';
import { BottomNavigation } from './BottomNavigation';
import { useIsMobile } from '../hooks/use-mobile';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="max-w-md mx-auto pb-20">
      <div className="px-4 py-6">
        {title && (
          <h1 className="text-2xl font-bold mb-6 text-finance-text">{title}</h1>
        )}
        {children}
      </div>
      <BottomNavigation />
    </div>
  );
};
