import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Transaction, CategoryType, BalanceSummary, TransactionType, Budget } from '../types';
import { mockTransactions, categories as defaultCategories, calculateBalance } from '../data/mockData';
import { useToast } from "../hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type TransactionContextType = {
  transactions: Transaction[];
  categories: CategoryType[];
  budgets: Budget[];
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
  const [categories, setCategories] = useState<CategoryType[]>(defaultCategories);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const { toast } = useToast();

  // Load user data, transactions, and categories from localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('financeApp_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUserName(userData.name);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
      }
    }

    const savedTransactions = localStorage.getItem('financeApp_transactions');
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (error) {
        console.error('Error parsing saved transactions:', error);
      }
    }

    const savedCategories = localStorage.getItem('financeApp_categories');
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error('Error parsing saved categories:', error);
        // If there's an error loading saved categories, use the default ones
        setCategories(defaultCategories);
      }
    }

    const savedBudgets = localStorage.getItem('financeApp_budgets');
    if (savedBudgets) {
      try {
        setBudgets(JSON.parse(savedBudgets));
      } catch (error) {
        console.error('Error parsing saved budgets:', error);
      }
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('financeApp_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('financeApp_categories', JSON.stringify(categories));
  }, [categories]);

  // Save budgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('financeApp_budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Calculate balance summary
  const balanceSummary = calculateBalance(transactions);

  // Update budget spent whenever transactions change
  useEffect(() => {
    if (budgets.length > 0) {
      const updatedBudgets = budgets.map(budget => {
        const spent = calculateSpentAmount(budget.categoryId, budget.month);
        return {
          ...budget,
          spent,
          lastUpdated: new Date().toISOString()
        };
      });
      setBudgets(updatedBudgets);
    }
  }, [transactions]);

  // Calculate how much was spent in a category for a specific month
  const calculateSpentAmount = (categoryId: string, month: string) => {
    return transactions
      .filter(t => t.type === 'expense' && 
                  t.category.id === categoryId && 
                  t.date.startsWith(month))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Get current month string in format 'YYYY-MM'
  const getCurrentMonth = () => {
    return format(new Date(), 'yyyy-MM');
  };

  // Get budgets for current month
  const getCurrentMonthBudgets = () => {
    const currentMonth = getCurrentMonth();
    return budgets.filter(b => b.month === currentMonth);
  };

  // Get budget progress as percentage
  const getBudgetProgress = (budget: Budget) => {
    if (budget.amount === 0) return 0;
    return Math.min((budget.spent / budget.amount) * 100, 100);
  };

  // Add new budget
  const addBudget = (budget: Omit<Budget, 'id' | 'spent' | 'lastUpdated'>) => {
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
    
    const spent = calculateSpentAmount(budget.categoryId, budget.month);
    
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      spent,
      lastUpdated: new Date().toISOString()
    };
    
    setBudgets(prev => [...prev, newBudget]);
    toast({
      title: "Orçamento adicionado",
      description: "Seu orçamento foi registrado com sucesso.",
    });
  };

  // Update existing budget
  const updateBudget = (id: string, budgetUpdate: Partial<Omit<Budget, 'id' | 'spent' | 'lastUpdated'>>) => {
    setBudgets(prev => 
      prev.map(b => {
        if (b.id === id) {
          const updatedBudget = { ...b, ...budgetUpdate, lastUpdated: new Date().toISOString() };
          // Recalcular o gasto se o mês ou categoria mudou
          if (budgetUpdate.month || budgetUpdate.categoryId) {
            const monthToUse = budgetUpdate.month || b.month;
            const categoryToUse = budgetUpdate.categoryId || b.categoryId;
            updatedBudget.spent = calculateSpentAmount(categoryToUse, monthToUse);
          }
          return updatedBudget;
        }
        return b;
      })
    );
    toast({
      title: "Orçamento atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  // Delete budget
  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
    toast({
      title: "Orçamento removido",
      description: "O orçamento foi excluído com sucesso.",
    });
  };

  // Get budget by category ID and month
  const getBudgetByCategoryId = (categoryId: string, month: string): Budget | undefined => {
    return budgets.find(b => b.categoryId === categoryId && b.month === month);
  };

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

  // Get a transaction by ID
  const getTransactionById = (id: string) => {
    return transactions.find(t => t.id === id);
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

  // Add a new category
  const addCategory = (category: Omit<CategoryType, 'id'>) => {
    const newCategory = {
      ...category,
      id: Date.now().toString()
    };
    
    setCategories(prev => [...prev, newCategory]);
    toast({
      title: "Categoria adicionada",
      description: "A categoria foi adicionada com sucesso.",
    });
  };

  // Edit a category
  const editCategory = (id: string, category: Omit<CategoryType, 'id'>) => {
    setCategories(prev => 
      prev.map(c => c.id === id ? { ...category, id } : c)
    );
    toast({
      title: "Categoria atualizada",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  // Delete a category
  const deleteCategory = (id: string) => {
    // Check if there are transactions using this category
    const hasTransactions = transactions.some(t => t.category.id === id);
    
    if (hasTransactions) {
      toast({
        title: "Operação não permitida",
        description: "Existem transações usando esta categoria. Edite ou exclua essas transações primeiro.",
        variant: "destructive"
      });
      return false;
    }
    
    setCategories(prev => prev.filter(c => c.id !== id));
    toast({
      title: "Categoria removida",
      description: "A categoria foi excluída com sucesso.",
    });
    return true;
  };

  const value = {
    transactions,
    categories,
    budgets,
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
    getBudgetProgress
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
