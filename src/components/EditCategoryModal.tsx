
import React, { useState, useEffect } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { CategoryType, TransactionType } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Edit } from "lucide-react";

// Lista de emojis para categorias
const EMOJIS = [
  '🍔', '🏠', '🚗', '👕', '💊', '🎮', '✈️', '📝', '💰', '💼',
  '🎁', '🔄', '🍕', '🏋️', '💄', '📚', '🎬', '💻', '📱', '🛒',
  '🐶', '💅', '🚌', '🚲', '🏥', '💈', '🧾', '💸', '🏦', '👶',
  '🎓', '🧹', '🛌', '📺', '🔌', '📊', '💡', '🚿', '🧺', '🍷',
];

// Lista de cores para categorias
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9A826', '#6BCB77', 
  '#9B87F5', '#FF85B3', '#D685FF', '#5D5FEF', '#FF9F1C',
  '#A5D7E8', '#E78EA9', '#7ED7C1', '#B983FF', '#F79D65',
];

type EditCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryType;
};

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ 
  isOpen, 
  onClose, 
  category 
}) => {
  const { editCategory } = useTransactions();
  
  const [name, setName] = useState(category.name);
  const [icon, setIcon] = useState(category.icon);
  const [type, setType] = useState<TransactionType>(category.type);
  const [color, setColor] = useState(category.color || '#FF6B6B');
  const [nameError, setNameError] = useState('');

  // Reset form when modal opens or category changes
  useEffect(() => {
    if (isOpen) {
      setName(category.name);
      setIcon(category.icon);
      setType(category.type);
      setColor(category.color || '#FF6B6B');
      setNameError('');
    }
  }, [isOpen, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name
    if (!name.trim()) {
      setNameError('O nome da categoria é obrigatório');
      return;
    }

    editCategory(category.id, {
      name: name.trim(),
      icon,
      type,
      color
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit size={18} />
            Editar Categoria
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome da categoria</Label>
              <Input 
                id="edit-name" 
                value={name} 
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError('');
                }}
                placeholder="Ex: Alimentação, Transporte, etc."
              />
              {nameError && <p className="text-xs text-red-500">{nameError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-type">Tipo</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as TransactionType)}
              >
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Despesa</SelectItem>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="transfer">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ícone</Label>
              <div className="grid grid-cols-10 gap-2">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={`h-8 w-8 flex items-center justify-center rounded-full text-lg
                      ${icon === emoji ? 'bg-finance-primary text-white' : 'bg-gray-100'}`}
                    onClick={() => setIcon(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="grid grid-cols-5 gap-2">
                {COLORS.map((colorOption) => (
                  <button
                    key={colorOption}
                    type="button"
                    className={`h-8 w-8 rounded-full border-2 ${
                      color === colorOption ? 'border-finance-primary/80' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: colorOption }}
                    onClick={() => setColor(colorOption)}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Cancelar
            </Button>
            <Button type="submit" className="bg-finance-primary hover:bg-finance-primary/90">
              Salvar alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
