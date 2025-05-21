
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
import { formatCurrency } from '../lib/utils';
import { FinancialGoal } from '../types';

interface ContributeGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: FinancialGoal;
  onContribute: (goalId: string, amount: number) => void;
}

export const ContributeGoalModal: React.FC<ContributeGoalModalProps> = ({ 
  isOpen, 
  onClose,
  goal,
  onContribute
}) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Digite um valor válido para contribuir');
      return;
    }

    if (goal) {
      const contributionAmount = Number(amount);
      const remainingAmount = goal.targetAmount - goal.currentAmount;
      
      if (contributionAmount > remainingAmount) {
        setError(`O valor excede o necessário para completar a meta (${formatCurrency(remainingAmount)})`);
        return;
      }

      onContribute(goal.id, contributionAmount);
      onClose();
    }
  };

  if (!goal) return null;

  const remainingAmount = goal.targetAmount - goal.currentAmount;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contribuir para {goal.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="text-center mb-4">
            <div className="text-2xl mb-2">{goal.iconName}</div>
            <p className="text-sm text-gray-500 mb-2">
              Meta: {formatCurrency(goal.targetAmount)}
            </p>
            <p className="text-sm text-gray-500">
              Falta: {formatCurrency(remainingAmount)}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Valor da contribuição</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max={remainingAmount}
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
              Contribuir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
