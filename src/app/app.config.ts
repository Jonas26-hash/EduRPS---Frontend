import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, HttpInterceptorFn } from '@angular/common/http';
import { SettingsService } from './services/settings.service';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/api/auth/login')) {
    return next(req);
  }
  const t = localStorage.getItem('edurps_token');
  const authReq = t ? req.clone({ setHeaders: { Authorization: `Bearer ${t}` } }) : req;
  return next(authReq);
};

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    // catchError in this style requires importing catchError from rxjs/operators
    catchError((err: any) => {
      if (err && err.status === 401) {
        const auth = inject(AuthService);
        const router = inject(Router);
        try { auth.logout(); } catch {}
        // replace url to avoid history back to protected pages
        try { router.navigate(['/login'], { replaceUrl: true }); } catch {}
      }
      throw err;
    })
  );
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: APP_INITIALIZER,
      useFactory: (s: SettingsService) => () => s.loadFromStorage(),
      deps: [SettingsService],
      multi: true
    },
    provideHttpClient(withInterceptors([tokenInterceptor, authErrorInterceptor])),
  ],
};