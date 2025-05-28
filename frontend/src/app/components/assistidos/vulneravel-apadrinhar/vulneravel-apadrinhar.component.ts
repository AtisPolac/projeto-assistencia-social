import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Vulneravel {
  id: number;
  nome_completo: string;
  cpf: string;
  data_nascimento: Date;
  genero: string;
  estado_civil: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  email: string;
  situacao_emprego: string;
  renda_familiar: number;
  num_dependentes: number;
  necessidades_especiais: boolean;
  observacoes: string;
  data_cadastro: Date;
}

interface Grupo {
  id: number;
  nome: string;
  vagas_disponiveis: number;
}

@Component({
  selector: 'app-vulneravel-apadrinhar',
  templateUrl: './vulneravel-apadrinhar.component.html',
  styleUrls: ['./vulneravel-apadrinhar.component.scss']
})
export class VulneravelApadrinharComponent implements OnInit {
  vulneravelId: number;
  vulneravel: Vulneravel;
  grupos: Grupo[] = [];
  apadrinharForm: FormGroup;
  loading = true;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.vulneravelId = +this.route.snapshot.paramMap.get('id');
    
    this.apadrinharForm = this.formBuilder.group({
      id_grupo: ['', Validators.required],
      observacoes: ['']
    });
    
    this.carregarDados();
  }

  carregarDados(): void {
    // Simulação de carregamento de dados
    setTimeout(() => {
      this.vulneravel = {
        id: this.vulneravelId,
        nome_completo: 'Maria Oliveira',
        cpf: '123.456.789-00',
        data_nascimento: new Date(1985, 5, 15),
        genero: 'Feminino',
        estado_civil: 'Solteiro',
        endereco: 'Rua das Flores, 123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        telefone: '(11) 98765-4321',
        email: 'maria@exemplo.com',
        situacao_emprego: 'Desempregado',
        renda_familiar: 0,
        num_dependentes: 2,
        necessidades_especiais: false,
        observacoes: 'Perdeu o emprego recentemente devido à pandemia.',
        data_cadastro: new Date(2025, 4, 10)
      };
      
      this.grupos = [
        { id: 1, nome: 'Grupo 1', vagas_disponiveis: 5 },
        { id: 2, nome: 'Grupo 2', vagas_disponiveis: 3 },
        { id: 3, nome: 'Grupo 3', vagas_disponiveis: 5 },
        { id: 4, nome: 'Grupo 4', vagas_disponiveis: 7 }
      ];
      
      this.loading = false;
    }, 1000);
  }

  onSubmit(): void {
    if (this.apadrinharForm.invalid) {
      return;
    }

    this.submitting = true;
    
    // Simulação de envio de dados
    setTimeout(() => {
      this.submitting = false;
      this.snackBar.open('Vulnerável apadrinhado com sucesso!', 'Fechar', {
        duration: 3000
      });
      this.router.navigate(['/assistidos']);
    }, 1500);
  }

  cancelar(): void {
    this.router.navigate(['/vulneraveis', this.vulneravelId]);
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
