import jsPDF from 'jspdf';

interface ReportData {
  type: string;
  dateRange: {
    inicio: string;
    fim: string;
  };
  selectedCategory: string;
  stats: any;
  tasks: any[];
  categories: any[];
}

export class PDFReport {
  static generate(data: ReportData) {
    const pdf = new jsPDF();
    
    // Configurações
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    let currentY = margin;
    
    // Função para adicionar quebra de linha
    const addLine = (height = 10) => {
      currentY += height;
      if (currentY > pdf.internal.pageSize.height - margin) {
        pdf.addPage();
        currentY = margin;
      }
    };
    
    // Função para adicionar texto
    const addText = (text: string, size = 12, style = 'normal', x = margin) => {
      pdf.setFontSize(size);
      pdf.setFont('helvetica', style);
      
      // Quebrar texto se for muito longo
      const lines = pdf.splitTextToSize(text, pageWidth - (margin * 2));
      pdf.text(lines, x, currentY);
      addLine(lines.length * (size * 0.4) + 5);
    };
    
    // Cabeçalho
    addText('📚 AGENDA MASTER - RELATÓRIO DE ESTUDOS', 18, 'bold');
    addLine(5);
    
    const now = new Date();
    addText(`Gerado em: ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')}`, 10);
    addLine(10);
    
    // Tipo de relatório
    const reportTypeNames = {
      'geral': 'Relatório Geral',
      'categoria': 'Relatório por Categoria',
      'periodo': 'Relatório por Período',
      'produtividade': 'Relatório de Produtividade'
    };
    
    addText(`Tipo: ${reportTypeNames[data.type] || data.type}`, 14, 'bold');
    
    // Período
    if (data.dateRange.inicio || data.dateRange.fim) {
      let periodoText = 'Período: ';
      if (data.dateRange.inicio && data.dateRange.fim) {
        periodoText += `${new Date(data.dateRange.inicio).toLocaleDateString('pt-BR')} a ${new Date(data.dateRange.fim).toLocaleDateString('pt-BR')}`;
      } else if (data.dateRange.inicio) {
        periodoText += `A partir de ${new Date(data.dateRange.inicio).toLocaleDateString('pt-BR')}`;
      } else if (data.dateRange.fim) {
        periodoText += `Até ${new Date(data.dateRange.fim).toLocaleDateString('pt-BR')}`;
      }
      addText(periodoText, 12);
    }
    
    // Categoria selecionada
    if (data.selectedCategory !== 'all') {
      const category = data.categories.find(cat => cat.id.toString() === data.selectedCategory);
      if (category) {
        addText(`Categoria: ${category.name}`, 12);
      }
    }
    
    addLine(10);
    
    // Filtrar tarefas baseado nos critérios
    let filteredTasks = [...data.tasks];
    
    if (data.selectedCategory !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.category_id.toString() === data.selectedCategory);
    }
    
    if (data.dateRange.inicio) {
      filteredTasks = filteredTasks.filter(task => 
        new Date(task.created_at) >= new Date(data.dateRange.inicio)
      );
    }
    
    if (data.dateRange.fim) {
      filteredTasks = filteredTasks.filter(task => 
        new Date(task.created_at) <= new Date(data.dateRange.fim)
      );
    }
    
    // Estatísticas resumidas
    addText('📊 RESUMO ESTATÍSTICO', 16, 'bold');
    addLine(5);
    
    const completedTasks = filteredTasks.filter(task => task.status === 'completed');
    const totalHours = filteredTasks.reduce((sum, task) => sum + task.actual_hours, 0);
    const completionRate = filteredTasks.length > 0 ? (completedTasks.length / filteredTasks.length) * 100 : 0;
    
    addText(`• Total de tarefas: ${filteredTasks.length}`, 12);
    addText(`• Tarefas concluídas: ${completedTasks.length}`, 12);
    addText(`• Taxa de conclusão: ${completionRate.toFixed(1)}%`, 12);
    addText(`• Total de horas estudadas: ${totalHours.toFixed(1)}h`, 12);
    addText(`• Média de horas por tarefa: ${filteredTasks.length > 0 ? (totalHours / filteredTasks.length).toFixed(1) : 0}h`, 12);
    
    addLine(15);
    
    // Análise por categoria
    if (data.categories.length > 0) {
      addText('📁 ANÁLISE POR CATEGORIA', 16, 'bold');
      addLine(5);
      
      data.categories.forEach(category => {
        const categoryTasks = filteredTasks.filter(task => task.category_id === category.id);
        if (categoryTasks.length === 0) return;
        
        const categoryCompleted = categoryTasks.filter(task => task.status === 'completed');
        const categoryHours = categoryTasks.reduce((sum, task) => sum + task.actual_hours, 0);
        const categoryRate = (categoryCompleted.length / categoryTasks.length) * 100;
        
        addText(`${category.name}:`, 12, 'bold');
        addText(`  - Tarefas: ${categoryTasks.length} (${categoryCompleted.length} concluídas)`, 10);
        addText(`  - Taxa de conclusão: ${categoryRate.toFixed(1)}%`, 10);
        addText(`  - Horas estudadas: ${categoryHours.toFixed(1)}h`, 10);
        addLine(5);
      });
    }
    
    addLine(10);
    
    // Lista de tarefas concluídas
    if (completedTasks.length > 0) {
      addText('✅ TAREFAS CONCLUÍDAS', 16, 'bold');
      addLine(5);
      
      completedTasks.forEach((task, index) => {
        if (index >= 20) { // Limitar a 20 tarefas para não sobrecarregar o PDF
          if (index === 20) {
            addText(`... e mais ${completedTasks.length - 20} tarefas concluídas`, 10, 'italic');
          }
          return;
        }
        
        const category = data.categories.find(cat => cat.id === task.category_id);
        const completedDate = task.completed_at ? new Date(task.completed_at).toLocaleDateString('pt-BR') : 'N/A';
        
        addText(`${index + 1}. ${task.title}`, 10, 'bold');
        addText(`   Categoria: ${category?.name || 'N/A'} | Concluída: ${completedDate} | Horas: ${task.actual_hours}h`, 9);
        if (task.description) {
          addText(`   Descrição: ${task.description}`, 9, 'italic');
        }
        addLine(3);
      });
    }
    
    // Rodapé
    addLine(20);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Relatório gerado pelo sistema Agenda Master', margin, pdf.internal.pageSize.height - 10);
    
    // Salvar o PDF
    const filename = `relatorio-agenda-master-${data.type}-${now.toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
  }
}