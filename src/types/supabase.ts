
import { Database } from '../integrations/supabase/types';

// Export types from the generated Database type
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Budget = Database['public']['Tables']['budgets']['Row'];
export type FinancialGoal = Database['public']['Tables']['financial_goals']['Row'];

// Helper types for insert operations
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
export type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];
export type FinancialGoalInsert = Database['public']['Tables']['financial_goals']['Insert'];

// Helper types for frontend
export type TransactionWithCategory = Transaction & {
  category: Category | null;
};
