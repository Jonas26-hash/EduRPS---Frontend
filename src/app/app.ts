import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { SettingsService } from './services/settings.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  constructor(
    private theme: ThemeService,
    private settings: SettingsService,
    private auth: AuthService,
    private router: Router
  ) {
    // Load persisted settings as early as possible so theme & vars are applied globally
    this.settings.loadFromStorage();
    // Keep the theme service init in case other parts rely on its keys (no-op if already applied)
    this.theme.init();

    // Enforce auth rules on browser history navigation (back/forward)
    window.addEventListener('popstate', () => {
      const token = localStorage.getItem('edurps_token') || localStorage.getItem('token') || localStorage.getItem('access_token');
      const hasUser = !!this.auth.currentUser;

      // If no token or no user, always go to login
      if (!token || !hasUser) {
        try { this.router.navigate(['/login'], { replaceUrl: true }); } catch {}
        return;
      }

      // If user is authenticated but the user navigated to /login via back, send them back to dashboard
      if (location.pathname === '/login') {
        const role = (this.auth.currentUser?.role || '').toString();
        const dest = role.includes('ESTUDIANTE') ? '/student-dashboard' : '/teacher-dashboard';
        try { this.router.navigate([dest], { replaceUrl: true }); } catch {}
      }
    });
  }
}
