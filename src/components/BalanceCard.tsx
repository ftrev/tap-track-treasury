
import React from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { formatCurrency } from '../data/mockData';

export function BalanceCard() {
  const { balanceSummary } = useTransactions();
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 mb-4 animate-fade-in">
      <h2 className="text-lg text-finance-text/70 mb-1">Saldo atual</h2>
      <div className="text-3xl font-bold text-finance-text">
        {formatCurrency(balanceSummary.currentBalance)}
      </div>
      
      <div className="flex justify-between mt-4 text-sm">
        <div>
          <p className="text-finance-text/70">Entradas</p>
          <p className="font-medium text-finance-secondary">
            {formatCurrency(balanceSummary.totalIncome)}
          </p>
        </div>
        <div>
          <p className="text-finance-text/70">Saídas</p>
          <p className="font-medium text-finance-alert">
            {formatCurrency(balanceSummary.totalExpenses)}
          </p>
        </div>
      </div>
    </div>
  );
}
