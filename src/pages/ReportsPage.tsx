import React, { useState } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { formatCurrency } from '../lib/utils';
import { BottomNavigation } from '../components/BottomNavigation';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, ResponsiveContainer, Cell, LabelList, PieChart, 
  Pie, LineChart, Line, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { format, subMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COLORS = ['#FF7F50', '#1EBBD7', '#42D392', '#FFB74D', '#9C27B0', '#3F51B5'];

const ReportsPage = () => {
  const { transactions, categories } = useTransactions();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month');
  
  // Filtra transações pelo período selecionado
  const getFilteredTransactions = () => {
    const today = new Date();
    const startDate = selectedPeriod === 'month' 
      ? subMonths(today, 1) 
      : subMonths(today, 12);
    
    return transactions.filter(t => {
      const transactionDate = parseISO(t.date);
      return transactionDate >= startDate;
    });
  };
  
  const filteredTransactions = getFilteredTransactions();
  
  // GRÁFICO 1: Despesas por categoria
  const expenseByCategory = categories
    .filter(cat => cat.type === 'expense')
    .map(category => {
      const totalAmount = filteredTransactions
        .filter(t => t.type === 'expense' && t.category.id === category.id)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: category.name,
        icon: category.icon,
        amount: totalAmount,
        color: category.color || COLORS[Math.floor(Math.random() * COLORS.length)]
      };
    })
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  
  // GRÁFICO 2: Evolução de receitas e despesas por mês
  const getLast6Months = () => {
    const result = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = subMonths(today, i);
      const monthStr = format(month, 'yyyy-MM');
      
      // Calcular receitas do mês
      const incomeAmount = transactions
        .filter(t => t.type === 'income' && t.date.startsWith(monthStr))
        .reduce((sum, t) => sum + t.amount, 0);
        
      // Calcular despesas do mês
      const expenseAmount = transactions
        .filter(t => t.type === 'expense' && t.date.startsWith(monthStr))
        .reduce((sum, t) => sum + t.amount, 0);
        
      result.push({
        name: format(month, 'MMM', { locale: ptBR }),
        receitas: incomeAmount,
        despesas: expenseAmount,
        saldo: incomeAmount - expenseAmount
      });
    }
    
    return result;
  };
  
  const monthlyData = getLast6Months();
  
  // GRÁFICO 3: Distribuição de despesas por dia no mês atual
  const getCurrentMonthDailyExpenses = () => {
    const today = new Date();
    const currentMonth = format(today, 'yyyy-MM');
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    
    // Inicializar array com todos os dias do mês
    const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return {
        day: day,
        value: 0
      };
    });
    
    // Preencher com gastos reais
    transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
      .forEach(t => {
        const day = parseInt(t.date.split('-')[2]);
        if (day > 0 && day <= daysInMonth) {
          dailyData[day - 1].value += t.amount;
        }
      });
      
    return dailyData;
  };
  
  const dailyExpensesData = getCurrentMonthDailyExpenses();
  
  // Calcular total de despesas para o gráfico de categorias
  const totalExpenses = expenseByCategory.reduce((sum, item) => sum + item.amount, 0);
  
  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="container px-4 py-6 max-w-md mx-auto">
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="mr-2 p-1"
              aria-label="Voltar"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-semibold">Relatórios</h1>
          </div>
          <div>
            <select 
              className="bg-muted text-sm p-1 rounded-md"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as 'month' | 'year')}
            >
              <option value="month">Último mês</option>
              <option value="year">Último ano</option>
            </select>
          </div>
        </header>
        
        <Tabs defaultValue="expenses" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="expenses" className="w-1/3">Despesas</TabsTrigger>
            <TabsTrigger value="evolution" className="w-1/3">Evolução</TabsTrigger>
            <TabsTrigger value="daily" className="w-1/3">Diário</TabsTrigger>
          </TabsList>
          
          <TabsContent value="expenses" className="animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-4">
              <h2 className="text-base font-medium mb-3">Despesas por categoria</h2>
              
              {expenseByCategory.length > 0 ? (
                <>
                  <div className="w-full h-52 mb-4">
                    <ChartContainer 
                      config={{
                        income: { theme: { light: '#42D392', dark: '#42D392' } },
                        expense: { theme: { light: '#FF7F50', dark: '#FF7F50' } }
                      }}
                    >
                      <PieChart>
                        <Pie
                          data={expenseByCategory}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="amount"
                          nameKey="name"
                        >
                          {expenseByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ payload }) => {
                            if (payload && payload.length > 0) {
                              const item = payload[0];
                              const value = typeof item.value === 'number' ? item.value : 0;
                              return (
                                <div className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-md border border-gray-200 dark:border-gray-700">
                                  <p className="flex items-center gap-2">
                                    <span>{item.payload.icon}</span>
                                    <span>{item.name}</span>
                                  </p>
                                  <p className="text-sm font-medium">{formatCurrency(value)}</p>
                                  <p className="text-xs text-gray-500">
                                    {Math.round((value / totalExpenses) * 100)}%
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
                  
                  <div className="space-y-3">
                    {expenseByCategory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                            style={{ backgroundColor: item.color + '20' }}
                          >
                            <span>{item.icon}</span>
                          </div>
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{formatCurrency(item.amount)}</div>
                          <div className="text-xs text-gray-500 text-right">
                            {Math.round((item.amount / totalExpenses) * 100)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  Nenhuma despesa registrada neste período
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="evolution" className="animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-4">
              <h2 className="text-base font-medium mb-3">Evolução financeira</h2>
              
              <div className="w-full h-64">
                <ChartContainer 
                  config={{
                    receitas: { theme: { light: '#42D392', dark: '#42D392' } },
                    despesas: { theme: { light: '#FF7F50', dark: '#FF7F50' } },
                    saldo: { theme: { light: '#1EBBD7', dark: '#1EBBD7' } }
                  }}
                >
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => formatCurrency(value).replace('R$', '')}
                    />
                    <Tooltip
                      content={({ payload, label }) => {
                        if (payload && payload.length > 0) {
                          return (
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-md border border-gray-200 dark:border-gray-700">
                              <p className="text-sm font-bold mb-2">{label}</p>
                              {payload.map((entry, index) => {
                                const value = typeof entry.value === 'number' ? entry.value : 0;
                                return (
                                  <div key={index} className="flex justify-between items-center mb-1">
                                    <span className="text-sm capitalize" style={{ color: entry.color }}>
                                      {entry.name}:
                                    </span>
                                    <span className="text-sm font-medium ml-4">
                                      {formatCurrency(value)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="receitas" 
                      stroke="#42D392" 
                      strokeWidth={2}
                      name="Receitas" 
                      dot={{ stroke: '#42D392', strokeWidth: 1, fill: '#42D392', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="despesas" 
                      stroke="#FF7F50" 
                      strokeWidth={2}
                      name="Despesas"
                      dot={{ stroke: '#FF7F50', strokeWidth: 1, fill: '#FF7F50', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="saldo" 
                      stroke="#1EBBD7" 
                      strokeWidth={2}
                      name="Saldo"
                      dot={{ stroke: '#1EBBD7', strokeWidth: 1, fill: '#1EBBD7', r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="daily" className="animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-4">
              <h2 className="text-base font-medium mb-3">Despesas diárias (mês atual)</h2>
              
              <div className="w-full overflow-x-auto">
                <div className="min-w-[500px] h-64">
                  <ChartContainer
                    config={{
                      value: { theme: { light: '#FF7F50', dark: '#FF7F50' } }
                    }}
                  >
                    <BarChart
                      data={dailyExpensesData}
                      margin={{ top: 10, right: 0, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fontSize: 10 }}
                        interval={2}
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => formatCurrency(value).replace('R$', '')}
                      />
                      <Tooltip
                        content={({ payload, label }) => {
                          if (payload && payload.length > 0) {
                            const value = typeof payload[0].value === 'number' ? payload[0].value : 0;
                            return (
                              <div className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-md border border-gray-200 dark:border-gray-700">
                                <p className="text-xs mb-1">Dia {label}</p>
                                <p className="text-sm font-medium">{formatCurrency(value)}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#FF7F50" 
                        radius={[4, 4, 0, 0]}
                        name="Valor"
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ReportsPage;
