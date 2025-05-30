import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
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
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

interface Doacao {
  id: number;
  data_doacao: Date;
  assistido: string;
  id_assistido: number;
  gerenciador: string;
  grupo: string;
  itens: string;
  comprovante_gerado: boolean;
}

@Component({
  selector: 'app-doacao-list',
  templateUrl: './doacao-list.component.html',
  styleUrls: ['./doacao-list.component.scss'],
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
    MatChipsModule
  ]
})
export class DoacaoListComponent implements OnInit {
  doacoes: Doacao[] = [];
  displayedColumns: string[] = ['id', 'data', 'assistido', 'grupo', 'gerenciador', 'itens', 'comprovante', 'acoes'];
  loading = true;
  
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Carregar dados das doações
    this.carregarDoacoes();
  }

  carregarDoacoes(): void {
    // Simulação de carregamento de dados
    setTimeout(() => {
      this.doacoes = [
        {
          id: 1,
          data_doacao: new Date(2025, 4, 20),
          assistido: 'Carlos Pereira',
          id_assistido: 1,
          gerenciador: 'Ana Silva',
          grupo: 'Grupo 1',
          itens: 'Roupas',
          comprovante_gerado: true
        },
        {
          id: 2,
          data_doacao: new Date(2025, 4, 19),
          assistido: 'Mariana Costa',
          id_assistido: 2,
          gerenciador: 'Pedro Santos',
          grupo: 'Grupo 2',
          itens: 'Cesta Básica',
          comprovante_gerado: true
        },
        {
          id: 3,
          data_doacao: new Date(2025, 4, 18),
          assistido: 'José Oliveira',
          id_assistido: 3,
          gerenciador: 'Ana Silva',
          grupo: 'Grupo 1',
          itens: 'Cesta Básica',
          comprovante_gerado: false
        },
        {
          id: 4,
          data_doacao: new Date(2025, 4, 15),
          assistido: 'Fernanda Lima',
          id_assistido: 4,
          gerenciador: 'Pedro Santos',
          grupo: 'Grupo 2',
          itens: 'Cesta Básica',
          comprovante_gerado: true
        }
      ];
      this.loading = false;
    }, 1000);
  }

  verDetalhes(id: number): void {
    this.router.navigate(['/doacoes', id]);
  }

  gerarComprovante(id: number): void {
    this.router.navigate(['/doacoes', id, 'comprovante']);
  }

  novaDoacao(): void {
    this.router.navigate(['/doacoes/nova']);
  }

  verAssistido(id: number): void {
    this.router.navigate(['/assistidos', id]);
  }
}
