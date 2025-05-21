
import React, { useState } from 'react';
import { BalanceCard } from '../components/BalanceCard';
import { QuickActions } from '../components/QuickActions';
import { MonthSummary } from '../components/MonthSummary';
import { RecentTransactions } from '../components/RecentTransactions';
import { BottomNavigation } from '../components/BottomNavigation';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { Plus } from 'lucide-react';
import { TransactionType } from '../types';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');

  const handleAddTransaction = (type: TransactionType) => {
    setTransactionType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-finance-backgroundAlt pb-16">
      <div className="container px-4 py-6 max-w-md mx-auto">
        <header className="mb-4">
          <h1 className="text-xl font-semibold text-finance-text">Olá, Usuário</h1>
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
          className="fab"
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
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Index;
