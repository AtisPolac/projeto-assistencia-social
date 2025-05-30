import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

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
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'recuperar-senha',
    loadComponent: () =>
      import('./components/auth/recuperar-senha/recuperar-senha.component').then(m => m.RecuperarSenhaComponent),
  },
  {
    path: 'vulneraveis',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/assistidos/vulneravel-list/vulneravel-list.component').then(m => m.VulneravelListComponent),
        canActivate: [authGuard]
      },
      {
        path: 'apadrinhar/:id',
        loadComponent: () =>
          import('./components/assistidos/vulneravel-apadrinhar/vulneravel-apadrinhar.component').then(m => m.VulneravelApadrinharComponent),
        canActivate: [authGuard]
      },
    ],
  },
  {
    path: 'assistidos',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/assistidos/assistidos-list/assistidos-list.component').then(m => m.AssistidosListComponent),
        canActivate: [authGuard]
      },
    ],
  },
  {
    path: 'doacoes',
    loadComponent: () =>
      import('./components/doacoes/doacao-list/doacao-list.component').then(m => m.DoacaoListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'estoque',
    loadComponent: () =>
      import('./components/estoque/item-list/item-list.component').then(m => m.ItemListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'grupos',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/grupos/grupo-list/grupo-list.component').then(m => m.GrupoListComponent),
        canActivate: [authGuard]
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./components/grupos/grupo-detail/grupo-detail.component').then(m => m.GrupoDetailComponent),
        canActivate: [authGuard]
      },
    ],
  },
  {
    path: 'relatorios',
    loadComponent: () =>
      import('./components/relatorios/relatorio-assistidos/relatorio-assistidos.component').then(m => m.RelatorioAssistidosComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
