import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryStore } from '../../core/store/inventory.store';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts.component.html'
})
export class AlertsComponent {

  store = inject(InventoryStore);

  constructor() {
    this.store.loadAlerts();
  }

  getSeverityClass(alert: any): string {
    switch (alert.severity) {
      case 'CRITICAL':
        return 'border-danger text-danger';
      case 'LOW':
        return 'border-warning text-warning';
      default:
        return 'border-secondary';
    }
  }
}
