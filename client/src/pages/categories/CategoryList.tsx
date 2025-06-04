import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCategories } from '@/hooks/useCategories';
import { useTasks } from '@/hooks/useTasks';

export function CategoryList() {
  const { data: categories, isLoading } = useCategories();
  const { data: tasks } = useTasks();

  const getCategoryStats = (categoryId: number) => {
    if (!tasks) return { total: 0, completed: 0 };
    
    const categoryTasks = tasks.filter(task => task.category_id === categoryId);
    return {
      total: categoryTasks.length,
      completed: categoryTasks.filter(task => task.status === 'completed').length
    };
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma categoria encontrada</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => {
        const stats = getCategoryStats(category.id);
        const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
        
        return (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: category.color }}
                ></div>
                <CardTitle className="text-lg">{category.name}</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Tarefas:</span>
                <span>{stats.completed} / {stats.total}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Progresso:</span>
                <Badge variant={completionRate >= 80 ? 'default' : 'secondary'}>
                  {completionRate}%
                </Badge>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${completionRate}%`,
                    backgroundColor: category.color 
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
