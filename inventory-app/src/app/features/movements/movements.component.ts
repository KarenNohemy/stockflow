import { Component, inject, signal } from '@angular/core';
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

  loading = signal(false);

  // 🔥 FIX CLAVE: idProduct debe ser number o null
  form = this.fb.group({
    idProduct: [null, [Validators.required]],
    type: ['IN', [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
    reason: ['', [Validators.required]]
  });

  submit() {
    if (this.form.invalid || this.loading()) return;

    this.loading.set(true);

    const payload = {
      ...this.form.value,
      idProduct: Number(this.form.value.idProduct)
    };

    this.movementService.createMovement(payload).subscribe({
      next: () => {
        this.loading.set(false);

        this.store.toastMessage.set({
          type: 'success',
          text: 'Movimiento registrado correctamente'
        });

        this.store.refreshAll();

        this.form.reset({
          idProduct: null,
          type: 'IN',
          quantity: 1,
          reason: ''
        });
      },

      error: (err) => {
        this.loading.set(false);

        this.store.toastMessage.set({
          type: 'error',
          text: err?.error?.message ?? 'Error al registrar movimiento'
        });
      }
    });
  }
}
