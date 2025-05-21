
import React, { useState, useEffect } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { Transaction, TransactionType, CategoryType } from '../types';
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type AddTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialType?: TransactionType;
};

export function AddTransactionModal({ isOpen, onClose, initialType = 'expense' }: AddTransactionModalProps) {
  const { addTransaction, getCategoriesByType } = useTransactions();
  
  // Form state
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<TransactionType>(initialType);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  
  // Update categories when type changes
  useEffect(() => {
    const typeCategories = getCategoriesByType(type);
    setCategories(typeCategories);
    setSelectedCategory(null); // Reset selected category
  }, [type, getCategoriesByType]);
  
  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setAmount('');
      setDescription('');
      setSelectedCategory(null);
    }
  }, [isOpen, initialType]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !selectedCategory) return;
    
    const numericAmount = parseFloat(amount.replace(',', '.'));
    
    if (isNaN(numericAmount)) return;
    
    const newTransaction: Omit<Transaction, 'id'> = {
      amount: numericAmount,
      type,
      category: selectedCategory,
      description: description.trim() || selectedCategory.name,
      date: new Date().toISOString(),
    };
    
    addTransaction(newTransaction);
    onClose();
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal separator
    const value = e.target.value.replace(/[^\d,]/g, '');
    setAmount(value);
  };
  
  const getTabClass = (tabType: TransactionType) => {
    const baseClass = "flex-1 py-2 text-center text-sm font-medium rounded-t-lg";
    const activeClass = type === tabType ? 
      (tabType === 'expense' ? "bg-finance-alert text-white" : 
       tabType === 'income' ? "bg-finance-secondary text-white" : 
       "bg-finance-primary text-white") :
      "bg-gray-100 text-gray-500";
    return `${baseClass} ${activeClass}`;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-30 flex items-end justify-center sm:items-center bg-black/25 animate-fade-in">
        <div className="bg-white w-full h-auto max-h-[90vh] rounded-t-2xl sm:rounded-2xl shadow-xl sm:max-w-md overflow-y-auto animate-slide-in">
          <div className="relative p-4 border-b">
            <h2 className="text-lg font-semibold text-center">Adicionar transação</h2>
            <button 
              onClick={onClose} 
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex mb-4">
            <button 
              className={getTabClass('expense')}
              onClick={() => setType('expense')}
            >
              Despesa
            </button>
            <button 
              className={getTabClass('income')}
              onClick={() => setType('income')}
            >
              Receita
            </button>
            <button 
              className={getTabClass('transfer')}
              onClick={() => setType('transfer')}
            >
              Transferência
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-6">
              <div className="flex items-center mb-1">
                <span className="text-2xl mr-2">R$</span>
                <input
                  type="text"
                  className="input-amount"
                  placeholder="0,00"
                  value={amount}
                  onChange={handleAmountChange}
                  autoFocus
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Categoria</label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map(category => (
                  <div 
                    key={category.id}
                    className={`category-icon ${selectedCategory?.id === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <span className="text-xl mb-1">{category.icon}</span>
                    <span className="text-xs text-center">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Descrição (opcional)</label>
              <input 
                type="text"
                className="w-full p-2 border rounded-lg focus:ring-finance-primary focus:border-finance-primary"
                placeholder="Ex: Almoço, Supermercado, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Data</label>
              <input 
                type="date"
                className="w-full p-2 border rounded-lg"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full py-3 bg-finance-primary hover:bg-finance-primary/90 text-white font-medium rounded-lg"
              disabled={!amount || !selectedCategory}
            >
              Salvar transação
            </Button>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
