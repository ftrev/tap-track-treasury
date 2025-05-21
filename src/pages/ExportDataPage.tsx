
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, FileJson, FileSpreadsheet, Filter } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { transactionsToCSV, transactionsToJSON, downloadFile } from '../utils/exportData';
import { BottomNavigation } from '../components/BottomNavigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from '@/lib/utils';

const ExportDataPage = () => {
  const navigate = useNavigate();
  const { transactions } = useTransactions();
  const [timeframe, setTimeframe] = useState<string>("all");
  const [format, setFormat] = useState<string>("csv");
  
  // Filtrar transações com base no período selecionado
  const getFilteredTransactions = () => {
    if (timeframe === "all") {
      return transactions;
    }
    
    const today = new Date();
    let startDate = new Date();
    
    switch (timeframe) {
      case "week":
        startDate.setDate(today.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "quarter":
        startDate.setMonth(today.getMonth() - 3);
        break;
      case "year":
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        return transactions;
    }
    
    return transactions.filter(t => new Date(t.date) >= startDate);
  };
  
  const handleExport = () => {
    const filteredTransactions = getFilteredTransactions();
    const currentDate = new Date().toISOString().slice(0, 10);
    
    if (format === "csv") {
      const csvContent = transactionsToCSV(filteredTransactions);
      downloadFile(csvContent, `transacoes_${currentDate}.csv`, 'text/csv;charset=utf-8;');
    } else if (format === "json") {
      const jsonContent = transactionsToJSON(filteredTransactions);
      downloadFile(jsonContent, `transacoes_${currentDate}.json`, 'application/json');
    }
  };
  
  // Determinar se existem transações a serem exportadas
  const hasTransactions = getFilteredTransactions().length > 0;

  return (
    <div className="min-h-screen bg-finance-backgroundAlt pb-16">
      <div className="container px-4 py-6 max-w-md mx-auto">
        <header className="mb-6 flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="mr-2 p-1"
            aria-label="Voltar"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-finance-text">Exportar Dados</h1>
        </header>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Exportar Transações</CardTitle>
            <CardDescription>
              Exporte suas transações para análise em outras ferramentas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Período</SelectLabel>
                    <SelectItem value="all">Todo o histórico</SelectItem>
                    <SelectItem value="week">Última semana</SelectItem>
                    <SelectItem value="month">Último mês</SelectItem>
                    <SelectItem value="quarter">Último trimestre</SelectItem>
                    <SelectItem value="year">Último ano</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Formato</label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Formato</SelectLabel>
                    <SelectItem value="csv">CSV (Excel, Planilhas)</SelectItem>
                    <SelectItem value="json">JSON (Desenvolvedores)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Transações: {getFilteredTransactions().length}
                </span>
                <span className={`${hasTransactions ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {hasTransactions ? 'Dados disponíveis' : 'Sem dados para exportar'}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={handleExport}
              disabled={!hasTransactions}
              variant={format === "csv" ? "default" : "secondary"}
            >
              {format === "csv" ? (
                <FileSpreadsheet className="mr-2" size={18} />
              ) : (
                <FileJson className="mr-2" size={18} />
              )}
              Exportar dados
            </Button>
          </CardFooter>
        </Card>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="font-medium mb-2">Dicas para exportação</h2>
          <ul className="text-sm space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="bg-blue-100 p-1 rounded-full mr-2 mt-0.5">
                <Download size={14} className="text-blue-600" />
              </span>
              <span>Formatos CSV são compatíveis com Excel, Google Sheets e outros aplicativos de planilha.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 p-1 rounded-full mr-2 mt-0.5">
                <Filter size={14} className="text-blue-600" />
              </span>
              <span>Escolha o período desejado para limitar a quantidade de dados exportados.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 p-1 rounded-full mr-2 mt-0.5">
                <FileJson size={14} className="text-blue-600" />
              </span>
              <span>O formato JSON é útil para desenvolvedores e ferramentas de análise de dados avançadas.</span>
            </li>
          </ul>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ExportDataPage;
