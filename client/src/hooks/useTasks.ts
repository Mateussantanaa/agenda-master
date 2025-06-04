import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Task {
  id: number;
  title: string;
  description: string | null;
  category_id: number;
  user_id: number;
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

export function useTasks() {
  const [data, setData] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchTasks = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const tasks = await response.json();
      setData(tasks);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  return { data, isLoading, error, refetch: fetchTasks };
}

export function useCreateTask() {
  const [isPending, setIsPending] = useState(false);
  const { token } = useAuth();

  const mutateAsync = async (taskData: any) => {
    if (!token) throw new Error('No token available');
    
    setIsPending(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) throw new Error('Failed to create task');
      return await response.json();
    } finally {
      setIsPending(false);
      window.location.reload();
    }
  };

  return { mutateAsync, isPending };
}

export function useUpdateTask() {
  const [isPending, setIsPending] = useState(false);
  const { token } = useAuth();

  const mutateAsync = async ({ id, ...updates }: { id: number; [key: string]: any }) => {
    if (!token) throw new Error('No token available');
    
    setIsPending(true);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) throw new Error('Failed to update task');
      return await response.json();
    } finally {
      setIsPending(false);
      window.location.reload();
    }
  };

  return { mutateAsync, isPending };
}

export function useDeleteTask() {
  const [isPending, setIsPending] = useState(false);
  const { token } = useAuth();

  const mutateAsync = async (id: number) => {
    if (!token) throw new Error('No token available');
    
    setIsPending(true);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete task');
    } finally {
      setIsPending(false);
      window.location.reload();
    }
  };

  return { mutateAsync, isPending };
}
