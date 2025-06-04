import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Trash2, Play, CheckCircle, Edit } from 'lucide-react';
import { useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { StudySessionForm } from './StudySessionForm';
import { TaskEditForm } from './TaskEditForm';
import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  description: string | null;
  category_id: number;
  category_name: string;
  category_color: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string | null;
  estimated_hours: number;
  actual_hours: number;
  created_at: string;
  completed_at: string | null;
}

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'in_progress': return 'Em Progresso';
      case 'pending': return 'Pendente';
      default: return 'Pendente';
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateTask.mutateAsync({
        id: task.id,
        status: newStatus
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await deleteTask.mutateAsync(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    // Fix timezone issue by using local date
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  const isOverdue = task.due_date && new Date(task.due_date + 'T00:00:00') < new Date() && task.status !== 'completed';

  const handleTaskUpdated = () => {
    setShowEditForm(false);
  };

  return (
    <>
      <Card className={`${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditForm(true)}
                className="text-blue-500 hover:text-blue-700"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: task.category_color }}
              ></span>
              <span className="text-sm text-muted-foreground">
                {task.category_name}
              </span>
            </div>
            <Badge variant={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{task.actual_hours}h / {task.estimated_hours}h</span>
            </div>
            
            {task.due_date && (
              <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                <Calendar className="h-4 w-4" />
                <span>{formatDate(task.due_date)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
              {getStatusText(task.status)}
            </span>
          </div>

          <div className="flex space-x-2">
            {task.status === 'pending' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('in_progress')}
                className="flex-1"
              >
                <Play className="h-4 w-4 mr-1" />
                Iniciar
              </Button>
            )}
            
            {task.status === 'in_progress' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSessionForm(true)}
                  className="flex-1"
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Sessão
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleStatusChange('completed')}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Concluir
                </Button>
              </>
            )}
            
            {task.status === 'completed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('in_progress')}
                className="flex-1"
              >
                Reabrir
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {showSessionForm && (
        <StudySessionForm
          taskId={task.id}
          taskTitle={task.title}
          onClose={() => setShowSessionForm(false)}
        />
      )}

      {showEditForm && (
        <TaskEditForm
          task={task}
          onClose={() => setShowEditForm(false)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </>
  );
}