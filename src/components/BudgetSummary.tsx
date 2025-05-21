
import React from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { formatCurrency } from '../lib/utils';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export function BudgetSummary() {
  const { getCurrentMonthBudgets, categories, getBudgetProgress } = useTransactions();
  const navigate = useNavigate();
  
  const currentMonthBudgets = getCurrentMonthBudgets();
  
  const getProgressColor = (percent: number) => {
    if (percent >= 100) return 'bg-red-500';
    if (percent >= 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getCategoryForBudget = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || {
      id: 'unknown',
      name: 'Categoria Desconhecida',
      icon: '❓',
      type: 'expense'
    };
  };

  return (
    <div className="bg-white rounded-2xl p-4 mb-4 shadow-md animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-medium text-finance-text">Orçamentos do mês</h2>
        <Button variant="link" size="sm" onClick={() => navigate('/budgets')}>
          Ver todos
        </Button>
      </div>
      
      {currentMonthBudgets.length > 0 ? (
        <div className="space-y-3">
          {currentMonthBudgets.slice(0, 3).map(budget => {
            const category = getCategoryForBudget(budget.categoryId);
            const progress = getBudgetProgress(budget);
            
            return (
              <div key={budget.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                  </span>
                </div>
                
                <Progress 
                  value={progress} 
                  className="h-1.5"
                  indicatorClassName={getProgressColor(progress)}
                />
              </div>
            );
          })}
          
          {currentMonthBudgets.length > 3 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2" 
              onClick={() => navigate('/budgets')}
            >
              Ver mais {currentMonthBudgets.length - 3} orçamentos
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col text-gray-500 py-6">
          <p className="text-sm mb-2">Nenhum orçamento definido para este mês</p>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => navigate('/budgets')}
          >
            Criar orçamento
          </Button>
        </div>
      )}
    </div>
  );
}
