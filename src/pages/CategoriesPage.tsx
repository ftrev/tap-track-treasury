
import React, { useState } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { Layout } from '../components/Layout';
import { CategoryItem } from '../components/CategoryItem';
import { CategoryType, TransactionType } from '../types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AddCategoryModal } from '../components/AddCategoryModal';
import { Button } from "@/components/ui/button";
import { Plus, Tag, Folder } from "lucide-react";

const CategoriesPage: React.FC = () => {
  const { categories, getCategoriesByType } = useTransactions();
  const [activeTab, setActiveTab] = useState<TransactionType>('expense');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredCategories = getCategoriesByType(activeTab);

  return (
    <Layout title="Categorias">
      <div className="pb-20">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Tag size={20} />
            <span>Gerenciamento de Categorias</span>
          </h1>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-finance-primary hover:bg-finance-primary/90 text-white"
            size="sm"
          >
            <Plus size={16} className="mr-1" />
            Nova Categoria
          </Button>
        </div>

        <Tabs defaultValue="expense" className="mb-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger 
              value="expense" 
              onClick={() => setActiveTab('expense')}
              className={activeTab === 'expense' ? "text-finance-alert" : ""}
            >
              Despesas
            </TabsTrigger>
            <TabsTrigger 
              value="income" 
              onClick={() => setActiveTab('income')}
              className={activeTab === 'income' ? "text-finance-secondary" : ""}
            >
              Receitas
            </TabsTrigger>
            <TabsTrigger 
              value="transfer" 
              onClick={() => setActiveTab('transfer')}
              className={activeTab === 'transfer' ? "text-finance-primary" : ""}
            >
              Transferências
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expense" className="space-y-2">
            {filteredCategories.length > 0 ? (
              filteredCategories.map(category => (
                <CategoryItem key={category.id} category={category} />
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 flex flex-col items-center">
                <Folder className="mb-2" size={32} />
                <p>Nenhuma categoria de despesa encontrada</p>
                <Button 
                  variant="link" 
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-finance-primary mt-2"
                >
                  Adicionar categoria
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="income" className="space-y-2">
            {getCategoriesByType('income').length > 0 ? (
              getCategoriesByType('income').map(category => (
                <CategoryItem key={category.id} category={category} />
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 flex flex-col items-center">
                <Folder className="mb-2" size={32} />
                <p>Nenhuma categoria de receita encontrada</p>
                <Button 
                  variant="link" 
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-finance-primary mt-2"
                >
                  Adicionar categoria
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="transfer" className="space-y-2">
            {getCategoriesByType('transfer').length > 0 ? (
              getCategoriesByType('transfer').map(category => (
                <CategoryItem key={category.id} category={category} />
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 flex flex-col items-center">
                <Folder className="mb-2" size={32} />
                <p>Nenhuma categoria de transferência encontrada</p>
                <Button 
                  variant="link" 
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-finance-primary mt-2"
                >
                  Adicionar categoria
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AddCategoryModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        initialType={activeTab}
      />
    </Layout>
  );
};

export default CategoriesPage;
