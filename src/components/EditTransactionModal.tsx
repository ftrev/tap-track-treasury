
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useTransactions } from '../contexts/TransactionContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, X, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type EditTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
};

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  transaction 
}) => {
  const { editTransaction, getCategoriesByType } = useTransactions();
  const [transactionType, setTransactionType] = useState<TransactionType>(transaction.type);
  const [categories, setCategories] = useState(getCategoriesByType(transaction.type));
  const [receiptImage, setReceiptImage] = useState<string | undefined>(transaction.receiptImage);
  const [showImagePreview, setShowImagePreview] = useState<boolean>(!!transaction.receiptImage);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      amount: transaction.amount,
      description: transaction.description || '',
      category: transaction.category.id,
      date: transaction.date.split('T')[0], // Format date for input
    },
  });
  
  // Update categories when transaction type changes
  useEffect(() => {
    setCategories(getCategoriesByType(transactionType));
    // If type changes, update the category to the first one of the new type
    const newCategories = getCategoriesByType(transactionType);
    if (newCategories.length > 0 && !newCategories.some(c => c.id === form.getValues('category'))) {
      form.setValue('category', newCategories[0].id);
    }
  }, [transactionType, getCategoriesByType, form]);
  
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
  
  const onSubmit = (data: any) => {
    const selectedCategory = categories.find(c => c.id === data.category);
    
    if (!selectedCategory) {
      return;
    }
    
    editTransaction(transaction.id, {
      amount: Number(data.amount),
      type: transactionType,
      category: selectedCategory,
      description: data.description,
      date: new Date(data.date).toISOString(),
      receiptImage: receiptImage,
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={transactionType} onValueChange={(value) => setTransactionType(value as TransactionType)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="expense">Despesa</TabsTrigger>
            <TabsTrigger value="income">Receita</TabsTrigger>
            <TabsTrigger value="transfer">Transferência</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Descrição (opcional)" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-4 gap-2">
                        {categories.map((cat) => (
                          <div 
                            key={cat.id}
                            className={`p-2 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors ${
                              field.value === cat.id ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50'
                            }`}
                            onClick={() => form.setValue('category', cat.id)}
                          >
                            <div className="text-xl mb-1">{cat.icon}</div>
                            <div className="text-xs text-center truncate w-full">{cat.name}</div>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Campo para upload de imagem do recibo */}
              <div className="space-y-2">
                <FormLabel>Comprovante/Recibo</FormLabel>
                {showImagePreview && receiptImage ? (
                  <div className="relative">
                    <img 
                      src={receiptImage} 
                      alt="Recibo" 
                      className="max-h-48 w-auto mx-auto rounded border" 
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
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
