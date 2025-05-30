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

interface Assistido {
  id: number;
  nome_completo: string;
  cpf: string;
  data_nascimento: Date;
  telefone: string;
  grupo: string;
  data_cadastro: Date;
  situacao_emprego: string;
}

@Component({
  selector: 'app-assistidos-list',
  templateUrl: './assistidos-list.component.html',
  styleUrls: ['./assistidos-list.component.scss'],
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
    MatTableModule]
})
export class AssistidosListComponent implements OnInit {
    
  loading = true;

  assistidos: Assistido[] = [];

    displayedColumns: string[] = ['nome', 'cpf', 'data_nascimento', 'telefone', 'grupo', 'data_cadastro', 'acoes'];

  constructor(private router: Router,) {}

  ngOnInit(): void {
    this.carregarAssistidos();
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
    const diff = dataCadastro.getTime() + (91 * 24 * 60 * 60 * 1000) - hoje.getTime(); // 30 dias de espera
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

    verDetalhes(id: number): void {
    this.router.navigate(['/vulneraveis', id]);
  }

  novoApadrinhamento(): void {
    this.router.navigate(['/vulneraveis/novo']);
  }

  carregarAssistidos(): void {
    // Simulação de carregamento de dados
    setTimeout(() => {
      this.assistidos = [
        { id: 1, nome_completo: 'Patrícia Costa', cpf: '321.654.987-00', data_nascimento: new Date(1993, 7, 9), telefone: '(11) 93456-7890', grupo: 'Grupo 1', data_cadastro: new Date(2025, 2, 25), situacao_emprego: 'Formal' },
        { id: 2, nome_completo: 'Ricardo Lima', cpf: '654.321.987-00', data_nascimento: new Date(1980, 1, 17), telefone: '(11) 99876-5432', grupo: 'Grupo 2', data_cadastro: new Date(2025, 4, 1), situacao_emprego: 'Desempregado' },
        { id: 3, nome_completo: 'Juliana Martins', cpf: '987.321.654-00', data_nascimento: new Date(1975, 10, 5), telefone: '(11) 97788-6655', grupo: 'Grupo 3', data_cadastro: new Date(2025, 3, 12), situacao_emprego: 'Informal' },
        { id: 4, nome_completo: 'Felipe Rocha', cpf: '159.753.486-00', data_nascimento: new Date(1987, 4, 28), telefone: '(11) 91122-3344', grupo: 'Grupo 4', data_cadastro: new Date(2025, 2, 5), situacao_emprego: 'Formal' },
        { id: 5, nome_completo: 'Camila Souza', cpf: '753.159.486-00', data_nascimento: new Date(1991, 6, 11), telefone: '(11) 95544-6677', grupo: 'Grupo 1', data_cadastro: new Date(2025, 4, 5), situacao_emprego: 'Desempregado' },
        { id: 6, nome_completo: 'Bruno Fernandes', cpf: '951.753.486-00', data_nascimento: new Date(1983, 3, 3), telefone: '(11) 98877-6655', grupo: 'Grupo 2', data_cadastro: new Date(2025, 4, 18), situacao_emprego: 'Informal' },
        { id: 7, nome_completo: 'Aline Ribeiro', cpf: '357.951.486-00', data_nascimento: new Date(1979, 9, 23), telefone: '(11) 96655-4433', grupo: 'Grupo 3', data_cadastro: new Date(2025, 3, 28), situacao_emprego: 'Formal' },
        { id: 8, nome_completo: 'Thiago Gomes', cpf: '654.987.321-00', data_nascimento: new Date(1995, 11, 19), telefone: '(11) 99988-7766', grupo: 'Grupo 4', data_cadastro: new Date(2025, 4, 12), situacao_emprego: 'Desempregado' },
        { id: 9, nome_completo: 'Larissa Almeida', cpf: '852.741.963-00', data_nascimento: new Date(1988, 0, 14), telefone: '(11) 94455-6677', grupo: 'Grupo 1', data_cadastro: new Date(2025, 4, 20), situacao_emprego: 'Informal' },
        { id: 10, nome_completo: 'Marcos Vinícius', cpf: '369.258.147-00', data_nascimento: new Date(1984, 6, 7), telefone: '(11) 93322-1144', grupo: 'Grupo 2', data_cadastro: new Date(2025, 4, 22), situacao_emprego: 'Formal' },
        { id: 11, nome_completo: 'Beatriz Lima', cpf: '147.369.258-00', data_nascimento: new Date(1992, 3, 12), telefone: '(11) 91233-4455', grupo: 'Grupo 3', data_cadastro: new Date(2025, 4, 25), situacao_emprego: 'Informal' },
        { id: 12, nome_completo: 'Rafael Torres', cpf: '258.147.369-00', data_nascimento: new Date(1977, 9, 29), telefone: '(11) 94567-8899', grupo: 'Grupo 4', data_cadastro: new Date(2025, 4, 28), situacao_emprego: 'Desempregado' },
        { id: 13, nome_completo: 'Sabrina Melo', cpf: '741.852.963-00', data_nascimento: new Date(1989, 11, 3), telefone: '(11) 96688-3322', grupo: 'Grupo 1', data_cadastro: new Date(2025, 4, 27), situacao_emprego: 'Formal' }
        ];
      this.loading = false;
    }, 1000);
  }
}
