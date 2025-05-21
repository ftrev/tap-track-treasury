
import { Transaction } from "../types";
import { formatDate } from "../data/mockData";

/**
 * Converte transações para formato CSV
 * @param transactions Lista de transações para exportar
 * @returns String em formato CSV
 */
export const transactionsToCSV = (transactions: Transaction[]): string => {
  // Cabeçalho do CSV
  const headers = ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor'];
  const csvContent = [headers.join(',')];
  
  // Dados das transações
  transactions.forEach((transaction) => {
    const { date, type, category, description, amount } = transaction;
    
    // Formatação dos dados
    const formattedDate = formatDate(date);
    const formattedType = type === 'income' ? 'Receita' : 
                         type === 'expense' ? 'Despesa' : 'Transferência';
    const formattedAmount = amount.toFixed(2).replace('.', ',');
    
    // Escape para campos que podem conter vírgulas
    const escapedDescription = description ? `"${description.replace(/"/g, '""')}"` : '""';
    const escapedCategory = `"${category.name.replace(/"/g, '""')}"`;
    
    // Linha do CSV
    const row = [
      formattedDate,
      formattedType,
      escapedCategory,
      escapedDescription,
      formattedAmount
    ].join(',');
    
    csvContent.push(row);
  });
  
  return csvContent.join('\n');
};

/**
 * Converte transações para formato JSON
 * @param transactions Lista de transações para exportar
 * @returns String em formato JSON formatado
 */
export const transactionsToJSON = (transactions: Transaction[]): string => {
  // Preparar dados para exportação em JSON (omitindo informações desnecessárias)
  const exportData = transactions.map(transaction => ({
    id: transaction.id,
    date: transaction.date,
    type: transaction.type,
    categoryName: transaction.category.name,
    categoryIcon: transaction.category.icon,
    description: transaction.description || '',
    amount: transaction.amount,
  }));
  
  return JSON.stringify(exportData, null, 2);
};

/**
 * Faz o download de um arquivo com o conteúdo especificado
 * @param content Conteúdo do arquivo
 * @param fileName Nome do arquivo
 * @param contentType Tipo MIME do conteúdo
 */
export const downloadFile = (content: string, fileName: string, contentType: string): void => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  
  // Simular um clique para iniciar o download
  document.body.appendChild(link);
  link.click();
  
  // Limpeza
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
