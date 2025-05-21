
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

export type BalanceSummary = {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
};
