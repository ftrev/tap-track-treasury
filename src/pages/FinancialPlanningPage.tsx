
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { FinancialPlanForm } from '../components/FinancialPlanForm';
import { ContributeGoalModal } from '../components/ContributeGoalModal';
import { FinancialPlanTabs } from '../components/FinancialPlanTabs';
import { useTransactions } from '../contexts/TransactionContext';
import { FinancialGoal } from '../types';
import { PlusCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
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
import { useToast } from '../hooks/use-toast';

const FinancialPlanningPage = () => {
  const { financialGoals, deleteFinancialGoal, contributeToGoal } = useTransactions();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | undefined>(undefined);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  // Separar por prazo (baseado na diferença de meses até a data alvo)
  const getTimeframeGoals = (months: number[]) => {
    return financialGoals
      .filter(goal => {
        if (!goal.targetDate || goal.status !== 'active') return false;
        
        const today = new Date();
        const targetDate = new Date(goal.targetDate);
        const diffMonths = (targetDate.getFullYear() - today.getFullYear()) * 12 + 
                           (targetDate.getMonth() - today.getMonth());
        
        return months[0] <= diffMonths && diffMonths <= months[1];
      });
  };

  const shortTermGoals = getTimeframeGoals([0, 3]);
  const mediumTermGoals = getTimeframeGoals([4, 12]);
  const longTermGoals = getTimeframeGoals([13, 1000]);

  const handleEditGoal = (goal: FinancialGoal) => {
    // Redirecionar para a página de metas para edição
    window.location.href = `/goals?edit=${goal.id}`;
  };

  const handleDeleteGoal = (id: string) => {
    setGoalToDelete(id);
  };

  const confirmDeleteGoal = () => {
    if (goalToDelete) {
      deleteFinancialGoal(goalToDelete);
      setGoalToDelete(null);
      toast({
        title: "Plano excluído",
        description: "O plano financeiro foi removido com sucesso."
      });
    }
  };

  const handleContributeToGoal = (goal: FinancialGoal) => {
    setSelectedGoal(goal);
    setIsContributeModalOpen(true);
  };

  const handlePlanCreated = () => {
    setShowForm(false);
    toast({
      title: "Plano financeiro criado",
      description: "Seu plano financeiro foi criado com sucesso."
    });
  };

  return (
    <Layout title="Planejamento Financeiro">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">Planejamento Financeiro</h1>
        <Button 
          variant={showForm ? "outline" : "default"}
          onClick={() => setShowForm(!showForm)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {showForm ? "Cancelar" : "Novo Plano"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 animate-in fade-in-50">
          <CardHeader>
            <CardTitle>Criar novo plano financeiro</CardTitle>
            <CardDescription>
              Defina suas metas financeiras e acompanhe seu progresso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialPlanForm onPlanCreated={handlePlanCreated} />
          </CardContent>
        </Card>
      )}

      <FinancialPlanTabs 
        shortTermGoals={shortTermGoals}
        mediumTermGoals={mediumTermGoals}
        longTermGoals={longTermGoals}
        onEditGoal={handleEditGoal}
        onDeleteGoal={handleDeleteGoal}
        onContributeToGoal={handleContributeToGoal}
        onShowForm={() => setShowForm(true)}
        showForm={showForm}
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
            <AlertDialogTitle>Excluir plano</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este plano financeiro? Esta ação não pode ser desfeita.
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

export default FinancialPlanningPage;
