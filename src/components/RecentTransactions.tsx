
import React from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { Link } from 'react-router-dom';
import { TransactionItem } from './TransactionItem';

export const RecentTransactions = () => {
  const { transactions } = useTransactions();
  
  // Get only the 5 most recent transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-finance-text">Transações recentes</h2>
        <Link to="/transactions" className="text-sm text-finance-primary">
          Ver todas
        </Link>
      </div>
      
      <div className="bg-white rounded-2xl p-4 shadow-md">
        {recentTransactions.length > 0 ? (
          <div className="space-y-2">
            {recentTransactions.map(transaction => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-500">
            Nenhuma transação registrada ainda
          </div>
        )}
      </div>
    </div>
  );
};
