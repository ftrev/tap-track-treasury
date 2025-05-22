
import React, { useState, useEffect } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { Transaction, TransactionType, CategoryType } from '../types';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AddTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialType?: TransactionType;
};

export function AddTransactionModal({ isOpen, onClose, initialType = 'expense' }: AddTransactionModalProps) {
  const { addTransaction, getCategoriesByType } = useTransactions();
  const { toast } = useToast();
  
  // Form state
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<TransactionType>(initialType);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [receiptImage, setReceiptImage] = useState<string | undefined>(undefined);
  const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
  
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
      setReceiptImage(undefined);
      setShowImagePreview(false);
    }
  }, [isOpen, initialType]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validação de tamanho (limite de 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione uma imagem",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setReceiptImage(event.target.result.toString());
        setShowImagePreview(true);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const removeImage = () => {
    setReceiptImage(undefined);
    setShowImagePreview(false);
  };
  
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
      receiptImage: receiptImage,
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
      <DialogContent className="fixed inset-0 z-30 flex items-end justify-center sm:items-center bg-black/25 animate-fade-in p-0 border-none bg-transparent">
        <div className="bg-white w-full h-auto max-h-[90vh] rounded-t-2xl sm:rounded-2xl shadow-xl sm:max-w-md overflow-y-auto animate-slide-in">
          <div className="relative p-4 border-b">
            <h2 className="text-lg font-semibold text-center">Adicionar transação</h2>
            <button 
              onClick={onClose} 
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              aria-label="Fechar"
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
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Data</label>
              <input 
                type="date"
                className="w-full p-2 border rounded-lg"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            {/* Campo para upload de imagem do recibo */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Comprovante/Recibo (opcional)</label>
              {showImagePreview && receiptImage ? (
                <div className="relative border rounded-lg overflow-hidden">
                  <img 
                    src={receiptImage} 
                    alt="Recibo" 
                    className="max-h-48 w-auto mx-auto" 
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={removeImage}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera size={24} className="mb-1 text-gray-500" />
                      <p className="text-xs text-gray-500">
                        Clique para adicionar um recibo ou comprovante
                      </p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}
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
      </DialogContent>
    </Dialog>
  );
}
