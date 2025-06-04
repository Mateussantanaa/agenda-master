import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Award, Target } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import { useStats } from '@/hooks/useStats';
import { useTasks } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useCategories';

export function AchievementsPage() {
  const { data: achievements } = useAchievements();
  const { data: stats } = useStats();
  const { data: tasks } = useTasks();
  const { data: categories } = useCategories();

  const calculateProgress = (achievement: any) => {
    if (!stats || !tasks || !categories) return 0;

    switch (achievement.tipo) {
      case 'study_time':
        return Math.min((stats.totalHours / achievement.condicao_valor) * 100, 100);
      
      case 'tasks_completed':
        return Math.min((stats.completedTasks / achievement.condicao_valor) * 100, 100);
      
      case 'category':
        if (achievement.condicao_extra) {
          const category = categories.find(cat => cat.name === achievement.condicao_extra);
          if (category) {
            const categoryTasks = tasks.filter(task => 
              task.category_id === category.id && task.status === 'completed'
            );
            return Math.min((categoryTasks.length / achievement.condicao_valor) * 100, 100);
          }
        } else {
          return Math.min((categories.length / achievement.condicao_valor) * 100, 100);
        }
        return 0;
      
      case 'special':
        // Para conquistas especiais, seria necessário lógica específica
        return 0;
      
      default:
        return 0;
    }
  };

  const getCurrentValue = (achievement: any) => {
    if (!stats || !tasks || !categories) return 0;

    switch (achievement.tipo) {
      case 'study_time':
        return stats.totalHours;
      
      case 'tasks_completed':
        return stats.completedTasks;
      
      case 'category':
        if (achievement.condicao_extra) {
          const category = categories.find(cat => cat.name === achievement.condicao_extra);
          if (category) {
            const categoryTasks = tasks.filter(task => 
              task.category_id === category.id && task.status === 'completed'
            );
            return categoryTasks.length;
          }
        } else {
          return categories.length;
        }
        return 0;
      
      default:
        return 0;
    }
  };

  const groupedAchievements = achievements?.reduce((groups, achievement) => {
    const type = achievement.tipo;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(achievement);
    return groups;
  }, {} as Record<string, any[]>) || {};

  const typeNames = {
    'study_time': 'Tempo de Estudo',
    'tasks_completed': 'Tarefas Concluídas',
    'category': 'Categorias',
    'special': 'Especiais',
    'streak': 'Sequências'
  };

  const typeIcons = {
    'study_time': Trophy,
    'tasks_completed': Target,
    'category': Star,
    'special': Award,
    'streak': Trophy
  };

  if (!achievements) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Trophy className="h-8 w-8 mr-3 text-primary" />
            Conquistas
          </h1>
          <p className="text-muted-foreground mt-2">Carregando conquistas...</p>
        </div>
      </div>
    );
  }

  const unlockedCount = achievements.filter(achievement => 
    calculateProgress(achievement) >= 100
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Trophy className="h-8 w-8 mr-3 text-primary" />
          Conquistas
        </h1>
        <p className="text-muted-foreground mt-2">
          Acompanhe seu progresso e desbloqueie conquistas especiais
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Desbloqueadas</p>
                <p className="text-2xl font-bold">{unlockedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{achievements.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Progresso</p>
                <p className="text-2xl font-bold">
                  {Math.round((unlockedCount / achievements.length) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedAchievements).map(([type, typeAchievements]) => {
          const TypeIcon = typeIcons[type] || Trophy;
          
          return (
            <div key={type}>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <TypeIcon className="h-5 w-5 mr-2" />
                {typeNames[type] || type}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {typeAchievements.map((achievement) => {
                  const progress = calculateProgress(achievement);
                  const currentValue = getCurrentValue(achievement);
                  const isUnlocked = progress >= 100;
                  
                  return (
                    <Card key={achievement.id} className={`${isUnlocked ? 'border-yellow-300 bg-yellow-50' : ''}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{achievement.icone}</span>
                            <div>
                              <CardTitle className="text-base">{achievement.nome}</CardTitle>
                              <p className="text-sm text-muted-foreground">{achievement.descricao}</p>
                            </div>
                          </div>
                          {isUnlocked && (
                            <Badge variant="default" className="bg-yellow-500">
                              ✨ Desbloqueada
                            </Badge>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progresso</span>
                            <span>{currentValue} / {achievement.condicao_valor}</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        {achievement.condicao_extra && (
                          <div className="text-xs text-muted-foreground">
                            Categoria: {achievement.condicao_extra}
                          </div>
                        )}

                        {isUnlocked && (
                          <div className="text-xs text-green-600 font-medium">
                            🎉 Parabéns! Conquista desbloqueada!
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {unlockedCount === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma conquista desbloqueada ainda</h3>
            <p className="text-muted-foreground">
              Continue estudando e completando tarefas para desbloquear suas primeiras conquistas!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}