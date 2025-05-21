
import { Transaction, CategoryType, TransactionType, BalanceSummary } from '../types';

// Define categories
export const categories: CategoryType[] = [
  { id: 'food', name: 'Alimentação', icon: '🍔', type: 'expense' },
  { id: 'housing', name: 'Moradia', icon: '🏠', type: 'expense' },
  { id: 'transport', name: 'Transporte', icon: '🚗', type: 'expense' },
  { id: 'shopping', name: 'Compras', icon: '👕', type: 'expense' },
  { id: 'health', name: 'Saúde', icon: '💊', type: 'expense' },
  { id: 'leisure', name: 'Lazer', icon: '🎮', type: 'expense' },
  { id: 'travel', name: 'Viagem', icon: '✈️', type: 'expense' },
  { id: 'other', name: 'Outros', icon: '📝', type: 'expense' },
  { id: 'salary', name: 'Salário', icon: '💰', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: '💼', type: 'income' },
  { id: 'gift', name: 'Presente', icon: '🎁', type: 'income' },
  { id: 'transfer', name: 'Transferência', icon: '🔄', type: 'transfer' },
];

// Mock transactions
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 42.50,
    type: 'expense',
    category: categories[0], // Food
    description: 'Supermercado',
    date: today.toISOString(),
  },
  {
    id: '2',
    amount: 85.00,
    type: 'expense',
    category: categories[2], // Transport
    description: 'Combustível',
    date: yesterday.toISOString(),
  },
  {
    id: '3',
    amount: 2500.00,
    type: 'income',
    category: categories[8], // Salary
    description: 'Salário mensal',
    date: lastWeek.toISOString(),
  },
  {
    id: '4',
    amount: 120.00,
    type: 'expense',
    category: categories[5], // Leisure
    description: 'Jantar fora',
    date: yesterday.toISOString(),
  },
  {
    id: '5',
    amount: 350.00,
    type: 'expense',
    category: categories[1], // Housing
    description: 'Conta de luz',
    date: yesterday.toISOString(),
  },
];

// Calculate balance
export const calculateBalance = (transactions: Transaction[]): BalanceSummary => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const currentBalance = totalIncome - totalExpenses;
  
  return {
    totalIncome,
    totalExpenses,
    currentBalance,
  };
};

// Get transactions by type
export const getTransactionsByType = (transactions: Transaction[], type: TransactionType): Transaction[] => {
  return transactions.filter(t => t.type === type);
};

// Get transaction by ID
export const getTransactionById = (transactions: Transaction[], id: string): Transaction | undefined => {
  return transactions.find(t => t.id === id);
};

// Format currency - Brazilian Real (BRL)
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};

// Group transactions by date
export const groupTransactionsByDate = (transactions: Transaction[]): Record<string, Transaction[]> => {
  const groups: Record<string, Transaction[]> = {};
  
  transactions.forEach(transaction => {
    const date = transaction.date.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
  });
  
  return groups;
};
