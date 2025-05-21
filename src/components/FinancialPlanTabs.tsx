
import React from 'react';
import { GoalItem } from './GoalItem';
import { FinancialGoal } from '../types';
import { Button } from './ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';

interface FinancialPlanTabsProps {
  shortTermGoals: FinancialGoal[];
  mediumTermGoals: FinancialGoal[];
  longTermGoals: FinancialGoal[];
  onEditGoal: (goal: FinancialGoal) => void;
  onDeleteGoal: (id: string) => void;
  onContributeToGoal: (goal: FinancialGoal) => void;
  onShowForm: () => void;
  showForm: boolean;
}

export function FinancialPlanTabs({
  shortTermGoals,
  mediumTermGoals,
  longTermGoals,
  onEditGoal,
  onDeleteGoal,
  onContributeToGoal,
  onShowForm,
  showForm
}: FinancialPlanTabsProps) {
  return (
    <Tabs defaultValue="short" className="w-full">
      <TabsList className="mb-4 grid grid-cols-3 w-full">
        <TabsTrigger value="short" className="flex-1">
          Curto prazo {shortTermGoals.length > 0 && <span className="ml-1 text-xs bg-blue-100 text-blue-700 rounded-full px-2">{shortTermGoals.length}</span>}
        </TabsTrigger>
        <TabsTrigger value="medium" className="flex-1">
          Médio prazo {mediumTermGoals.length > 0 && <span className="ml-1 text-xs bg-blue-100 text-blue-700 rounded-full px-2">{mediumTermGoals.length}</span>}
        </TabsTrigger>
        <TabsTrigger value="long" className="flex-1">
          Longo prazo {longTermGoals.length > 0 && <span className="ml-1 text-xs bg-blue-100 text-blue-700 rounded-full px-2">{longTermGoals.length}</span>}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="short">
        {shortTermGoals.length > 0 ? (
          <div className="space-y-4">
            {shortTermGoals.map(goal => (
              <GoalItem
                key={goal.id}
                goal={goal}
                onEdit={onEditGoal}
                onDelete={onDeleteGoal}
                onContribute={onContributeToGoal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>Você não tem planos de curto prazo.</p>
            {!showForm && (
              <Button 
                variant="outline" 
                onClick={onShowForm}
                className="mt-4"
              >
                Criar um plano de curto prazo
              </Button>
            )}
          </div>
        )}
      </TabsContent>

      <TabsContent value="medium">
        {mediumTermGoals.length > 0 ? (
          <div className="space-y-4">
            {mediumTermGoals.map(goal => (
              <GoalItem
                key={goal.id}
                goal={goal}
                onEdit={onEditGoal}
                onDelete={onDeleteGoal}
                onContribute={onContributeToGoal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>Você não tem planos de médio prazo.</p>
            {!showForm && (
              <Button 
                variant="outline" 
                onClick={onShowForm}
                className="mt-4"
              >
                Criar um plano de médio prazo
              </Button>
            )}
          </div>
        )}
      </TabsContent>

      <TabsContent value="long">
        {longTermGoals.length > 0 ? (
          <div className="space-y-4">
            {longTermGoals.map(goal => (
              <GoalItem
                key={goal.id}
                goal={goal}
                onEdit={onEditGoal}
                onDelete={onDeleteGoal}
                onContribute={onContributeToGoal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>Você não tem planos de longo prazo.</p>
            {!showForm && (
              <Button 
                variant="outline" 
                onClick={onShowForm}
                className="mt-4"
              >
                Criar um plano de longo prazo
              </Button>
            )}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
