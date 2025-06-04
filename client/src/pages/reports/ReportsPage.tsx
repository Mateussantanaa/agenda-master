import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useStats } from '@/hooks/useStats';
import { useTasks } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useCategories';
import { PDFReport } from '@/components/PDFReport';

export function ReportsPage() {
  const [reportType, setReportType] = useState('geral');
  const [dateRange, setDateRange] = useState({
    inicio: '',
    fim: ''
  });
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: stats } = useStats();
  const { data: tasks } = useTasks();
  const { data: categories } = useCategories();

  const generatePDFReport = () => {
    const reportData = {
      type: reportType,
      dateRange,
      selectedCategory,
      stats,
      tasks: tasks || [],
      categories: categories || []
    };

    PDFReport.generate(reportData);
  };

  const getFilteredTasks = () => {
    if (!tasks) return [];
    
    let filtered = [...tasks];
    
    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => task.category_id.toString() === selectedCategory);
    }
    
    // Filtrar por data
    if (dateRange.inicio) {
      filtered = filtered.filter(task => 
        new Date(task.created_at) >= new Date(dateRange.inicio)
      );
    }
    
    if (dateRange.fim) {
      filtered = filtered.filter(task => 
        new Date(task.created_at) <= new Date(dateRange.fim)
      );
    }
    
    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');
  const totalHours = filteredTasks.reduce((sum, task) => sum + task.actual_hours, 0);
  const avgHoursPerTask = filteredTasks.length > 0 ? totalHours / filteredTasks.length : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <FileText className="h-8 w-8 mr-3 text-primary" />
          Relatórios
        </h1>
        <p className="text-muted-foreground mt-2">
          Gere relatórios detalhados sobre seu progresso nos estudos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações do Relatório</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-type">Tipo de Relatório</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id="report-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geral">Relatório Geral</SelectItem>
                    <SelectItem value="categoria">Por Categoria</SelectItem>
                    <SelectItem value="periodo">Por Período</SelectItem>
                    <SelectItem value="produtividade">Produtividade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria (Opcional)</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="date-start">Data Início</Label>
                  <Input
                    id="date-start"
                    type="date"
                    value={dateRange.inicio}
                    onChange={(e) => setDateRange(prev => ({ ...prev, inicio: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-end">Data Fim</Label>
                  <Input
                    id="date-end"
                    type="date"
                    value={dateRange.fim}
                    onChange={(e) => setDateRange(prev => ({ ...prev, fim: e.target.value }))}
                  />
                </div>
              </div>

              <Button onClick={generatePDFReport} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Gerar Relatório PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tarefas</p>
                    <p className="text-lg font-bold">{filteredTasks.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Concluídas</p>
                    <p className="text-lg font-bold">{completedTasks.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Horas</p>
                    <p className="text-lg font-bold">{totalHours.toFixed(1)}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Média/Tarefa</p>
                    <p className="text-lg font-bold">{avgHoursPerTask.toFixed(1)}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Preview do Relatório</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Resumo do Período</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total de tarefas:</span>
                      <span className="ml-2 font-medium">{filteredTasks.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Taxa de conclusão:</span>
                      <span className="ml-2 font-medium">
                        {filteredTasks.length > 0 ? Math.round((completedTasks.length / filteredTasks.length) * 100) : 0}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Horas estudadas:</span>
                      <span className="ml-2 font-medium">{totalHours.toFixed(1)}h</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Média por tarefa:</span>
                      <span className="ml-2 font-medium">{avgHoursPerTask.toFixed(1)}h</span>
                    </div>
                  </div>
                </div>

                {categories && categories.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Por Categoria</h3>
                    <div className="space-y-2">
                      {categories.map(category => {
                        const categoryTasks = filteredTasks.filter(task => task.category_id === category.id);
                        const categoryCompleted = categoryTasks.filter(task => task.status === 'completed');
                        
                        if (categoryTasks.length === 0) return null;
                        
                        return (
                          <div key={category.id} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: category.color }}
                              ></div>
                              <span className="text-sm font-medium">{category.name}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {categoryCompleted.length}/{categoryTasks.length} concluídas
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}