
import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "../hooks/use-toast";
import { useTransactions } from '../contexts/TransactionContext';

type UserRegistrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function UserRegistrationModal({ isOpen, onClose }: UserRegistrationModalProps) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const { setUserName } = useTransactions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome para continuar.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call - in the future, this would be an actual API call
    setTimeout(() => {
      // Store in localStorage for persistence
      localStorage.setItem('financeApp_user', JSON.stringify({ name, email }));
      
      // Update global state
      setUserName(name);
      
      setIsLoading(false);
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao app de controle financeiro.",
      });
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-finance-text flex items-center justify-between">
            <span>Criar conta</span>
            <button 
              className="text-gray-500 hover:text-gray-700" 
              onClick={onClose}
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email" 
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-finance-primary hover:bg-finance-primary/90"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
