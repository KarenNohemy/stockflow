import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Movement } from '../../../shared/models/movement.model';
import { MovementService } from '../../../core/services/movement.service';

@Component({
  selector: 'app-movement-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movements-history.component.html'
})
export class MovementHistoryComponent implements OnInit {

  @Input({ required: true })
  productId!: number;

  private movementService = inject(MovementService);

  movements = signal<Movement[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
  this.loadHistory();
  }

  ngOnChanges() {
  if (this.productId) {
    this.loadHistory();
  }
  }


  loadHistory() {
    this.loading.set(true);

    this.movementService.getHistory(this.productId).subscribe({
      next: (data: any) => {
        this.movements.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
      }
    });
  }
}
