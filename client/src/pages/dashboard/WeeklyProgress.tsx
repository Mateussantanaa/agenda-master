import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTasks } from '@/hooks/useTasks';

export function WeeklyProgress() {
  const { data: tasks } = useTasks();

  const thisWeekTasks = React.useMemo(() => {
    if (!tasks) return { total: 0, completed: 0 };
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weekTasks = tasks.filter(task => {
      const taskDate = new Date(task.created_at);
      return taskDate >= oneWeekAgo;
    });
    
    return {
      total: weekTasks.length,
      completed: weekTasks.filter(task => task.status === 'completed').length
    };
  }, [tasks]);

  const progressPercentage = thisWeekTasks.total > 0 
    ? (thisWeekTasks.completed / thisWeekTasks.total) * 100 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresso Semanal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>Tarefas concluídas esta semana</span>
          <span>{thisWeekTasks.completed} de {thisWeekTasks.total}</span>
        </div>
        
        <Progress value={progressPercentage} className="h-2" />
        
        <div className="text-center">
          <span className="text-2xl font-bold">{Math.round(progressPercentage)}%</span>
          <p className="text-sm text-muted-foreground">Meta semanal</p>
        </div>
        
        {progressPercentage >= 100 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <p className="text-green-800 font-medium">🎉 Parabéns!</p>
            <p className="text-green-600 text-sm">Você completou todas as tarefas da semana!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
