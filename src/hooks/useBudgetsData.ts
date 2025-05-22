
import { useState, useEffect, useCallback } from 'react';
import { Budget } from '../types';
import { useToast } from './use-toast';
import { format } from "date-fns";
import {
  fetchBudgets,
  addBudgetToDb,
  updateBudgetInDb,
  updateBudgetSpentInDb,
  deleteBudgetFromDb
} from '../utils/supabaseUtils';
import { useAuthStatus } from './useAuthStatus';

export function useBudgetsData() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isAuthenticated } = useAuthStatus();

  // Fetch budgets from Supabase
  const loadBudgets = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const data = await fetchBudgets();
      setBudgets(data);
    } catch (error) {
      console.error('Failed to load budgets:', error);
      toast({
        title: "Erro ao carregar orçamentos",
        description: "Não foi possível carregar seus orçamentos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, toast]);

  // Load budgets on mount and when auth state changes
  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  // Get current month string in format 'YYYY-MM'
  const getCurrentMonth = useCallback(() => {
    return format(new Date(), 'yyyy-MM');
  }, []);

  // Get budgets for current month
  const getCurrentMonthBudgets = useCallback(() => {
    const currentMonth = getCurrentMonth();
    return budgets.filter(b => b.month === currentMonth);
  }, [budgets, getCurrentMonth]);

  // Get budget progress as percentage
  const getBudgetProgress = useCallback((budget: Budget) => {
    if (budget.amount === 0) return 0;
    return Math.min((budget.spent / budget.amount) * 100, 100);
  }, []);

  // Get budget by category ID and month
  const getBudgetByCategoryId = useCallback((categoryId: string, month: string): Budget | undefined => {
    return budgets.find(b => b.categoryId === categoryId && b.month === month);
  }, [budgets]);

  // Calculate how much was spent in a category for a specific month
  const calculateSpentAmount = useCallback((categoryId: string, month: string, transactions: any[]) => {
    return transactions
      .filter(t => t.type === 'expense' && 
                  t.category.id === categoryId && 
                  t.date.startsWith(month))
      .reduce((sum, t) => sum + t.amount, 0);
  }, []);

  // Add a new budget
  const addBudget = useCallback(async (budget: Omit<Budget, 'id' | 'spent' | 'lastUpdated'>) => {
    if (!isAuthenticated) return;

    // Check if budget for this category and month already exists
    const existingBudget = getBudgetByCategoryId(budget.categoryId, budget.month);
    
    if (existingBudget) {
      toast({
        title: "Orçamento já existe",
        description: "Já existe um orçamento para esta categoria neste mês.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const newBudget = await addBudgetToDb(budget);
      await loadBudgets(); // Refresh to get correct spent amount
      
      toast({
        title: "Orçamento adicionado",
        description: "Seu orçamento foi registrado com sucesso.",
      });
    } catch (error) {
      console.error('Failed to add budget:', error);
      toast({
        title: "Erro ao adicionar orçamento",
        description: "Ocorreu um erro ao tentar adicionar o orçamento.",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, getBudgetByCategoryId, loadBudgets, toast]);

  // Update an existing budget
  const updateBudget = useCallback(async (id: string, budgetUpdate: Partial<Omit<Budget, 'id' | 'spent' | 'lastUpdated'>>) => {
    if (!isAuthenticated) return;

    try {
      await updateBudgetInDb(id, budgetUpdate);
      await loadBudgets(); // Refresh to get correct data
      
      toast({
        title: "Orçamento atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Failed to update budget:', error);
      toast({
        title: "Erro ao atualizar orçamento",
        description: "Ocorreu um erro ao tentar atualizar o orçamento.",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, loadBudgets, toast]);

  // Update the spent amount for a budget
  const updateBudgetSpent = useCallback(async (id: string, spent: number) => {
    if (!isAuthenticated) return;

    try {
      await updateBudgetSpentInDb(id, spent);
      setBudgets(prev => 
        prev.map(b => b.id === id ? { 
          ...b, 
          spent, 
          lastUpdated: new Date().toISOString() 
        } : b)
      );
    } catch (error) {
      console.error('Failed to update budget spent:', error);
    }
  }, [isAuthenticated]);

  // Delete a budget
  const deleteBudget = useCallback(async (id: string) => {
    if (!isAuthenticated) return;

    try {
      await deleteBudgetFromDb(id);
      setBudgets(prev => prev.filter(b => b.id !== id));
      
      toast({
        title: "Orçamento removido",
        description: "O orçamento foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Failed to delete budget:', error);
      toast({
        title: "Erro ao remover orçamento",
        description: "Ocorreu um erro ao tentar remover o orçamento.",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, toast]);

  return {
    budgets,
    isLoading,
    getCurrentMonth,
    getCurrentMonthBudgets,
    getBudgetProgress,
    getBudgetByCategoryId,
    addBudget,
    updateBudget,
    updateBudgetSpent,
    deleteBudget,
    refreshBudgets: loadBudgets,
    calculateSpentAmount
  };
}
