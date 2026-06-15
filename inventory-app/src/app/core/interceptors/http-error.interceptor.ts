import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { InventoryStore } from '../store/inventory.store';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {

  const store = inject(InventoryStore);

  return next(req).pipe(
    catchError((error) => {


      let message = 'Error inesperado, intenta nuevamente';

      // 1. NETWORK ERROR (PRIMERO SIEMPRE)
      if (error.status === 0) {
        message = 'No hay conexión con el servidor';
      }

      // 2. HTTP ERRORS
      else if (error.status === 404) {
        message = error?.error?.message || 'Recurso no encontrado';
      }

      else if (error.status === 500) {
        message = error?.error?.message || 'Error interno del servidor';
      }

      // 3. FALLBACK BACKEND MESSAGE (AL FINAL)
      else if (error?.error?.message) {
        message = error.error.message;
      }

      store.toastMessage.set({
        type: 'error',
        text: message
      });

      return throwError(() => error);
    })
  );
};
