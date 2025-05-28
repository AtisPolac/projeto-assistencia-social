import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

interface Gerenciador {
  id: number;
  nome: string;
  email: string;
  data_atribuicao: Date;
}

interface Assistido {
  id: number;
  nome: string;
  cpf: string;
  data_inicio: Date;
  data_fim_prevista: Date;
}

@Component({
  selector: 'app-grupo-detail',
  templateUrl: './grupo-detail.component.html',
  styleUrls: ['./grupo-detail.component.scss']
})
export class GrupoDetailComponent implements OnInit {
  grupoId: number;
  grupo: any = {};
  gerenciadores: Gerenciador[] = [];
  assistidos: Assistido[] = [];
  loading = true;
  editMode = false;
  grupoForm: FormGroup;
  
  gerenciadoresColumns: string[] = ['nome', 'email', 'data_atribuicao', 'acoes'];
  assistidosColumns: string[] = ['nome', 'cpf', 'data_inicio', 'data_fim_prevista', 'acoes'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.grupoId = +this.route.snapshot.paramMap.get('id');
    this.editMode = this.router.url.includes('/editar');
    
    this.initForm();
    this.carregarDados();
  }

  initForm(): void {
    this.grupoForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', Validators.required],
      capacidade_maxima: [20, [Validators.required, Validators.min(1)]],
      ativo: [true]
    });
  }

  carregarDados(): void {
    // Simulação de carregamento de dados
    setTimeout(() => {
      this.grupo = {
        id: this.grupoId,
        nome: `Grupo ${this.grupoId}`,
        descricao: `Descrição do Grupo ${this.grupoId}`,
        capacidade_maxima: 20,
        assistidos_ativos: 15,
        data_criacao: new Date(2025, 0, 15),
        ativo: true
      };

      this.gerenciadores = [
        {
          id: 1,
          nome: 'Ana Silva',
          email: 'ana.silva@exemplo.com',
          data_atribuicao: new Date(2025, 1, 10)
        },
        {
          id: 2,
          nome: 'Pedro Santos',
          email: 'pedro.santos@exemplo.com',
          data_atribuicao: new Date(2025, 2, 5)
        }
      ];

      this.assistidos = [
        {
          id: 1,
          nome: 'Carlos Pereira',
          cpf: '123.456.789-00',
          data_inicio: new Date(2025, 2, 15),
          data_fim_prevista: new Date(2025, 5, 15)
        },
        {
          id: 2,
          nome: 'Mariana Costa',
          cpf: '987.654.321-00',
          data_inicio: new Date(2025, 3, 1),
          data_fim_prevista: new Date(2025, 6, 1)
        },
        {
          id: 3,
          nome: 'José Oliveira',
          cpf: '456.789.123-00',
          data_inicio: new Date(2025, 3, 10),
          data_fim_prevista: new Date(2025, 6, 10)
        }
      ];

      if (this.editMode) {
        this.grupoForm.patchValue({
          nome: this.grupo.nome,
          descricao: this.grupo.descricao,
          capacidade_maxima: this.grupo.capacidade_maxima,
          ativo: this.grupo.ativo
        });
      }

      this.loading = false;
    }, 1000);
  }

  salvar(): void {
    if (this.grupoForm.invalid) {
      return;
    }

    this.loading = true;

    // Simulação de salvamento
    setTimeout(() => {
      this.loading = false;
      this.snackBar.open('Grupo salvo com sucesso!', 'Fechar', {
        duration: 3000
      });
      this.router.navigate(['/grupos', this.grupoId]);
    }, 1000);
  }

  cancelar(): void {
    this.router.navigate(['/grupos', this.grupoId]);
  }

  adicionarGerenciador(): void {
    // Implementação futura: abrir diálogo para adicionar gerenciador
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', {
      duration: 3000
    });
  }

  removerGerenciador(id: number): void {
    // Implementação futura: confirmar e remover gerenciador
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', {
      duration: 3000
    });
  }

  verAssistido(id: number): void {
    this.router.navigate(['/assistidos', id]);
  }

  getOcupacaoPercentual(): number {
    return Math.round((this.grupo.assistidos_ativos / this.grupo.capacidade_maxima) * 100);
  }

  getOcupacaoClass(): string {
    const percentual = this.getOcupacaoPercentual();
    if (percentual >= 90) {
      return 'ocupacao-alta';
    } else if (percentual >= 70) {
      return 'ocupacao-media';
    } else {
      return 'ocupacao-baixa';
    }
  }

  getDiasRestantes(dataFim: Date): number {
    const hoje = new Date();
    const diff = dataFim.getTime() - hoje.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getStatusClass(dataFim: Date): string {
    const dias = this.getDiasRestantes(dataFim);
    if (dias <= 7) {
      return 'status-critico';
    } else if (dias <= 30) {
      return 'status-atencao';
    } else {
      return 'status-normal';
    }
  }
}
