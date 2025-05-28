import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Item {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  unidade_medida: string;
  quantidade_atual: number;
  quantidade_minima: number;
  data_ultima_entrada: Date;
}

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  itens: Item[] = [];
  displayedColumns: string[] = ['nome', 'categoria', 'quantidade', 'unidade', 'status', 'ultima_entrada', 'acoes'];
  loading = true;
  
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Carregar dados dos itens
    this.carregarItens();
  }

  carregarItens(): void {
    // Simulação de carregamento de dados
    setTimeout(() => {
      this.itens = [
        {
          id: 1,
          nome: 'Arroz',
          descricao: 'Arroz tipo 1, pacote de 5kg',
          categoria: 'Alimentos',
          unidade_medida: 'Pacote',
          quantidade_atual: 15,
          quantidade_minima: 20,
          data_ultima_entrada: new Date(2025, 4, 15)
        },
        {
          id: 2,
          nome: 'Feijão',
          descricao: 'Feijão carioca, pacote de 1kg',
          categoria: 'Alimentos',
          unidade_medida: 'Pacote',
          quantidade_atual: 25,
          quantidade_minima: 15,
          data_ultima_entrada: new Date(2025, 4, 15)
        },
        {
          id: 3,
          nome: 'Óleo',
          descricao: 'Óleo de soja, garrafa de 900ml',
          categoria: 'Alimentos',
          unidade_medida: 'Garrafa',
          quantidade_atual: 18,
          quantidade_minima: 10,
          data_ultima_entrada: new Date(2025, 4, 10)
        },
        {
          id: 4,
          nome: 'Leite',
          descricao: 'Leite integral, caixa de 1L',
          categoria: 'Alimentos',
          unidade_medida: 'Caixa',
          quantidade_atual: 30,
          quantidade_minima: 25,
          data_ultima_entrada: new Date(2025, 4, 18)
        },
        {
          id: 5,
          nome: 'Cobertores',
          descricao: 'Cobertores de casal',
          categoria: 'Vestuário',
          unidade_medida: 'Unidade',
          quantidade_atual: 8,
          quantidade_minima: 10,
          data_ultima_entrada: new Date(2025, 3, 25)
        }
      ];
      this.loading = false;
    }, 1000);
  }

  verDetalhes(id: number): void {
    this.router.navigate(['/estoque', id]);
  }

  editarItem(id: number): void {
    this.router.navigate(['/estoque', id, 'editar']);
  }

  novoItem(): void {
    this.router.navigate(['/estoque/novo']);
  }

  registrarEntrada(id: number): void {
    this.router.navigate(['/estoque', id, 'entrada']);
  }

  getStatusEstoque(item: Item): string {
    if (item.quantidade_atual <= 0) {
      return 'Esgotado';
    } else if (item.quantidade_atual < item.quantidade_minima) {
      return 'Baixo';
    } else {
      return 'Normal';
    }
  }

  getStatusClass(item: Item): string {
    if (item.quantidade_atual <= 0) {
      return 'status-esgotado';
    } else if (item.quantidade_atual < item.quantidade_minima) {
      return 'status-baixo';
    } else {
      return 'status-normal';
    }
  }
}
