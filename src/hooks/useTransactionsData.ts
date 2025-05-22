
import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '../types';
import { useToast } from './use-toast';
import { calculateBalance } from '../data/mockData';
import {
  fetchTransactions,
  addTransactionToDb,
  updateTransactionInDb,
  deleteTransactionFromDb
} from '../utils/supabaseUtils';
import { useAuthStatus } from './useAuthStatus';

export function useTransactionsData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isAuthenticated } = useAuthStatus();

  // Fetch transactions from Supabase
  const loadTransactions = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      toast({
        title: "Erro ao carregar transações",
        description: "Não foi possível carregar suas transações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, toast]);

  // Load transactions on mount and when auth state changes
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Get a transaction by ID
  const getTransactionById = useCallback((id: string) => {
    return transactions.find(t => t.id === id);
  }, [transactions]);

  // Add a new transaction
  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    if (!isAuthenticated) {
      toast({
        title: "Erro ao adicionar transação",
        description: "Você precisa estar autenticado para adicionar transações.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addTransactionToDb(transaction);
      await loadTransactions(); // Refresh transactions
      
      toast({
        title: "Transação adicionada",
        description: "Sua transação foi registrada com sucesso.",
      });
    } catch (error) {
      console.error('Failed to add transaction:', error);
      toast({
        title: "Erro ao adicionar transação",
        description: "Ocorreu um erro ao tentar adicionar a transação.",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, loadTransactions, toast]);

  // Delete a transaction
  const deleteTransaction = useCallback(async (id: string) => {
    if (!isAuthenticated) return;

    try {
      await deleteTransactionFromDb(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      toast({
        title: "Transação removida",
        description: "A transação foi excluída com sucesso.",
      });
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      toast({
        title: "Erro ao remover transação",
        description: "Ocorreu um erro ao tentar remover a transação.",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, toast]);

  // Edit a transaction
  const editTransaction = useCallback(async (id: string, transaction: Omit<Transaction, 'id'>) => {
    if (!isAuthenticated) return;

    try {
      await updateTransactionInDb(id, transaction);
      setTransactions(prev => prev.map(t => t.id === id ? { ...transaction, id } : t));
      
      toast({
        title: "Transação atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Failed to update transaction:', error);
      toast({
        title: "Erro ao atualizar transação",
        description: "Ocorreu um erro ao tentar atualizar a transação.",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, toast]);

  // Calculate balance summary based on transactions
  const balanceSummary = calculateBalance(transactions);

  return {
    transactions,
    balanceSummary,
    isLoading,
    getTransactionById,
    addTransaction,
    deleteTransaction,
    editTransaction,
    refreshTransactions: loadTransactions
  };
}
