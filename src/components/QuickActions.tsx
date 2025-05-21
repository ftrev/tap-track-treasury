
import React from 'react';

type QuickActionButtonProps = {
  label: string;
  icon: string;
  bgColor: string;
  onClick: () => void;
};

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ label, icon, bgColor, onClick }) => {
  return (
    <button 
      className="quick-action-button hover:bg-gray-100"
      onClick={onClick}
    >
      <div 
        className="w-10 h-10 rounded-full mb-1 flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-lg">{icon}</span>
      </div>
      <span className="text-xs text-finance-text">{label}</span>
    </button>
  );
};

type QuickActionsProps = {
  onAddExpense: () => void;
  onAddIncome: () => void;
  onAddTransfer: () => void;
};

export function QuickActions({ onAddExpense, onAddIncome, onAddTransfer }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-xl p-3 mb-4 shadow-sm">
      <div className="grid grid-cols-3 gap-2">
        <QuickActionButton 
          label="Despesa" 
          icon="💸" 
          bgColor="#FF7F50" 
          onClick={onAddExpense}
        />
        <QuickActionButton 
          label="Receita" 
          icon="💰" 
          bgColor="#42D392" 
          onClick={onAddIncome}
        />
        <QuickActionButton 
          label="Transferência" 
          icon="🔄" 
          bgColor="#1EBBD7" 
          onClick={onAddTransfer}
        />
      </div>
    </div>
  );
}
