
import React, { createContext, useContext, ReactNode } from 'react';
import { Transaction, CategoryType, BalanceSummary, TransactionType, Budget, FinancialGoal } from '../types';
import { useTransactionsData } from '../hooks/useTransactionsData';
import { useCategoriesData } from '../hooks/useCategoriesData';
import { useBudgetsData } from '../hooks/useBudgetsData';
import { useFinancialGoalsData } from '../hooks/useFinancialGoalsData';
import { useAuthStatus } from '../hooks/useAuthStatus';

type TransactionContextType = {
  transactions: Transaction[];
  categories: CategoryType[];
  budgets: Budget[];
  financialGoals: FinancialGoal[];
  balanceSummary: BalanceSummary;
  userName: string | null;
  setUserName: (name: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  editTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  getCategoriesByType: (type: TransactionType) => CategoryType[];
  getTransactionById: (id: string) => Transaction | undefined;
  addCategory: (category: Omit<CategoryType, 'id'>) => void;
  editCategory: (id: string, category: Omit<CategoryType, 'id'>) => void;
  deleteCategory: (id: string) => boolean;
  addBudget: (budget: Omit<Budget, 'id' | 'spent' | 'lastUpdated'>) => void;
  updateBudget: (id: string, budget: Partial<Omit<Budget, 'id' | 'spent' | 'lastUpdated'>>) => void;
  deleteBudget: (id: string) => void;
  getBudgetByCategoryId: (categoryId: string, month: string) => Budget | undefined;
  getCurrentMonthBudgets: () => Budget[];
  getBudgetProgress: (budget: Budget) => number;
  // Financial Goals methods
  addFinancialGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  updateFinancialGoal: (id: string, goal: Partial<Omit<FinancialGoal, 'id'>>) => void;
  deleteFinancialGoal: (id: string) => void;
  contributeToGoal: (id: string, amount: number) => void;
  completeGoal: (id: string) => void;
  cancelGoal: (id: string) => void;
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
  // Use our custom hooks to manage different aspects of the data
  const { 
    transactions, 
    balanceSummary, 
    getTransactionById, 
    addTransaction, 
    deleteTransaction, 
    editTransaction 
  } = useTransactionsData();

  const {
    categories,
    getCategoriesByType,
    addCategory,
    editCategory,
    deleteCategory
  } = useCategoriesData();

  const {
    budgets,
    getCurrentMonthBudgets,
    getBudgetProgress,
    getBudgetByCategoryId,
    addBudget,
    updateBudget,
    deleteBudget
  } = useBudgetsData();

  const {
    financialGoals,
    addFinancialGoal,
    updateFinancialGoal,
    deleteFinancialGoal,
    contributeToGoal,
    completeGoal,
    cancelGoal
  } = useFinancialGoalsData();

  const { userName, setUserName } = useAuthStatus();

  // Provide the combined state and methods to the context
  const value = {
    transactions,
    categories,
    budgets,
    financialGoals,
    balanceSummary,
    userName,
    setUserName,
    addTransaction,
    deleteTransaction,
    editTransaction,
    getCategoriesByType,
    getTransactionById,
    addCategory,
    editCategory,
    deleteCategory,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetByCategoryId,
    getCurrentMonthBudgets,
    getBudgetProgress,
    addFinancialGoal,
    updateFinancialGoal,
    deleteFinancialGoal,
    contributeToGoal,
    completeGoal,
    cancelGoal
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
