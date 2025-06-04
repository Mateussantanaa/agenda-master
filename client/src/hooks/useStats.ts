import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Stats {
  totalTasks: number;
  completedTasks: number;
  totalHours: number;
  sessionsCount: number;
}

export function useStats() {
  const [data, setData] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchStats = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const stats = await response.json();
      setData(stats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  return { data, isLoading, error, refetch: fetchStats };
}
