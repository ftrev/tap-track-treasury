
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
import { Textarea } from './ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { FinancialGoal } from '../types';
import { format } from 'date-fns';

// Lista de ícones disponíveis para metas
const goalIcons = [
  { value: '🏠', label: 'Casa' },
  { value: '🚗', label: 'Carro' },
  { value: '✈️', label: 'Viagem' },
  { value: '👨‍🎓', label: 'Educação' },
  { value: '💻', label: 'Tecnologia' },
  { value: '💍', label: 'Casamento' },
  { value: '👶', label: 'Bebê' },
  { value: '🏝️', label: 'Férias' },
  { value: '🎓', label: 'Formatura' },
  { value: '🏥', label: 'Saúde' },
  { value: '💰', label: 'Aposentadoria' },
  { value: '🎁', label: 'Presente' },
];

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: FinancialGoal;
  onSave: (goal: Omit<FinancialGoal, 'id'>) => void;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({ 
  isOpen, 
  onClose,
  goalToEdit,
  onSave
}) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('🎯');
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (goalToEdit) {
        setName(goalToEdit.name);
        setTargetAmount(goalToEdit.targetAmount.toString());
        setTargetDate(goalToEdit.targetDate || '');
        setDescription(goalToEdit.description || '');
        setIconName(goalToEdit.iconName);
      } else {
        setName('');
        setTargetAmount('');
        setTargetDate('');
        setDescription('');
        setIconName('🎯');
      }
      setError('');
    }
  }, [isOpen, goalToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Informe um nome para a meta');
      return;
    }

    if (!targetAmount || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      setError('Digite um valor válido para a meta');
      return;
    }

    const goalData: Omit<FinancialGoal, 'id'> = {
      name: name.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: goalToEdit?.currentAmount || 0,
      targetDate: targetDate || undefined,
      startDate: goalToEdit?.startDate || new Date().toISOString(),
      iconName,
      status: goalToEdit?.status || 'active',
      description: description.trim() || undefined
    };

    onSave(goalData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {goalToEdit ? 'Editar Meta' : 'Adicionar Meta'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="icon">Ícone</Label>
            <Select 
              value={iconName} 
              onValueChange={setIconName}
            >
              <SelectTrigger id="icon" className="w-full">
                <SelectValue placeholder="Selecione um ícone" />
              </SelectTrigger>
              <SelectContent>
                {goalIcons.map((icon) => (
                  <SelectItem key={icon.value} value={icon.value}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{icon.value}</span>
                      <span>{icon.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nome da meta</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ex: Viagem para Paris"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetAmount">Valor da meta</Label>
            <Input
              id="targetAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="text-right"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetDate">Data alvo (opcional)</Label>
            <Input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descreva seu objetivo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {goalToEdit ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
