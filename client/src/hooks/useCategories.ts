import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Category {
  id: number;
  name: string;
  color: string;
  user_id: number;
  created_at: string;
}

export function useCategories() {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchCategories = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const categories = await response.json();
      setData(categories);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  return { data, isLoading, error, refetch: fetchCategories };
}

export function useCreateCategory() {
  const [isPending, setIsPending] = useState(false);
  const { token } = useAuth();

  const mutateAsync = async (categoryData: { name: string; color: string }) => {
    if (!token) throw new Error('No token available');
    
    setIsPending(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) throw new Error('Failed to create category');
      return await response.json();
    } finally {
      setIsPending(false);
      window.location.reload();
    }
  };

  return { mutateAsync, isPending };
}
