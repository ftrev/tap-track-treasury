
import React from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

export function MonthSummary() {
  const { transactions } = useTransactions();
  
  // Filter only expenses and group by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const { category } = transaction;
      
      if (!acc[category.id]) {
        acc[category.id] = {
          name: category.name,
          icon: category.icon,
          value: 0,
        };
      }
      
      acc[category.id].value += transaction.amount;
      return acc;
    }, {} as Record<string, { name: string; icon: string; value: number }>);

  const chartData = Object.values(expensesByCategory);

  // Colors for the chart
  const COLORS = ['#FF7F50', '#1EBBD7', '#42D392', '#FFB74D', '#9C27B0', '#3F51B5'];
  
  return (
    <div className="bg-white rounded-2xl p-4 mb-4 shadow-md animate-fade-in">
      <h2 className="text-base font-medium mb-3 text-finance-text">Resumo do mês</h2>
      
      {chartData.length > 0 ? (
        <div className="w-full h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
                label={({ icon }) => icon}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom"
                formatter={(value) => <span className="text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 text-sm text-gray-500">
          Sem despesas registradas este mês
        </div>
      )}
    </div>
  );
}
