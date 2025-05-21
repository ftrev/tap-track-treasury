
import React, { useState } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { formatCurrency, formatDate, groupTransactionsByDate } from '../data/mockData';
import { BottomNavigation } from '../components/BottomNavigation';
import { Transaction } from '../types';
import { ChevronLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TransactionsPage = () => {
  const { transactions } = useTransactions();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter transactions based on search
  const filteredTransactions = searchTerm 
    ? transactions.filter(t => 
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : transactions;
  
  // Group transactions by date
  const groupedTransactions = groupTransactionsByDate(filteredTransactions);
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  const renderTransactionItem = (transaction: Transaction) => {
    const { category, amount, description, date, type } = transaction;
    
    return (
      <div key={transaction.id} className="transaction-item">
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
        <div className={`font-semibold ${
          type === 'expense' ? 'text-finance-alert' : 
          type === 'income' ? 'text-finance-secondary' : 'text-finance-primary'
        }`}>
          {type === 'expense' ? '-' : type === 'income' ? '+' : ''}{formatCurrency(amount)}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-finance-backgroundAlt pb-16">
      <div className="container px-4 py-6 max-w-md mx-auto">
        <header className="mb-4 flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="mr-2 p-1"
            aria-label="Voltar"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-finance-text">Histórico de Transações</h1>
        </header>
        
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-finance-primary focus:ring-1 focus:ring-finance-primary"
            placeholder="Buscar transações"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-md">
          {sortedDates.length > 0 ? (
            sortedDates.map(date => (
              <div key={date} className="mb-4">
                <div className="text-sm font-medium text-gray-500 mb-2">
                  {new Date(date).toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long'
                  })}
                </div>
                
                <div className="space-y-2">
                  {groupedTransactions[date].map(transaction => 
                    renderTransactionItem(transaction)
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              {searchTerm ? 'Nenhuma transação encontrada' : 'Nenhuma transação registrada'}
            </div>
          )}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default TransactionsPage;
