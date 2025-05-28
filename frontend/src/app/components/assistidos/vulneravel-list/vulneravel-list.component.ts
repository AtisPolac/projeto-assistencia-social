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

interface Vulneravel {
  id: number;
  nome_completo: string;
  cpf: string;
  data_nascimento: Date;
  telefone: string;
  cidade: string;
  estado: string;
  data_cadastro: Date;
  situacao_emprego: string;
}

@Component({
  standalone: true,
  selector: 'app-vulneravel-list',
  templateUrl: './vulneravel-list.component.html',
  styleUrls: ['./vulneravel-list.component.scss'],
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
    MatTableModule
  ]
})
export class VulneravelListComponent implements OnInit {
  vulneraveis: Vulneravel[] = [];
  displayedColumns: string[] = ['nome', 'cpf', 'data_nascimento', 'telefone', 'cidade', 'data_cadastro', 'acoes'];
  loading = true;
  
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Carregar dados dos vulneráveis
    this.carregarVulneraveis();
  }

  carregarVulneraveis(): void {
    // Simulação de carregamento de dados
    setTimeout(() => {
      this.vulneraveis = [
        {
          id: 1,
          nome_completo: 'Maria Oliveira',
          cpf: '123.456.789-00',
          data_nascimento: new Date(1985, 5, 15),
          telefone: '(11) 98765-4321',
          cidade: 'São Paulo',
          estado: 'SP',
          data_cadastro: new Date(2025, 4, 10),
          situacao_emprego: 'Desempregado'
        },
        {
          id: 2,
          nome_completo: 'João Silva',
          cpf: '987.654.321-00',
          data_nascimento: new Date(1990, 8, 22),
          telefone: '(11) 91234-5678',
          cidade: 'São Paulo',
          estado: 'SP',
          data_cadastro: new Date(2025, 4, 12),
          situacao_emprego: 'Informal'
        },
        {
          id: 3,
          nome_completo: 'Ana Santos',
          cpf: '456.789.123-00',
          data_nascimento: new Date(1978, 2, 8),
          telefone: '(11) 94567-8912',
          cidade: 'Guarulhos',
          estado: 'SP',
          data_cadastro: new Date(2025, 4, 15),
          situacao_emprego: 'Desempregado'
        },
        {
          id: 4,
          nome_completo: 'Carlos Pereira',
          cpf: '789.123.456-00',
          data_nascimento: new Date(1982, 11, 30),
          telefone: '(11) 97891-2345',
          cidade: 'Osasco',
          estado: 'SP',
          data_cadastro: new Date(2025, 4, 18),
          situacao_emprego: 'Informal'
        }
      ];
      this.loading = false;
    }, 1000);
  }

  verDetalhes(id: number): void {
    this.router.navigate(['/vulneraveis', id]);
  }

  apadrinhar(id: number): void {
    this.router.navigate(['/vulneraveis', id, 'apadrinhar']);
  }

  novoVulneravel(): void {
    this.router.navigate(['/vulneraveis/novo']);
  }

  getIdade(dataNascimento: Date): number {
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const m = hoje.getMonth() - dataNascimento.getMonth();
    
    if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
      idade--;
    }
    
    return idade;
  }

  getDiasEspera(dataCadastro: Date): number {
    const hoje = new Date();
    const diff = hoje.getTime() - dataCadastro.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}
