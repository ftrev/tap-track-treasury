
import { useState, useEffect, useCallback } from 'react';
import { CategoryType, TransactionType } from '../types';
import { useToast } from './use-toast';
import {
  fetchCategories,
  addCategoryToDb,
  updateCategoryInDb,
  deleteCategoryFromDb
} from '../utils/supabaseUtils';
import { useAuthStatus } from './useAuthStatus';

export function useCategoriesData() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isAuthenticated } = useAuthStatus();

  // Fetch categories from Supabase
  const loadCategories = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast({
        title: "Erro ao carregar categorias",
        description: "Não foi possível carregar suas categorias.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, toast]);

  // Load categories on mount and when auth state changes
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Get categories by type
  const getCategoriesByType = useCallback((type: TransactionType): CategoryType[] => {
    return categories.filter(c => c.type === type);
  }, [categories]);

  // Add a new category
  const addCategory = useCallback(async (category: Omit<CategoryType, 'id'>) => {
    if (!isAuthenticated) return;

    try {
      const newCategory = await addCategoryToDb(category);
      setCategories(prev => [...prev, newCategory as CategoryType]);
      
      toast({
        title: "Categoria adicionada",
        description: "A categoria foi adicionada com sucesso.",
      });
    } catch (error) {
      console.error('Failed to add category:', error);
      toast({
        title: "Erro ao adicionar categoria",
        description: "Ocorreu um erro ao tentar adicionar a categoria.",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, toast]);

  // Edit a category
  const editCategory = useCallback(async (id: string, category: Omit<CategoryType, 'id'>) => {
    if (!isAuthenticated) return;

    try {
      await updateCategoryInDb(id, category);
      setCategories(prev => prev.map(c => c.id === id ? { ...category, id } : c));
      
      toast({
        title: "Categoria atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Failed to update category:', error);
      toast({
        title: "Erro ao atualizar categoria",
        description: "Ocorreu um erro ao tentar atualizar a categoria.",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, toast]);

  // Delete a category
  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    if (!isAuthenticated) return false;

    // TODO: Check if there are transactions using this category in Supabase
    // For now, we'll keep the client-side check
    
    try {
      await deleteCategoryFromDb(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: "Categoria removida",
        description: "A categoria foi excluída com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast({
        title: "Erro ao remover categoria",
        description: "Existem transações usando esta categoria ou ocorreu um erro ao tentar removê-la.",
        variant: "destructive"
      });
      return false;
    }
  }, [isAuthenticated, toast]);

  return {
    categories,
    isLoading,
    getCategoriesByType,
    addCategory,
    editCategory,
    deleteCategory,
    refreshCategories: loadCategories
  };
}
