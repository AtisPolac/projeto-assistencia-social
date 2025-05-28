import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

interface RelatorioAssistidos {
  grupo: string;
  total_assistidos: number;
  ativos: number;
  finalizados: number;
  tempo_medio_permanencia: number;
  distribuicao_por_situacao: {
    desempregados: number;
    informais: number;
    outros: number;
  };
}

@Component({
  selector: 'app-relatorio-assistidos',
  templateUrl: './relatorio-assistidos.component.html',
  styleUrls: ['./relatorio-assistidos.component.scss']
})
export class RelatorioAssistidosComponent implements OnInit {
  filtroForm: FormGroup;
  loading = false;
  relatorioGerado = false;
  dadosRelatorio: RelatorioAssistidos[] = [];
  
  // Dados para gráficos
  chartData = {
    labels: ['Grupo 1', 'Grupo 2', 'Grupo 3', 'Grupo 4'],
    datasets: [{
      data: [25, 18, 22, 15],
      backgroundColor: ['#2196F3', '#4CAF50', '#FFC107', '#F44336']
    }]
  };
  
  situacaoChartData = {
    labels: ['Desempregados', 'Trabalho Informal', 'Outros'],
    datasets: [{
      data: [45, 35, 20],
      backgroundColor: ['#F44336', '#FFC107', '#2196F3']
    }]
  };
  
  tempoChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [{
      label: 'Tempo Médio (dias)',
      data: [75, 82, 78, 85, 80, 88],
      borderColor: '#2196F3',
      backgroundColor: 'rgba(33, 150, 243, 0.2)',
      tension: 0.4
    }]
  };

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.filtroForm = this.formBuilder.group({
      data_inicio: [new Date(2025, 0, 1)],
      data_fim: [new Date()],
      grupo: ['todos'],
      situacao: ['todos']
    });
  }

  gerarRelatorio(): void {
    if (this.filtroForm.invalid) {
      return;
    }

    this.loading = true;
    
    // Simulação de geração de relatório
    setTimeout(() => {
      this.dadosRelatorio = [
        {
          grupo: 'Grupo 1',
          total_assistidos: 35,
          ativos: 25,
          finalizados: 10,
          tempo_medio_permanencia: 75,
          distribuicao_por_situacao: {
            desempregados: 20,
            informais: 12,
            outros: 3
          }
        },
        {
          grupo: 'Grupo 2',
          total_assistidos: 28,
          ativos: 18,
          finalizados: 10,
          tempo_medio_permanencia: 82,
          distribuicao_por_situacao: {
            desempregados: 15,
            informais: 10,
            outros: 3
          }
        },
        {
          grupo: 'Grupo 3',
          total_assistidos: 32,
          ativos: 22,
          finalizados: 10,
          tempo_medio_permanencia: 78,
          distribuicao_por_situacao: {
            desempregados: 18,
            informais: 9,
            outros: 5
          }
        },
        {
          grupo: 'Grupo 4',
          total_assistidos: 25,
          ativos: 15,
          finalizados: 10,
          tempo_medio_permanencia: 85,
          distribuicao_por_situacao: {
            desempregados: 12,
            informais: 8,
            outros: 5
          }
        }
      ];
      
      this.loading = false;
      this.relatorioGerado = true;
    }, 1500);
  }

  exportarPDF(): void {
    this.snackBar.open('Exportando relatório em PDF...', 'Fechar', {
      duration: 3000
    });
    
    // Implementação futura: exportação real para PDF
  }

  exportarExcel(): void {
    this.snackBar.open('Exportando relatório em Excel...', 'Fechar', {
      duration: 3000
    });
    
    // Implementação futura: exportação real para Excel
  }

  limparFiltros(): void {
    this.filtroForm.reset({
      data_inicio: new Date(2025, 0, 1),
      data_fim: new Date(),
      grupo: 'todos',
      situacao: 'todos'
    });
    
    this.relatorioGerado = false;
  }
}
