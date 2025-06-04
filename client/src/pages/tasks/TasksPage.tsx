import * as React from 'react';
import { TaskList } from './TaskList';
import { TaskForm } from './TaskForm';
import { TaskFilters } from './TaskFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export function TasksPage() {
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all'
  });

  const handleTaskCreated = () => {
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tarefas</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas tarefas de estudo
          </p>
        </div>
        
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      <TaskFilters filters={filters} onFiltersChange={setFilters} />
      
      <TaskList filters={filters} />
      
      {showForm && (
        <TaskForm 
          onClose={() => setShowForm(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
}
