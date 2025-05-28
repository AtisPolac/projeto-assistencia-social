import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'recuperar-senha',
    loadComponent: () =>
      import('./components/auth/recuperar-senha/recuperar-senha.component').then(m => m.RecuperarSenhaComponent),
  },
  {
    path: 'assistidos',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/assistidos/vulneravel-list/vulneravel-list.component').then(m => m.VulneravelListComponent),
      },
      {
        path: 'apadrinhar',
        loadComponent: () =>
          import('./components/assistidos/vulneravel-apadrinhar/vulneravel-apadrinhar.component').then(m => m.VulneravelApadrinharComponent),
      },
    ],
  },
  {
    path: 'doacoes',
    loadComponent: () =>
      import('./components/doacoes/doacao-list/doacao-list.component').then(m => m.DoacaoListComponent),
  },
  {
    path: 'estoque',
    loadComponent: () =>
      import('./components/estoque/item-list/item-list.component').then(m => m.ItemListComponent),
  },
  {
    path: 'grupos',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/grupos/grupo-list/grupo-list.component').then(m => m.GrupoListComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./components/grupos/grupo-detail/grupo-detail.component').then(m => m.GrupoDetailComponent),
      },
    ],
  },
  {
    path: 'relatorios',
    loadComponent: () =>
      import('./components/relatorios/relatorio-assistidos/relatorio-assistidos.component').then(m => m.RelatorioAssistidosComponent),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
