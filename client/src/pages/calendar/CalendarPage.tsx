import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useCategories';
import { TaskForm } from '@/pages/tasks/TaskForm';

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  
  const { data: tasks } = useTasks();
  const { data: categories } = useCategories();

  const getTasksForDate = (date: Date) => {
    if (!tasks) return [];
    
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => {
      if (task.due_date) {
        const taskDate = task.due_date.split('T')[0];
        return taskDate === dateStr;
      }
      return false;
    });
  };

  const getTasksForMonth = () => {
    if (!tasks) return {};
    
    const monthTasks = {};
    tasks.forEach(task => {
      if (task.due_date) {
        const date = new Date(task.due_date + 'T00:00:00');
        if (date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
          const dateKey = date.getDate();
          if (!monthTasks[dateKey]) {
            monthTasks[dateKey] = [];
          }
          monthTasks[dateKey].push(task);
        }
      }
    });
    
    return monthTasks;
  };

  const monthTasks = getTasksForMonth();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
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

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === currentDate.getMonth() && 
           today.getFullYear() === currentDate.getFullYear();
  };

  const isPastDue = (day: number) => {
    const today = new Date();
    const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return cellDate < today && !isToday(day);
  };

  const handleTaskCreated = () => {
    setShowTaskForm(false);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <CalendarIcon className="h-8 w-8 mr-3 text-primary" />
            Calendário
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualize suas tarefas organizadas por data de vencimento
          </p>
        </div>
        
        <Button onClick={() => setShowTaskForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Hoje
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {/* Cabeçalho dos dias da semana */}
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                
                {/* Dias vazios no início do mês */}
                {emptyDays.map(day => (
                  <div key={`empty-${day}`} className="p-2"></div>
                ))}
                
                {/* Dias do mês */}
                {daysArray.map(day => {
                  const dayTasks = monthTasks[day] || [];
                  const hasOverdueTasks = isPastDue(day) && dayTasks.some(task => task.status !== 'completed');
                  
                  return (
                    <div
                      key={day}
                      className={`
                        p-2 min-h-[80px] border rounded cursor-pointer transition-colors
                        hover:bg-accent
                        ${isToday(day) ? 'bg-primary/10 border-primary' : 'border-border'}
                        ${selectedDate?.getDate() === day ? 'bg-accent' : ''}
                        ${hasOverdueTasks ? 'bg-red-50 border-red-200' : ''}
                      `}
                      onClick={() => handleDateClick(day)}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-primary' : ''}`}>
                        {day}
                      </div>
                      
                      <div className="space-y-1">
                        {dayTasks.slice(0, 2).map(task => {
                          const category = categories?.find(cat => cat.id === task.category_id);
                          return (
                            <div
                              key={task.id}
                              className="text-xs p-1 rounded truncate"
                              style={{ backgroundColor: category?.color + '20', color: category?.color }}
                              title={task.title}
                            >
                              {task.title}
                            </div>
                          );
                        })}
                        
                        {dayTasks.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayTasks.length - 2} mais
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {formatDate(selectedDate)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const dayTasks = getTasksForDate(selectedDate);
                  
                  if (dayTasks.length === 0) {
                    return (
                      <p className="text-muted-foreground text-sm">
                        Nenhuma tarefa para este dia
                      </p>
                    );
                  }
                  
                  return (
                    <div className="space-y-3">
                      {dayTasks.map(task => {
                        const category = categories?.find(cat => cat.id === task.category_id);
                        const isOverdue = new Date(task.due_date + 'T00:00:00') < new Date() && task.status !== 'completed';
                        
                        return (
                          <div key={task.id} className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-sm">{task.title}</h4>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getStatusColor(task.status)} text-white`}
                              >
                                {getStatusText(task.status)}
                              </Badge>
                            </div>
                            
                            {task.description && (
                              <p className="text-xs text-muted-foreground">{task.description}</p>
                            )}
                            
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-1">
                                <div 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: category?.color }}
                                ></div>
                                <span className="text-muted-foreground">{category?.name}</span>
                              </div>
                              
                              {isOverdue && (
                                <Badge variant="destructive" className="text-xs">
                                  Atrasado
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Legenda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-primary/10 border border-primary rounded"></div>
                <span>Hoje</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Concluída</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Em progresso</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                <span>Pendente</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
                <span>Atrasado</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showTaskForm && (
        <TaskForm 
          onClose={() => setShowTaskForm(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
}