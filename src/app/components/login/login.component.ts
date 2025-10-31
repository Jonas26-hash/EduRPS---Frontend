// components/login/login.component.ts (ACTUALIZADO)
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  userType: 'teacher' | 'student' = 'teacher';
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password, this.userType).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          if (this.userType === 'teacher') {
            this.router.navigate(['/teacher-dashboard']);
          } else {
            this.router.navigate(['/student-dashboard']);
          }
        } else {
          this.errorMessage = 'Credenciales inválidas';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';
        console.error('Login error:', error);
      }
    });
  }

  onUserTypeChange(): void {
    this.errorMessage = '';
    // Limpiar campos cuando cambie el tipo de usuario
    this.email = '';
    this.password = '';
  }

  // Método para demostración - llenar datos de ejemplo
  fillDemoData(): void {
    if (this.userType === 'teacher') {
      this.email = 'jonas.chavez@edurps.edu.pe';
      this.password = 'docente123';
    } else {
      this.email = 'ana.garcia@edurps.edu.pe';
      this.password = 'estudiante123';
    }
  }
}