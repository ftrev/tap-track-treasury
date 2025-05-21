
export type TransactionType = 'income' | 'expense' | 'transfer';

export type CategoryType = {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
  color?: string;
};

export type Transaction = {
  id: string;
  amount: number;
  type: TransactionType;
  category: CategoryType;
  description?: string;
  date: string;
};

export type Budget = {
  id: string;
  categoryId: string;
  amount: number;
  month: string; // formato 'YYYY-MM'
  spent: number;
  lastUpdated: string;
};

export type BalanceSummary = {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
};
