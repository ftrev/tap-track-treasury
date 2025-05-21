
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useTransactions } from '../contexts/TransactionContext';
import { CalendarIcon, PiggyBank } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type PlanType = 'short' | 'medium' | 'long';

interface FinancialPlanFormProps {
  onPlanCreated: () => void;
}

export function FinancialPlanForm({ onPlanCreated }: FinancialPlanFormProps) {
  const { addFinancialGoal } = useTransactions();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [planType, setPlanType] = useState<PlanType>('medium');
  const [targetDate, setTargetDate] = useState('');
  const [error, setError] = useState('');

  const calculateDefaultTargetDate = (type: PlanType): string => {
    const today = new Date();
    let targetDate: Date;

    switch (type) {
      case 'short':
        // 3 meses
        targetDate = new Date(today.setMonth(today.getMonth() + 3));
        break;
      case 'medium':
        // 1 ano
        targetDate = new Date(today.setFullYear(today.getFullYear() + 1));
        break;
      case 'long':
        // 5 anos
        targetDate = new Date(today.setFullYear(today.getFullYear() + 5));
        break;
      default:
        targetDate = new Date(today.setFullYear(today.getFullYear() + 1));
    }

    return format(targetDate, 'yyyy-MM-dd');
  };

  const handlePlanTypeChange = (value: PlanType) => {
    setPlanType(value);
    setTargetDate(calculateDefaultTargetDate(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Informe um nome para o plano');
      return;
    }

    if (!targetAmount || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      setError('Digite um valor válido para a meta');
      return;
    }

    if (!targetDate) {
      setError('Defina uma data alvo');
      return;
    }

    // Usar o sistema de metas existente para criar planos financeiros
    addFinancialGoal({
      name: name.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: 0,
      targetDate: targetDate,
      startDate: new Date().toISOString(),
      iconName: '💰',
      status: 'active',
      description: description.trim() || undefined
    });

    // Resetar formulário
    setName('');
    setDescription('');
    setTargetAmount('');
    setPlanType('medium');
    setTargetDate(calculateDefaultTargetDate('medium'));
    
    // Notificar o componente pai
    onPlanCreated();
  };

  // Definir data alvo inicial baseado no tipo de plano padrão
  React.useEffect(() => {
    setTargetDate(calculateDefaultTargetDate(planType));
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do plano</Label>
        <Input
          id="name"
          placeholder="Ex: Comprar uma casa"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          placeholder="Descreva seu plano financeiro"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAmount">Valor alvo</Label>
        <Input
          id="targetAmount"
          type="number"
          placeholder="0,00"
          step="0.01"
          min="0"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="planType">Tipo de plano</Label>
        <Select
          value={planType}
          onValueChange={handlePlanTypeChange}
        >
          <SelectTrigger id="planType">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short">Curto prazo (3 meses)</SelectItem>
            <SelectItem value="medium">Médio prazo (1 ano)</SelectItem>
            <SelectItem value="long">Longo prazo (5 anos)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetDate">Data alvo</Label>
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
          <Input
            id="targetDate"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {targetDate && format(new Date(targetDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" className="w-full">
        <PiggyBank className="mr-2 h-4 w-4" />
        Criar plano financeiro
      </Button>
    </form>
  );
}
