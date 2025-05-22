
import { supabase } from '../integrations/supabase/client';
import { Transaction, CategoryType, Budget, FinancialGoal } from '../types';

// Helper function to get the current user's ID
export const getCurrentUserId = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id;
};

// Transactions
export async function fetchTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      category:categories(*)
    `)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  // Transform the data to match the expected format
  return data.map(item => ({
    id: item.id,
    amount: Number(item.amount),
    type: item.type as 'income' | 'expense' | 'transfer',
    category: item.category as CategoryType,
    description: item.description || undefined,
    date: item.date,
    receiptImage: item.receipt_image || undefined
  })) as Transaction[];
}

export async function addTransactionToDb(transaction: Omit<Transaction, 'id'>) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('User not authenticated');
  
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      amount: transaction.amount,
      type: transaction.type,
      category_id: transaction.category.id,
      description: transaction.description || null,
      date: transaction.date,
      receipt_image: transaction.receiptImage || null,
      user_id: userId
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }

  return data;
}

export async function updateTransactionInDb(id: string, transaction: Omit<Transaction, 'id'>) {
  const { error } = await supabase
    .from('transactions')
    .update({
      amount: transaction.amount,
      type: transaction.type,
      category_id: transaction.category.id,
      description: transaction.description || null,
      date: transaction.date,
      receipt_image: transaction.receiptImage || null
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
}

export async function deleteTransactionFromDb(id: string) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
}

// Categories
export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data as CategoryType[];
}

export async function addCategoryToDb(category: Omit<CategoryType, 'id'>) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: category.name,
      icon: category.icon,
      type: category.type,
      color: category.color || null,
      user_id: userId
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding category:', error);
    throw error;
  }

  return data;
}

export async function updateCategoryInDb(id: string, category: Omit<CategoryType, 'id'>) {
  const { error } = await supabase
    .from('categories')
    .update({
      name: category.name,
      icon: category.icon,
      type: category.type,
      color: category.color || null
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

export async function deleteCategoryFromDb(id: string) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

// Budgets
export async function fetchBudgets() {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching budgets:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    categoryId: item.category_id,
    amount: Number(item.amount),
    month: item.month,
    spent: Number(item.spent),
    lastUpdated: item.last_updated
  })) as Budget[];
}

export async function addBudgetToDb(budget: Omit<Budget, 'id' | 'spent' | 'lastUpdated'>) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('budgets')
    .insert({
      category_id: budget.categoryId,
      amount: budget.amount,
      month: budget.month,
      user_id: userId
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding budget:', error);
    throw error;
  }

  return data;
}

export async function updateBudgetInDb(id: string, budget: Partial<Omit<Budget, 'id' | 'spent' | 'lastUpdated'>>) {
  const updateData: any = {};
  
  if (budget.categoryId) updateData.category_id = budget.categoryId;
  if (budget.amount) updateData.amount = budget.amount;
  if (budget.month) updateData.month = budget.month;
  
  const { error } = await supabase
    .from('budgets')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error updating budget:', error);
    throw error;
  }
}

export async function updateBudgetSpentInDb(id: string, spent: number) {
  const { error } = await supabase
    .from('budgets')
    .update({
      spent,
      last_updated: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating budget spent:', error);
    throw error;
  }
}

export async function deleteBudgetFromDb(id: string) {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting budget:', error);
    throw error;
  }
}

// Financial Goals
export async function fetchFinancialGoals() {
  const { data, error } = await supabase
    .from('financial_goals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching financial goals:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    targetAmount: Number(item.target_amount),
    currentAmount: Number(item.current_amount),
    targetDate: item.target_date || undefined,
    startDate: item.start_date,
    iconName: item.icon_name,
    color: item.color || undefined,
    status: item.status as 'active' | 'completed' | 'cancelled',
    description: item.description || undefined
  })) as FinancialGoal[];
}

export async function addFinancialGoalToDb(goal: Omit<FinancialGoal, 'id'>) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('financial_goals')
    .insert({
      name: goal.name,
      target_amount: goal.targetAmount,
      current_amount: goal.currentAmount,
      target_date: goal.targetDate || null,
      start_date: goal.startDate,
      icon_name: goal.iconName,
      color: goal.color || null,
      status: goal.status,
      description: goal.description || null,
      user_id: userId
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding financial goal:', error);
    throw error;
  }

  return data;
}

export async function updateFinancialGoalInDb(id: string, goal: Partial<Omit<FinancialGoal, 'id'>>) {
  const updateData: any = {};
  
  if (goal.name) updateData.name = goal.name;
  if (goal.targetAmount) updateData.target_amount = goal.targetAmount;
  if (goal.currentAmount !== undefined) updateData.current_amount = goal.currentAmount;
  if (goal.targetDate !== undefined) updateData.target_date = goal.targetDate || null;
  if (goal.startDate) updateData.start_date = goal.startDate;
  if (goal.iconName) updateData.icon_name = goal.iconName;
  if (goal.color !== undefined) updateData.color = goal.color || null;
  if (goal.status) updateData.status = goal.status;
  if (goal.description !== undefined) updateData.description = goal.description || null;
  
  const { error } = await supabase
    .from('financial_goals')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error updating financial goal:', error);
    throw error;
  }
}

export async function deleteFinancialGoalFromDb(id: string) {
  const { error } = await supabase
    .from('financial_goals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting financial goal:', error);
    throw error;
  }
}

export async function getUserProfile() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', session.user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}
