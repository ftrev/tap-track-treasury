
import React from 'react';
import { BottomNavigation } from './BottomNavigation';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
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
