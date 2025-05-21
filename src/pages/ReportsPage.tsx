
import React from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { formatCurrency } from '../data/mockData';
import { BottomNavigation } from '../components/BottomNavigation';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, LabelList, PieChart, Pie } from 'recharts';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReportsPage = () => {
  const { transactions, categories } = useTransactions();
  const navigate = useNavigate();
  
  // Group expenses by category
  const expenseByCategory = categories
    .filter(cat => cat.type === 'expense')
    .map(category => {
      const totalAmount = transactions
        .filter(t => t.type === 'expense' && t.category.id === category.id)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: category.name,
        icon: category.icon,
        amount: totalAmount,
      };
    })
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  
  // Calculate total expenses
  const totalExpenses = expenseByCategory.reduce((sum, item) => sum + item.amount, 0);
  
  // Generate monthly data (simplified for demo)
  const currentMonth = new Date().getMonth();
  const monthlyData = [
    { name: 'Jan', expenses: Math.random() * 2000 },
    { name: 'Fev', expenses: Math.random() * 2000 },
    { name: 'Mar', expenses: Math.random() * 2000 },
    { name: 'Abr', expenses: Math.random() * 2000 },
    { name: 'Mai', expenses: Math.random() * 2000 },
    { name: 'Jun', expenses: Math.random() * 2000 },
    { name: 'Jul', expenses: Math.random() * 2000 },
    { name: 'Ago', expenses: Math.random() * 2000 },
    { name: 'Set', expenses: Math.random() * 2000 },
    { name: 'Out', expenses: Math.random() * 2000 },
    { name: 'Nov', expenses: Math.random() * 2000 },
    { name: 'Dez', expenses: Math.random() * 2000 },
  ];
  
  // Colors for the chart
  const COLORS = ['#FF7F50', '#1EBBD7', '#42D392', '#FFB74D', '#9C27B0', '#3F51B5'];
  
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
          <h1 className="text-xl font-semibold text-finance-text">Relatórios</h1>
        </header>
        
        <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
          <h2 className="text-base font-medium mb-3 text-finance-text">Despesas por categoria</h2>
          
          {expenseByCategory.length > 0 ? (
            <>
              <div className="w-full h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="amount"
                      label={({ icon }) => icon}
                      nameKey="name"
                    >
                      {expenseByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3">
                {expenseByCategory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                        style={{ backgroundColor: COLORS[index % COLORS.length] + '20' }}
                      >
                        <span>{item.icon}</span>
                      </div>
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{formatCurrency(item.amount)}</div>
                      <div className="text-xs text-gray-500">
                        {Math.round((item.amount / totalExpenses) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-gray-500">
              Nenhuma despesa registrada
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
          <h2 className="text-base font-medium mb-3 text-finance-text">Evolução mensal</h2>
          
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
              >
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <Bar 
                  dataKey="expenses" 
                  radius={[4, 4, 0, 0]}
                >
                  {monthlyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === currentMonth ? '#1EBBD7' : '#E2E8F0'}
                    />
                  ))}
                  <LabelList 
                    dataKey="expenses" 
                    position="top" 
                    formatter={(value: number) => formatCurrency(value).replace('R$', '')} 
                    style={{ fontSize: 10 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ReportsPage;
