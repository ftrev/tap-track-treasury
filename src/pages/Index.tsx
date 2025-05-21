
import React, { useState, useEffect } from 'react';
import { BalanceCard } from '../components/BalanceCard';
import { QuickActions } from '../components/QuickActions';
import { MonthSummary } from '../components/MonthSummary';
import { RecentTransactions } from '../components/RecentTransactions';
import { BottomNavigation } from '../components/BottomNavigation';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { UserRegistrationModal } from '../components/UserRegistrationModal';
import { Plus } from 'lucide-react';
import { TransactionType } from '../types';
import { useTransactions } from '../contexts/TransactionContext';
import { useToast } from "../hooks/use-toast";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const { userName } = useTransactions();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is registered, if not, show registration modal
    if (!userName) {
      setTimeout(() => {
        setIsUserModalOpen(true);
      }, 500);
    }
  }, [userName]);

  const handleAddTransaction = (type: TransactionType) => {
    setTransactionType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-finance-backgroundAlt dark:bg-gray-900 pb-16">
      <div className="container px-4 py-6 max-w-md mx-auto">
        <header className="mb-4">
          <h1 className="text-xl font-semibold text-finance-text dark:text-white">
            Olá, {userName || 'Visitante'}
          </h1>
        </header>

        <BalanceCard />
        
        <QuickActions 
          onAddExpense={() => handleAddTransaction('expense')}
          onAddIncome={() => handleAddTransaction('income')}
          onAddTransfer={() => handleAddTransaction('transfer')}
        />
        
        <MonthSummary />
        
        <RecentTransactions />

        {/* Floating Action Button */}
        <button 
          className="fab bg-finance-primary hover:bg-finance-primary/90 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg fixed bottom-20 right-6"
          onClick={() => handleAddTransaction('expense')}
          aria-label="Adicionar transação"
        >
          <Plus size={24} />
        </button>
        
        <AddTransactionModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialType={transactionType}
        />

        <UserRegistrationModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
        />
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Index;
