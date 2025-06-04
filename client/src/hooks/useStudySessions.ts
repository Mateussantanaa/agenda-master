import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useCreateStudySession() {
  const [isPending, setIsPending] = useState(false);
  const { token } = useAuth();

  const mutateAsync = async (sessionData: {
    task_id: number;
    duration_minutes: number;
    duration_seconds: number;
    notes: string | null;
  }) => {
    if (!token) throw new Error('No token available');
    
    console.log('useCreateStudySession: Starting request with data:', sessionData);
    
    setIsPending(true);
    try {
      const response = await fetch('/api/study-sessions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sessionData),
      });
      
      console.log('useCreateStudySession: Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('useCreateStudySession: Error response:', errorData);
        throw new Error(`Failed to create study session: ${response.status} ${errorData}`);
      }
      
      const result = await response.json();
      console.log('useCreateStudySession: Success response:', result);
      return result;
    } catch (error) {
      console.error('useCreateStudySession: Request failed:', error);
      throw error;
    } finally {
      setIsPending(false);
      // Reload to refresh data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return { mutateAsync, isPending };
}