
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, CategoryType, BalanceSummary, TransactionType } from '../types';
import { mockTransactions, categories, calculateBalance } from '../data/mockData';
import { useToast } from "../hooks/use-toast";

type TransactionContextType = {
  transactions: Transaction[];
  categories: CategoryType[];
  balanceSummary: BalanceSummary;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  editTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  getCategoriesByType: (type: TransactionType) => CategoryType[];
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

type TransactionProviderProps = {
  children: ReactNode;
};

export const TransactionProvider = ({ children }: TransactionProviderProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const { toast } = useToast();

  // Calculate balance summary
  const balanceSummary = calculateBalance(transactions);

  // Add a new transaction
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    toast({
      title: "Transação adicionada",
      description: "Sua transação foi registrada com sucesso.",
    });
  };

  // Delete a transaction
  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transação removida",
      description: "A transação foi excluída com sucesso.",
    });
  };

  // Edit a transaction
  const editTransaction = (id: string, transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...transaction, id } : t)
    );
    toast({
      title: "Transação atualizada",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  // Get categories by type
  const getCategoriesByType = (type: TransactionType): CategoryType[] => {
    return categories.filter(c => c.type === type);
  };

  const value = {
    transactions,
    categories,
    balanceSummary,
    addTransaction,
    deleteTransaction,
    editTransaction,
    getCategoriesByType,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
