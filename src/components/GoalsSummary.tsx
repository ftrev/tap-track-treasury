
import React from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { formatCurrency } from '../lib/utils';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export function GoalsSummary() {
  const { financialGoals } = useTransactions();
  const navigate = useNavigate();
  
  const activeGoals = financialGoals.filter(g => g.status === 'active');
  
  const getProgressColor = (percent: number) => {
    if (percent >= 100) return 'bg-emerald-500';
    if (percent >= 75) return 'bg-emerald-400';
    if (percent >= 50) return 'bg-amber-400';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-white rounded-2xl p-4 mb-4 shadow-md animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-medium text-finance-text">Minhas Metas</h2>
        <Button variant="link" size="sm" onClick={() => navigate('/goals')}>
          Ver todas
        </Button>
      </div>
      
      {activeGoals.length > 0 ? (
        <div className="space-y-3">
          {activeGoals.slice(0, 3).map(goal => {
            const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            
            return (
              <div key={goal.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>{goal.iconName}</span>
                    <span className="text-sm font-medium">{goal.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {Math.round(progress)}%
                  </span>
                </div>
                
                <Progress 
                  value={progress} 
                  className="h-1.5"
                  indicatorClassName={getProgressColor(progress)}
                />
                
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>{formatCurrency(goal.currentAmount)}</span>
                  <span>{formatCurrency(goal.targetAmount)}</span>
                </div>
              </div>
            );
          })}
          
          {activeGoals.length > 3 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2" 
              onClick={() => navigate('/goals')}
            >
              Ver mais {activeGoals.length - 3} metas
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col text-gray-500 py-6">
          <p className="text-sm mb-2">Você ainda não criou nenhuma meta</p>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => navigate('/goals')}
          >
            Criar meta
          </Button>
        </div>
      )}
    </div>
  );
}
