
import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../data/mockData';
import { Trash2, Edit, Image } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { EditTransactionModal } from './EditTransactionModal';
import { Dialog, DialogContent } from "@/components/ui/dialog";

type TransactionItemProps = {
  transaction: Transaction;
};

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { deleteTransaction } = useTransactions();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  
  const { category, amount, description, date, type, receiptImage } = transaction;

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="transaction-item flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: type === 'expense' ? '#FFEBE5' : 
                                      type === 'income' ? '#E3F9ED' : '#E1F5FA' }}>
            <span className="text-lg">{category.icon}</span>
          </div>
          <div>
            <div className="font-medium text-finance-text">{description || category.name}</div>
            <div className="text-xs text-gray-500">{formatDate(date)}</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className={`mr-4 font-semibold ${
            type === 'expense' ? 'text-finance-alert' : 
            type === 'income' ? 'text-finance-secondary' : 'text-finance-primary'
          }`}>
            {type === 'expense' ? '-' : type === 'income' ? '+' : ''}{formatCurrency(amount)}
          </div>
          <div className="flex">
            {receiptImage && (
              <button 
                onClick={() => setIsImagePreviewOpen(true)}
                className="p-1.5 mr-1 hover:bg-gray-100 rounded-full"
                aria-label="Ver recibo"
              >
                <Image size={16} className="text-gray-500" />
              </button>
            )}
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="p-1.5 mr-1 hover:bg-gray-100 rounded-full"
              aria-label="Editar"
            >
              <Edit size={16} className="text-gray-500" />
            </button>
            <button 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="p-1.5 hover:bg-gray-100 rounded-full"
              aria-label="Excluir"
            >
              <Trash2 size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-finance-alert text-white hover:bg-finance-alert/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Edit Transaction Modal */}
      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        transaction={transaction}
      />
      
      {/* Image Preview Dialog */}
      {receiptImage && (
        <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
          <DialogContent className="max-w-md p-1 sm:p-2">
            <div className="overflow-auto max-h-[80vh]">
              <img 
                src={receiptImage} 
                alt="Recibo" 
                className="w-full h-auto object-contain" 
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
