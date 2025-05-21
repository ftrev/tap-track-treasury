
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Budget, CategoryType } from '../types';
import { formatCurrency } from '../lib/utils';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

interface BudgetItemProps {
  budget: Budget;
  category: CategoryType;
  progress: number;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export const BudgetItem: React.FC<BudgetItemProps> = ({
  budget,
  category,
  progress,
  onEdit,
  onDelete
}) => {
  const getProgressColor = (percent: number) => {
    if (percent >= 100) return 'bg-red-500';
    if (percent >= 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-3 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{category.icon}</span>
          <span className="font-medium">{category.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(budget)}
            aria-label="Editar orçamento"
          >
            <Edit2 size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(budget.id)}
            aria-label="Excluir orçamento"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
      
      <div className="mb-2">
        <Progress 
          value={progress} 
          className="h-2"
          indicatorClassName={getProgressColor(progress)}
        />
      </div>
      
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>Gasto: {formatCurrency(budget.spent)}</span>
        <span>Total: {formatCurrency(budget.amount)}</span>
      </div>
    </div>
  );
};
