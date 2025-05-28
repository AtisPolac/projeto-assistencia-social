import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  cards: CardInfo[] = [];
  alerts: AlertItem[] = [];
  recentDonations: any[] = [];
  lowStockItems: any[] = [];
  
  // Gráfico de distribuição de assistidos por grupo
  chartData = {
    labels: ['Grupo 1', 'Grupo 2', 'Grupo 3', 'Grupo 4'],
    datasets: [{
      data: [25, 18, 22, 15],
      backgroundColor: ['#2196F3', '#4CAF50', '#FFC107', '#F44336']
    }]
  };

  // Gráfico de doações por mês
  lineChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [{
      label: 'Doações',
      data: [12, 19, 15, 27, 22, 30],
      borderColor: '#2196F3',
      backgroundColor: 'rgba(33, 150, 243, 0.2)',
      tension: 0.4
    }]
  };

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
        value: 80,
        icon: 'people',
        color: '#2196F3',
        route: '/assistidos'
      },
      {
        title: 'Vulneráveis em Espera',
        value: 45,
        icon: 'person_add',
        color: '#FFC107',
        route: '/vulneraveis/fila'
      },
      {
        title: 'Doações este Mês',
        value: 124,
        icon: 'volunteer_activism',
        color: '#4CAF50',
        route: '/doacoes'
      },
      {
        title: 'Itens com Estoque Baixo',
        value: 8,
        icon: 'inventory',
        color: '#F44336',
        route: '/estoque/baixo'
      }
    ];

    // Dados dos alertas
    this.alerts = [
      {
        title: 'Estoque Crítico',
        description: 'Arroz está com estoque abaixo do mínimo',
        icon: 'warning',
        severity: 'high',
        date: new Date(),
        route: '/estoque/1'
      },
      {
        title: 'Assistência a Expirar',
        description: 'João Silva - Grupo 1 - Expira em 3 dias',
        icon: 'schedule',
        severity: 'medium',
        date: new Date(),
        route: '/assistidos/1'
      },
      {
        title: 'Nova Solicitação',
        description: 'Maria Oliveira solicitou assistência',
        icon: 'person_add',
        severity: 'low',
        date: new Date(),
        route: '/vulneraveis/2'
      }
    ];

    // Dados de doações recentes
    this.recentDonations = [
      {
        id: 1,
        assistido: 'Carlos Pereira',
        data: new Date(),
        itens: 5,
        gerenciador: 'Ana Silva'
      },
      {
        id: 2,
        assistido: 'Mariana Costa',
        data: new Date(Date.now() - 86400000),
        itens: 3,
        gerenciador: 'Pedro Santos'
      },
      {
        id: 3,
        assistido: 'José Oliveira',
        data: new Date(Date.now() - 172800000),
        itens: 7,
        gerenciador: 'Ana Silva'
      }
    ];

    // Dados de itens com estoque baixo
    this.lowStockItems = [
      {
        id: 1,
        nome: 'Arroz',
        atual: 5,
        minimo: 20
      },
      {
        id: 2,
        nome: 'Feijão',
        atual: 8,
        minimo: 15
      },
      {
        id: 3,
        nome: 'Óleo',
        atual: 7,
        minimo: 10
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
