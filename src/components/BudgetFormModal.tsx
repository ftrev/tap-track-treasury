
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Budget, CategoryType } from '../types';
import { useTransactions } from '../contexts/TransactionContext';

interface BudgetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetToEdit?: Budget;
}

export const BudgetFormModal: React.FC<BudgetFormModalProps> = ({ 
  isOpen, 
  onClose,
  budgetToEdit
}) => {
  const { categories, addBudget, updateBudget, getBudgetByCategoryId } = useTransactions();
  const expenseCategories = categories.filter(c => c.type === 'expense');
  
  const [amount, setAmount] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (budgetToEdit) {
        setAmount(budgetToEdit.amount.toString());
        setSelectedCategoryId(budgetToEdit.categoryId);
        setSelectedMonth(budgetToEdit.month);
      } else {
        setAmount('');
        setSelectedCategoryId(expenseCategories.length > 0 ? expenseCategories[0].id : '');
        setSelectedMonth(format(new Date(), 'yyyy-MM'));
      }
      setError('');
    }
  }, [isOpen, budgetToEdit, expenseCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedCategoryId) {
      setError('Selecione uma categoria');
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Digite um valor válido');
      return;
    }

    const budgetData = {
      categoryId: selectedCategoryId,
      amount: Number(amount),
      month: selectedMonth,
    };

    // Se não estiver editando, verificar se já existe orçamento para esta categoria/mês
    if (!budgetToEdit) {
      const existing = getBudgetByCategoryId(selectedCategoryId, selectedMonth);
      if (existing) {
        setError('Já existe um orçamento para esta categoria neste mês');
        return;
      }
      addBudget(budgetData);
    } else {
      updateBudget(budgetToEdit.id, budgetData);
    }

    onClose();
  };

  // Gerar opções de meses (mês atual e 11 meses futuros)
  const getMonthOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const value = format(date, 'yyyy-MM');
      const label = format(date, 'MMMM yyyy', { locale: ptBR });
      options.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
    }
    
    return options;
  };

  const monthOptions = getMonthOptions();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {budgetToEdit ? 'Editar Orçamento' : 'Adicionar Orçamento'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select 
              value={selectedCategoryId} 
              onValueChange={setSelectedCategoryId}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="month">Mês</Label>
            <Select 
              value={selectedMonth} 
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger id="month">
                <SelectValue placeholder="Selecione um mês" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Valor limite</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-right"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {budgetToEdit ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
