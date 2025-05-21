
import React, { useState, useEffect } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { TransactionType } from '../types';
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
import { Tag } from "lucide-react";

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

type AddCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialType?: TransactionType;
};

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ 
  isOpen, 
  onClose, 
  initialType = 'expense' 
}) => {
  const { addCategory } = useTransactions();
  
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🍔');
  const [type, setType] = useState<TransactionType>(initialType);
  const [color, setColor] = useState('#FF6B6B');
  const [nameError, setNameError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setIcon('🍔');
      setType(initialType);
      setColor('#FF6B6B');
      setNameError('');
    }
  }, [isOpen, initialType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name
    if (!name.trim()) {
      setNameError('O nome da categoria é obrigatório');
      return;
    }

    addCategory({
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
            <Tag size={18} />
            Nova Categoria
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da categoria</Label>
              <Input 
                id="name" 
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
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as TransactionType)}
              >
                <SelectTrigger>
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
              Salvar categoria
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
