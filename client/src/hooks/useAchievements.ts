import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Achievement {
  id: number;
  nome: string;
  descricao: string;
  icone: string;
  tipo: 'study_time' | 'tasks_completed' | 'streak' | 'category' | 'special';
  condicao_valor: number;
  condicao_extra: string | null;
  criado_em: string;
  desbloqueado_em?: string;
}

export function useAchievements() {
  const [data, setData] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchAchievements = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/achievements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch achievements');
      const achievements = await response.json();
      setData(achievements);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [token]);

  return { data, isLoading, error, refetch: fetchAchievements };
}