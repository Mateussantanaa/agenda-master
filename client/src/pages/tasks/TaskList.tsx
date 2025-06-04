import * as React from 'react';
import { TaskCard } from './TaskCard';
import { useTasks } from '@/hooks/useTasks';

interface TaskListProps {
  filters: {
    status: string;
    category: string;
    priority: string;
  };
}

export function TaskList({ filters }: TaskListProps) {
  const { data: tasks, isLoading } = useTasks();

  const filteredTasks = React.useMemo(() => {
    if (!tasks) return [];

    return tasks.filter((task) => {
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.category !== 'all' && task.category_id.toString() !== filters.category) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      return true;
    });
  }, [tasks, filters]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-40 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
