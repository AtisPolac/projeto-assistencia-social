import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { MatList } from '@angular/material/list';

interface CardInfo {
  title: string;
  value: number;
  icon: string;
  color: string;
  route: string;
}

interface AlertItem {
  title: string;
  description: string;
  icon: string;
  severity: 'high' | 'medium' | 'low';
  date: Date;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  
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
    MatList
  ]
})
export class DashboardComponent implements OnInit {
  cards: CardInfo[] = [];
  alerts: AlertItem[] = [];
  recentDonations: any[] = [];
  lowStockItems: any[] = [];
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Inicializar dados do dashboard
    this.initializeDashboardData();
  }

  initializeDashboardData(): void {
    // Dados dos cards
    this.cards = [
      {
        title: 'Assistidos Ativos',
        value: 13,
        icon: 'people',
        color: '#2196F3',
        route: '/assistidos'
      },
      {
        title: 'Vulneráveis em Espera',
        value: 4,
        icon: 'person_add',
        color: '#FFC107',
        route: '/vulneraveis'
      },
      {
        title: 'Doações este Mês',
        value: 9,
        icon: 'volunteer_activism',
        color: '#4CAF50',
        route: '/doacoes'
      },
      {
        title: 'Cestas em Estoque',
        value: 8,
        icon: 'inventory',
        color: '#F44336',
        route: '/estoque'
      }
    ];

    // Dados dos alertas
    this.alerts = [
      {
        title: 'Estoque Crítico',
        description: 'O número de cestas em estoque não é suficiente para atender a demanda atual.',
        icon: 'warning',
        severity: 'high',
        date: new Date(),
        route: '/estoque'
      },
      {
        title: 'Assistência a Expirar',
        description: 'Felipe Rocha - Grupo 1 - Expira em 5 dias',
        icon: 'schedule',
        severity: 'medium',
        date: new Date(),
        route: '/assistidos'
      },
      {
        title: 'Nova Solicitação',
        description: 'Maria Oliveira solicitou assistência',
        icon: 'person_add',
        severity: 'low',
        date: new Date(),
        route: '/vulneraveis'
      }
    ];

    // Dados de doações recentes
    this.recentDonations = [
      {
        id: 1,
        assistido: 'Carlos Pereira',
        data: new Date(),
        itens: 'Cesta Básica',
        gerenciador: 'Ana Silva'
      },
      {
        id: 2,
        assistido: 'Mariana Costa',
        data: new Date(Date.now() - 86400000),
        itens: 'Cobertor',
        gerenciador: 'Pedro Santos'
      },
      {
        id: 3,
        assistido: 'José Oliveira',
        data: new Date(Date.now() - 172800000),
        itens: 'Roupas',
        gerenciador: 'Ana Silva'
      }
    ];

  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'high':
        return 'severity-high';
      case 'medium':
        return 'severity-medium';
      case 'low':
        return 'severity-low';
      default:
        return '';
    }
  }
}
