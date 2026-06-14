import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { InventoryStore } from '../store/inventory.store';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {

  const store = inject(InventoryStore);

  return next(req).pipe(
    catchError((error) => {

      let message = 'Unexpected error occurred';

      // 👇 si backend manda estructura tipo ErrorResponse
      if (error?.error?.message) {
        message = error.error.message;
      } else if (error?.message) {
        message = error.message;
      }

      // 🔥 UX GLOBAL
      store.setError(message);

      store.toastMessage.set(message);

      setTimeout(() => {
        store.toastMessage.set(null);
      }, 3000);

      return throwError(() => error);
    })
  );
};
