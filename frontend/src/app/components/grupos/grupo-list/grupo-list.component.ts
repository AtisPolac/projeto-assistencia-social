import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Grupo {
  id: number;
  nome: string;
  descricao: string;
  capacidade_maxima: number;
  assistidos_ativos: number;
  gerenciadores: number;
  ativo: boolean;
}

@Component({
  selector: 'app-grupo-list',
  templateUrl: './grupo-list.component.html',
  styleUrls: ['./grupo-list.component.scss'],
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
    MatProgressBar,
    MatFormFieldModule,
    MatTooltipModule,
  ]
})
export class GrupoListComponent implements OnInit {
  grupos: Grupo[] = [];
  displayedColumns: string[] = ['id', 'nome', 'descricao', 'capacidade', 'ocupacao', 'gerenciadores', 'status', 'acoes'];
  loading = true;
  
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Carregar dados dos grupos
    this.carregarGrupos();
  }

  carregarGrupos(): void {
    // Simulação de carregamento de dados
    setTimeout(() => {
      this.grupos = [
        {
          id: 1,
          nome: 'Grupo 1',
          descricao: 'Grupo de assistência para famílias',
          capacidade_maxima: 20,
          assistidos_ativos: 15,
          gerenciadores: 2,
          ativo: true
        },
        {
          id: 2,
          nome: 'Grupo 2',
          descricao: 'Grupo de assistência para idosos',
          capacidade_maxima: 15,
          assistidos_ativos: 12,
          gerenciadores: 1,
          ativo: true
        },
        {
          id: 3,
          nome: 'Grupo 3',
          descricao: 'Grupo de assistência para crianças',
          capacidade_maxima: 25,
          assistidos_ativos: 20,
          gerenciadores: 3,
          ativo: true
        },
        {
          id: 4,
          nome: 'Grupo 4',
          descricao: 'Grupo de assistência para pessoas com deficiência',
          capacidade_maxima: 15,
          assistidos_ativos: 8,
          gerenciadores: 2,
          ativo: true
        }
      ];
      this.loading = false;
    }, 1000);
  }

  verDetalhes(id: number): void {
    this.router.navigate(['/grupos', id]);
  }

  editarGrupo(id: number): void {
    this.router.navigate(['/grupos', id, 'editar']);
  }

  novoGrupo(): void {
    this.router.navigate(['/grupos/novo']);
  }

  alterarStatus(grupo: Grupo): void {
    // Simulação de alteração de status
    grupo.ativo = !grupo.ativo;
    
    this.snackBar.open(
      `Grupo ${grupo.nome} ${grupo.ativo ? 'ativado' : 'desativado'} com sucesso!`,
      'Fechar',
      { duration: 3000 }
    );
  }

  getOcupacaoPercentual(grupo: Grupo): number {
    return Math.round((grupo.assistidos_ativos / grupo.capacidade_maxima) * 100);
  }

  getOcupacaoClass(percentual: number): string {
    if (percentual >= 90) {
      return 'ocupacao-alta';
    } else if (percentual >= 70) {
      return 'ocupacao-media';
    } else {
      return 'ocupacao-baixa';
    }
  }
}
