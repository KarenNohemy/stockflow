import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },

  {
    path: 'alerts',
    loadComponent: () =>
      import('./features/alerts/alerts.component')
        .then(m => m.AlertsComponent)
  },

 {
  path: 'movements',
  loadComponent: () =>
    import('./features/movements/movements.component')
      .then(m => m.MovementsComponent)
}
];
