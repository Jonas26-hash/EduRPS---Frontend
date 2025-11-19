import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated) return true;

  // Redirige al login con returnUrl para volver a la ruta original
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
