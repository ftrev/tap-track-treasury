
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { GoalItem } from '../components/GoalItem';
import { GoalFormModal } from '../components/GoalFormModal';
import { ContributeGoalModal } from '../components/ContributeGoalModal';
import { useTransactions } from '../contexts/TransactionContext';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import { FinancialGoal } from '../types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';

const GoalsPage = () => {
  const { 
    financialGoals,
    addFinancialGoal,
    updateFinancialGoal,
    deleteFinancialGoal,
    contributeToGoal
  } = useTransactions();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | undefined>(undefined);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('active');

  const activeGoals = financialGoals.filter(goal => goal.status === 'active');
  const completedGoals = financialGoals.filter(goal => goal.status === 'completed');
  const cancelledGoals = financialGoals.filter(goal => goal.status === 'cancelled');

  const handleAddGoal = () => {
    setSelectedGoal(undefined);
    setIsModalOpen(true);
  };

  const handleEditGoal = (goal: FinancialGoal) => {
    setSelectedGoal(goal);
    setIsModalOpen(true);
  };

  const handleDeleteGoal = (id: string) => {
    setGoalToDelete(id);
  };

  const handleContributeToGoal = (goal: FinancialGoal) => {
    setSelectedGoal(goal);
    setIsContributeModalOpen(true);
  };

  const handleSaveGoal = (goalData: Omit<FinancialGoal, 'id'>) => {
    if (selectedGoal) {
      updateFinancialGoal(selectedGoal.id, goalData);
    } else {
      addFinancialGoal(goalData);
    }
  };

  const confirmDeleteGoal = () => {
    if (goalToDelete) {
      deleteFinancialGoal(goalToDelete);
      setGoalToDelete(null);
    }
  };

  return (
    <Layout title="Metas Financeiras">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Minhas Metas</h1>
        <Button onClick={handleAddGoal} className="gap-1 items-center">
          <Plus size={16} />
          Nova Meta
        </Button>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="active" className="flex-1">
            Ativas {activeGoals.length > 0 && <span className="ml-1 text-xs bg-blue-100 text-blue-700 rounded-full px-2">{activeGoals.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">
            Concluídas {completedGoals.length > 0 && <span className="ml-1 text-xs bg-emerald-100 text-emerald-700 rounded-full px-2">{completedGoals.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex-1">
            Canceladas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeGoals.length > 0 ? (
            <div className="space-y-4">
              {activeGoals.map(goal => (
                <GoalItem
                  key={goal.id}
                  goal={goal}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                  onContribute={handleContributeToGoal}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>Você não tem metas ativas no momento.</p>
              <Button 
                variant="outline" 
                onClick={handleAddGoal}
                className="mt-4"
              >
                Criar uma nova meta
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedGoals.length > 0 ? (
            <div className="space-y-4">
              {completedGoals.map(goal => (
                <GoalItem
                  key={goal.id}
                  goal={goal}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                  onContribute={handleContributeToGoal}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>Você ainda não concluiu nenhuma meta.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {cancelledGoals.length > 0 ? (
            <div className="space-y-4">
              {cancelledGoals.map(goal => (
                <GoalItem
                  key={goal.id}
                  goal={goal}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                  onContribute={handleContributeToGoal}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>Você não tem metas canceladas.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <GoalFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goalToEdit={selectedGoal}
        onSave={handleSaveGoal}
      />

      <ContributeGoalModal
        isOpen={isContributeModalOpen}
        onClose={() => setIsContributeModalOpen(false)}
        goal={selectedGoal}
        onContribute={contributeToGoal}
      />

      <AlertDialog open={!!goalToDelete} onOpenChange={() => setGoalToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir meta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta meta financeira? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteGoal}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default GoalsPage;
