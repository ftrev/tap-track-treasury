
import React from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { formatCurrency, formatDate } from '../data/mockData';
import { Transaction } from '../types';

type TransactionItemProps = {
  transaction: Transaction;
};

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { category, amount, description, date, type } = transaction;
  
  return (
    <div className="transaction-item">
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

export function RecentTransactions() {
  const { transactions } = useTransactions();
  const recentTransactions = transactions.slice(0, 5);
  
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-medium text-finance-text">Transações recentes</h2>
        {/* <button className="text-xs text-finance-primary">Ver todas</button> */}
      </div>
      
      {recentTransactions.length > 0 ? (
        <div className="space-y-1">
          {recentTransactions.map(transaction => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-gray-500 text-sm">
          Nenhuma transação recente
        </div>
      )}
    </div>
  );
}
