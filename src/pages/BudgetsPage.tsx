
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { BudgetItem } from '../components/BudgetItem';
import { BudgetFormModal } from '../components/BudgetFormModal';
import { useTransactions } from '../contexts/TransactionContext';
import { Button } from '../components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { Budget } from '../types';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

const BudgetsPage = () => {
  const { 
    budgets, 
    categories, 
    deleteBudget, 
    getBudgetProgress 
  } = useTransactions();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);

  // Filtrar orçamentos por mês selecionado
  const filteredBudgets = budgets.filter(b => b.month === currentMonth);

  const handleAddBudget = () => {
    setSelectedBudget(undefined);
    setIsModalOpen(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsModalOpen(true);
  };

  const handleDeleteBudget = (id: string) => {
    setBudgetToDelete(id);
  };

  const confirmDeleteBudget = () => {
    if (budgetToDelete) {
      deleteBudget(budgetToDelete);
      setBudgetToDelete(null);
    }
  };

  const getMonthOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = -6; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const value = format(date, 'yyyy-MM');
      const label = format(date, 'MMMM yyyy', { locale: ptBR });
      options.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
    }
    
    return options;
  };

  const monthOptions = getMonthOptions();

  const getCategoryForBudget = (budget: Budget) => {
    return categories.find(c => c.id === budget.categoryId) || {
      id: 'unknown',
      name: 'Categoria Desconhecida',
      icon: '❓',
      type: 'expense'
    };
  };

  // Navegar para o mês anterior
  const goToPreviousMonth = () => {
    const date = new Date(currentMonth + '-01');
    setCurrentMonth(format(subMonths(date, 1), 'yyyy-MM'));
  };

  // Navegar para o próximo mês
  const goToNextMonth = () => {
    const date = new Date(currentMonth + '-01');
    setCurrentMonth(format(addMonths(date, 1), 'yyyy-MM'));
  };

  return (
    <Layout title="Orçamentos">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousMonth}
            aria-label="Mês anterior"
          >
            <Calendar className="h-4 w-4" />
          </Button>
          
          <Select
            value={currentMonth}
            onValueChange={setCurrentMonth}
          >
            <SelectTrigger className="w-[180px]">
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
          
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMonth}
            aria-label="Próximo mês"
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
        
        <Button onClick={handleAddBudget} className="gap-1 items-center">
          <Plus size={16} />
          Adicionar
        </Button>
      </div>

      {filteredBudgets.length > 0 ? (
        <div className="space-y-4">
          {filteredBudgets.map(budget => (
            <BudgetItem
              key={budget.id}
              budget={budget}
              category={getCategoryForBudget(budget)}
              progress={getBudgetProgress(budget)}
              onEdit={handleEditBudget}
              onDelete={handleDeleteBudget}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p>Nenhum orçamento encontrado para este mês.</p>
          <Button 
            variant="outline" 
            onClick={handleAddBudget}
            className="mt-4"
          >
            Criar um novo orçamento
          </Button>
        </div>
      )}

      <BudgetFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        budgetToEdit={selectedBudget}
      />

      <AlertDialog open={!!budgetToDelete} onOpenChange={() => setBudgetToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir orçamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteBudget}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default BudgetsPage;
