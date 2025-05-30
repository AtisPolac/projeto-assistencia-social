import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

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
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatOptionModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    RouterModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatNativeDateModule
  ],
  templateUrl: './relatorio-assistidos.component.html',
  styleUrls: ['./relatorio-assistidos.component.scss']
})
export class RelatorioAssistidosComponent implements OnInit, AfterViewInit {
  filtroForm!: FormGroup;
  loading = false;
  relatorioGerado = false;
  dadosRelatorio: RelatorioAssistidos[] = [];

  // referências aos canvas no template
  @ViewChild('gruposChart', { static: false }) gruposChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('situacaoChart', { static: false }) situacaoChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tempoChart', { static: false }) tempoChartRef!: ElementRef<HTMLCanvasElement>;

  // instâncias Chart.js
  private gruposChartInstance?: Chart;
  private situacaoChartInstance?: Chart;
  private tempoChartInstance?: Chart;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      data_inicio: [new Date(2025, 0, 1)],
      data_fim: [new Date()],
      grupo: ['todos'],
      situacao: ['todos']
    });
  }

  ngAfterViewInit(): void {
    // nada aqui — só renderizamos quando gerarRelatorio() for chamado
  }

  gerarRelatorio(): void {
    if (this.filtroForm.invalid) return;
    this.loading = true;

    // simula busca de dados
    setTimeout(() => {
      this.dadosRelatorio = [
        {
          grupo: 'Grupo 1',
          total_assistidos: 18,
          ativos: 4,
          finalizados: 14,
          tempo_medio_permanencia: 75,
          distribuicao_por_situacao: { desempregados: 7, informais: 6, outros: 5 }
        },
        {
          grupo: 'Grupo 2',
          total_assistidos: 9,
          ativos: 3,
          finalizados: 6,
          tempo_medio_permanencia: 82,
          distribuicao_por_situacao: { desempregados: 2, informais: 4, outros: 3 }
        },
        {
          grupo: 'Grupo 3',
          total_assistidos: 12,
          ativos: 3,
          finalizados: 9,
          tempo_medio_permanencia: 78,
          distribuicao_por_situacao: { desempregados: 5, informais: 2, outros: 5 }
        },
        {
          grupo: 'Grupo 4',
          total_assistidos: 14,
          ativos: 3,
          finalizados: 11,
          tempo_medio_permanencia: 85,
          distribuicao_por_situacao: { desempregados: 6, informais: 4, outros: 4 }
        }
      ];

      this.loading = false;
      this.relatorioGerado = true;

      // aguarda o *ngIf renderizar o container antes de desenhar
      setTimeout(() => this.renderizarGraficos(), 0);
    }, 1000);
  }

  private renderizarGraficos(): void {
    this.renderizarGraficoGrupos();
    this.renderizarGraficoSituacao();
    this.renderizarGraficoTempo();
  }

  private renderizarGraficoGrupos(): void {
    const ctx = this.gruposChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // destrói instância antiga, se existir
    this.gruposChartInstance?.destroy();

    this.gruposChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.dadosRelatorio.map(d => d.grupo),
        datasets: [{
          label: 'Total de Assistidos',
          data: this.dadosRelatorio.map(d => d.total_assistidos),
          backgroundColor: '#3f51b5'
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  private renderizarGraficoSituacao(): void {
    const ctx = this.situacaoChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.situacaoChartInstance?.destroy();

    const totais = this.dadosRelatorio.reduce(
      (acc, d) => {
        acc.desempregados += d.distribuicao_por_situacao.desempregados;
        acc.informais += d.distribuicao_por_situacao.informais;
        acc.outros += d.distribuicao_por_situacao.outros;
        return acc;
      },
      { desempregados: 0, informais: 0, outros: 0 }
    );

    this.situacaoChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Desempregados', 'Trabalho Informal', 'Outros'],
        datasets: [{
          data: [totais.desempregados, totais.informais, totais.outros],
          backgroundColor: ['#f44336', '#ff9800', '#9e9e9e']
        }]
      },
      options: { responsive: true }
    });
  }

  private renderizarGraficoTempo(): void {
    const ctx = this.tempoChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.tempoChartInstance?.destroy();

    this.tempoChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.dadosRelatorio.map(d => d.grupo),
        datasets: [{
          label: 'Tempo Médio (dias)',
          data: this.dadosRelatorio.map(d => d.tempo_medio_permanencia),
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
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

  exportarPDF(): void {
    this.snackBar.open('Exportando relatório em PDF…', 'Fechar', { duration: 3000 });
  }

  exportarExcel(): void {
    this.snackBar.open('Exportando relatório em Excel…', 'Fechar', { duration: 3000 });
  }

  somaAssitidos(): number {
    return this.dadosRelatorio.reduce((s, i) => s + i.total_assistidos, 0);
  }

  somaAtivos(): number {
    return this.dadosRelatorio.reduce((s, i) => s + i.ativos, 0);
  }

  somaFinalizados(): number {
    return this.dadosRelatorio.reduce((s, i) => s + i.finalizados, 0);
  }

  mediaTempoPermanencia(): number {
    if (!this.dadosRelatorio.length) return 0;
    const soma = this.dadosRelatorio.reduce((s, i) => s + i.tempo_medio_permanencia, 0);
    return Math.round(soma / this.dadosRelatorio.length);
  }
}
