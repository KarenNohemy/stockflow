import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MovementService } from '../../core/services/movement.service';
import { InventoryStore } from '../../core/store/inventory.store';

@Component({
  selector: 'app-movement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movements.component.html'
})
export class MovementsComponent {

  private fb = inject(FormBuilder);
  private movementService = inject(MovementService);
  private store = inject(InventoryStore);

  loading = false;
  error: string | null = null;
  success: string | null = null;

  form = this.fb.group({
    idProduct: [null, [Validators.required]],
    type: ['IN', [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
    reason: ['', [Validators.required]]
  });

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;
    this.success = null;

    this.movementService.createMovement(this.form.value).subscribe({
      next: () => {
        this.success = 'Movimiento registrado correctamente';

        // refresh dashboard data
        this.store.loadProducts();
        this.store.loadAlerts();

        this.form.reset({ type: 'IN', quantity: 1 });
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }
}
