import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, Role } from '../../services/auth.service';
import { HelpModalComponent } from '../help-modal/help-modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HelpModalComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  usuario = '';
  password = '';
  remember = true;
  loading = false;
  error = '';
  show = false;
  showLogoutToast = false;
  private logoutToastTimer: any;
  helpOpen = false;

  constructor(private auth: AuthService, private router: Router) {}

ngOnInit(): void {
    if (localStorage.getItem('edurps_logout_toast') === '1') {
      localStorage.removeItem('edurps_logout_toast');
      this.showLogoutToast = true;
      this.logoutToastTimer = setTimeout(() => (this.showLogoutToast = false), 2500);
    }
  }

  ngOnDestroy(): void {
    if (this.logoutToastTimer) clearTimeout(this.logoutToastTimer);
  }

  submit(form: NgForm) {
    if (!form.valid) { this.error = 'Completa usuario y contraseña'; return; }
    this.error = '';
    this.loading = true;

    this.auth.login(this.usuario, this.password).subscribe(ok => {
      this.loading = false;
      if (!ok) { this.error = 'Credenciales inválidas'; return; }

      const u = this.auth.currentUser;
      if (!u) { this.error = 'Sesión no válida'; return; }

      this.redirectByRole(u.role);
    });
  }

  private redirectByRole(role: Role) {
    if (role === 'ESTUDIANTE')       this.router.navigate(['/student-dashboard'], { replaceUrl: true });
    else this.router.navigate(['/teacher-dashboard'], { replaceUrl: true });
  }
  openHelp(){ this.helpOpen = true; }
}
