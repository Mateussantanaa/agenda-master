import * as React from 'react';
import { StatsCards } from './StatsCards';
import { RecentTasks } from './RecentTasks';
import { WeeklyProgress } from './WeeklyProgress';
import { useAuth } from '@/contexts/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {getGreeting()}, {user?.name}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Acompanhe seu progresso nos estudos de programação
        </p>
      </div>
      
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentTasks />
        <WeeklyProgress />
      </div>
    </div>
  );
}
