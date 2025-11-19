import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService, Role } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowed = ((route.data?.['roles'] as Role[]) ?? []).map(r => r.toUpperCase()) as Role[];

  const u = auth.currentUser;
  if (!u) { return router.createUrlTree(['/login']); }

  // Rol normalizado del usuario actual
  const effective: Role | null = (u.role || '').toString().toUpperCase() as Role;

  const ok = allowed.length === 0 || (effective && allowed.includes(effective));
  return ok ? true : router.createUrlTree(['/login']);
};
