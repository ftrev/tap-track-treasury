
import { useState, useEffect, useCallback } from 'react';
import { FinancialGoal } from '../types';
import { useToast } from './use-toast';
import {
  fetchFinancialGoals,
  addFinancialGoalToDb,
  updateFinancialGoalInDb,
  deleteFinancialGoalFromDb
} from '../utils/supabaseUtils';
import { useAuthStatus } from './useAuthStatus';

export function useFinancialGoalsData() {
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isAuthenticated } = useAuthStatus();

  // Fetch financial goals from Supabase
  const loadFinancialGoals = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const data = await fetchFinancialGoals();
      setFinancialGoals(data);
    } catch (error) {
      console.error('Failed to load financial goals:', error);
      toast({
        title: "Erro ao carregar metas",
        description: "Não foi possível carregar suas metas financeiras.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, toast]);

  // Load financial goals on mount and when auth state changes
  useEffect(() => {
    loadFinancialGoals();
  }, [loadFinancialGoals]);

  // Add a new financial goal
  const addFinancialGoal = useCallback(async (goal: Omit<FinancialGoal, 'id'>) => {
    if (!isAuthenticated) return;

    try {
      await addFinancialGoalToDb(goal);
      await loadFinancialGoals(); // Refresh with server data
      
      toast({
        title: "Meta criada",
        description: "Sua meta financeira foi criada com sucesso.",
      });
    } catch (error) {
      console.error('Failed to add financial goal:', error);
      toast({
        title: "Erro ao criar meta",
        description: "Ocorreu um erro ao tentar criar a meta financeira.",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, loadFinancialGoals, toast]);

  // Update an existing financial goal
  const updateFinancialGoal = useCallback(async (id: string, goalUpdate: Partial<Omit<FinancialGoal, 'id'>>) => {
    if (!isAuthenticated) return;

    try {
      await updateFinancialGoalInDb(id, goalUpdate);
      
      setFinancialGoals(prev => 
        prev.map(g => g.id === id ? { ...g, ...goalUpdate } : g)
      );
      
      toast({
        title: "Meta atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Failed to update financial goal:', error);
      toast({
        title: "Erro ao atualizar meta",
        description: "Ocorreu um erro ao tentar atualizar a meta financeira.",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, toast]);

  // Delete a financial goal
  const deleteFinancialGoal = useCallback(async (id: string) => {
    if (!isAuthenticated) return;

    try {
      await deleteFinancialGoalFromDb(id);
      setFinancialGoals(prev => prev.filter(g => g.id !== id));
      
      toast({
        title: "Meta removida",
        description: "A meta financeira foi removida com sucesso.",
      });
    } catch (error) {
      console.error('Failed to delete financial goal:', error);
      toast({
        title: "Erro ao remover meta",
        description: "Ocorreu um erro ao tentar remover a meta financeira.",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, toast]);

  // Add contribution to a goal
  const contributeToGoal = useCallback(async (id: string, amount: number) => {
    if (!isAuthenticated) return;

    try {
      const goal = financialGoals.find(g => g.id === id);
      if (!goal) return;

      const updatedAmount = goal.currentAmount + amount;
      const isCompleted = updatedAmount >= goal.targetAmount;
      
      await updateFinancialGoalInDb(id, {
        currentAmount: updatedAmount,
        status: isCompleted ? 'completed' : goal.status
      });
      
      setFinancialGoals(prev => 
        prev.map(g => {
          if (g.id === id) {
            return {
              ...g,
              currentAmount: updatedAmount,
              status: isCompleted ? 'completed' : g.status
            };
          }
          return g;
        })
      );
      
      toast({
        title: "Contribuição adicionada",
        description: `Você contribuiu com ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)} para sua meta.`,
      });
    } catch (error) {
      console.error('Failed to contribute to goal:', error);
      toast({
        title: "Erro ao adicionar contribuição",
        description: "Ocorreu um erro ao tentar adicionar a contribuição.",
        variant: "destructive"
      });
    }
  }, [financialGoals, isAuthenticated, toast]);

  // Mark a goal as completed
  const completeGoal = useCallback(async (id: string) => {
    if (!isAuthenticated) return;

    try {
      await updateFinancialGoalInDb(id, { status: 'completed' });
      setFinancialGoals(prev => 
        prev.map(g => g.id === id ? { ...g, status: 'completed' } : g)
      );
      
      toast({
        title: "Meta concluída",
        description: "Parabéns! Sua meta foi marcada como concluída.",
      });
    } catch (error) {
      console.error('Failed to complete goal:', error);
      toast({
        title: "Erro ao concluir meta",
        description: "Ocorreu um erro ao tentar marcar a meta como concluída.",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, toast]);

  // Cancel a goal
  const cancelGoal = useCallback(async (id: string) => {
    if (!isAuthenticated) return;

    try {
      await updateFinancialGoalInDb(id, { status: 'cancelled' });
      setFinancialGoals(prev => 
        prev.map(g => g.id === id ? { ...g, status: 'cancelled' } : g)
      );
      
      toast({
        title: "Meta cancelada",
        description: "A meta foi cancelada.",
      });
    } catch (error) {
      console.error('Failed to cancel goal:', error);
      toast({
        title: "Erro ao cancelar meta",
        description: "Ocorreu um erro ao tentar cancelar a meta.",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, toast]);

  return {
    financialGoals,
    isLoading,
    addFinancialGoal,
    updateFinancialGoal,
    deleteFinancialGoal,
    contributeToGoal,
    completeGoal,
    cancelGoal,
    refreshFinancialGoals: loadFinancialGoals
  };
}
