
import React, { useState } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { CategoryType } from '../types';
import { EditCategoryModal } from './EditCategoryModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Edit, Trash2 } from "lucide-react";

type CategoryItemProps = {
  category: CategoryType;
};

export const CategoryItem: React.FC<CategoryItemProps> = ({ category }) => {
  const { deleteCategory } = useTransactions();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    deleteCategory(category.id);
    setIsDeleteDialogOpen(false);
  };

  const getTypeColor = () => {
    switch(category.type) {
      case 'expense': return 'bg-finance-alert/10 text-finance-alert border-finance-alert/20';
      case 'income': return 'bg-finance-secondary/10 text-finance-secondary border-finance-secondary/20';
      case 'transfer': return 'bg-finance-primary/10 text-finance-primary border-finance-primary/20';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <>
      <div className={`p-3 rounded-lg border flex justify-between items-center ${getTypeColor()}`}>
        <div className="flex items-center">
          <span className="text-xl mr-3">{category.icon}</span>
          <div>
            <h3 className="font-medium">{category.name}</h3>
            <span className="text-xs opacity-80">
              {category.type === 'expense' ? 'Despesa' : 
               category.type === 'income' ? 'Receita' : 'Transferência'}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="p-1 rounded-full hover:bg-black/10">
            <MoreVertical size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
              <Edit size={16} className="mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-red-600"
            >
              <Trash2 size={16} className="mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Edit Modal */}
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={category}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "{category.name}"?
              Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
