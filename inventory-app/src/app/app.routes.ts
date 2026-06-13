import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
  path: 'alerts',
  loadComponent: () =>
    import('./features/alerts/alerts.component')
      .then(m => m.AlertsComponent)
  }
];
