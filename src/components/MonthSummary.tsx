
import React from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { ChartContainer } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../lib/utils';

export function MonthSummary() {
  const { transactions } = useTransactions();
  
  // Filtramos apenas despesas do mês atual
  const currentMonth = new Date().toISOString().substring(0, 7); // formato 'YYYY-MM'
  
  // Filtramos e agrupamos por categoria
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((acc, transaction) => {
      const { category } = transaction;
      
      if (!acc[category.id]) {
        acc[category.id] = {
          name: category.name,
          icon: category.icon,
          value: 0,
          color: category.color || getRandomColor(category.id),
          id: category.id
        };
      }
      
      acc[category.id].value += transaction.amount;
      return acc;
    }, {} as Record<string, { name: string; icon: string; value: number; color: string; id: string }>);

  const chartData = Object.values(expensesByCategory).sort((a, b) => b.value - a.value);
  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0);
  
  function getRandomColor(seed: string) {
    const COLORS = ['#FF7F50', '#1EBBD7', '#42D392', '#FFB74D', '#9C27B0', '#3F51B5'];
    // Usar o hash do ID para ter uma cor consistente para a mesma categoria
    const index = Math.abs(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % COLORS.length;
    return COLORS[index];
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-md animate-fade-in">
      <h2 className="text-base font-medium mb-3 text-foreground">Resumo do mês</h2>
      
      {chartData.length > 0 ? (
        <>
          <div className="w-full h-40">
            <ChartContainer 
              config={
                chartData.reduce((config, item) => {
                  return { 
                    ...config, 
                    [item.id]: { 
                      theme: { light: item.color, dark: item.color },
                      label: item.name
                    } 
                  };
                }, {})
              }
            >
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length > 0) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-md border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <p className="text-sm">{formatCurrency(item.value)}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round((item.value / totalExpenses) * 100)}% do total
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ChartContainer>
          </div>
          
          <div className="mt-2 grid grid-cols-2 gap-2">
            {chartData.slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-6 h-6 rounded-full mr-1 flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: item.color + '20' }}
                >
                  <span className="text-xs">{item.icon}</span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs truncate">{item.name}</p>
                  <p className="text-xs font-medium">
                    {formatCurrency(item.value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {chartData.length > 4 && (
            <p className="text-xs text-center mt-2 text-gray-500">
              +{chartData.length - 4} outras categorias
            </p>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-40 text-sm text-gray-500">
          Sem despesas registradas este mês
        </div>
      )}
    </div>
  );
}
