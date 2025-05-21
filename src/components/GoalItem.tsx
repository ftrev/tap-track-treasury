import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { FinancialGoal, FinancialGoalStatus } from '../types';
import { formatCurrency } from '../lib/utils';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

interface GoalItemProps {
  goal: FinancialGoal;
  onEdit: (goal: FinancialGoal) => void;
  onDelete: (id: string) => void;
  onContribute: (goal: FinancialGoal) => void;
}

export const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  onEdit,
  onDelete,
  onContribute
}) => {
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  
  const getProgressColor = (percent: number) => {
    if (percent >= 100) return 'bg-emerald-500';
    if (percent >= 75) return 'bg-emerald-400';
    if (percent >= 50) return 'bg-amber-400';
    return 'bg-blue-500';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Sem data definida';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: FinancialGoalStatus) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">Completada</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">Cancelada</span>;
      default:
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Ativa</span>;
    }
  };

  const remainingAmount = goal.targetAmount - goal.currentAmount;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-4 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{goal.iconName}</span>
          <div>
            <h3 className="font-medium">{goal.name}</h3>
            <p className="text-xs text-gray-500">{formatDate(goal.targetDate)}</p>
          </div>
        </div>
        <div className="flex items-center">
          {getStatusBadge(goal.status)}
        </div>
      </div>
      
      <div className="mb-3">
        <Progress 
          value={progress} 
          className="h-2"
          indicatorClassName={getProgressColor(progress)}
        />
      </div>
      
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-3">
        <span>Guardado: {formatCurrency(goal.currentAmount)}</span>
        <span>Meta: {formatCurrency(goal.targetAmount)}</span>
      </div>
      
      {goal.status === 'active' && (
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-500">
            {remainingAmount > 0 
              ? `Falta ${formatCurrency(remainingAmount)}` 
              : 'Meta atingida!'}
          </span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(goal)}
              aria-label="Editar meta"
            >
              <Edit2 size={16} />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete(goal.id)}
              aria-label="Excluir meta"
            >
              <Trash2 size={16} />
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => onContribute(goal)}
              disabled={progress >= 100}
            >
              Contribuir
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
