
import React, { useState, useEffect } from 'react';
import { BalanceCard } from '../components/BalanceCard';
import { QuickActions } from '../components/QuickActions';
import { MonthSummary } from '../components/MonthSummary';
import { BudgetSummary } from '../components/BudgetSummary';
import { GoalsSummary } from '../components/GoalsSummary';
import { RecentTransactions } from '../components/RecentTransactions';
import { BottomNavigation } from '../components/BottomNavigation';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { UserRegistrationModal } from '../components/UserRegistrationModal';
import { Plus, LogOut } from 'lucide-react';
import { TransactionType } from '../types';
import { useTransactions } from '../contexts/TransactionContext';
import { useToast } from "../hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const { userName } = useTransactions();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if user is registered, if not, show registration modal
    // Important: Make sure we're not showing both modals at the same time
    if (!userName) {
      setTimeout(() => {
        setIsUserModalOpen(true);
        // Ensure transaction modal is closed when user modal is shown
        setIsModalOpen(false);
      }, 500);
    }
  }, [userName]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Desconectado",
        description: "Você foi desconectado com sucesso.",
      });
      // The session change will be picked up by the auth context
    } catch (error: unknown) {
      const message = error instanceof Error
        ? error.message
        : "Ocorreu um erro ao tentar desconectar.";
      toast({
        title: "Erro ao desconectar",
        description: message,
        variant: "destructive"
      });
    }
  };

  const handleAddTransaction = (type: TransactionType) => {
    // Don't open transaction modal if user registration is not completed
    if (!userName) {
      toast({
        title: "Registro necessário",
        description: "Por favor, complete o registro para adicionar transações.",
      });
      setIsUserModalOpen(true);
      return;
    }
    
    setTransactionType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-finance-backgroundAlt dark:bg-gray-900 pb-16">
      <div className="container px-4 py-6 max-w-md mx-auto">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-finance-text dark:text-white">
            Olá, {userName || 'Visitante'}
          </h1>
          
          {userName && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center gap-1"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          )}
        </header>

        <BalanceCard />
        
        <QuickActions 
          onAddExpense={() => handleAddTransaction('expense')}
          onAddIncome={() => handleAddTransaction('income')}
          onAddTransfer={() => handleAddTransaction('transfer')}
        />
        
        <MonthSummary />
        
        <BudgetSummary />
        
        <GoalsSummary />
        
        <RecentTransactions />

        {/* Floating Action Button - ajustado para não sobrepor a navegação */}
        <button 
          className="fab bg-finance-primary hover:bg-finance-primary/90 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg fixed bottom-20 right-6"
          onClick={() => handleAddTransaction('expense')}
          aria-label="Adicionar transação"
        >
          <Plus size={24} />
        </button>
      </div>
      
      <AddTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialType={transactionType}
      />

      <UserRegistrationModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
