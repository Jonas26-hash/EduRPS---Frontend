import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // <- plural y array
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  loading = false;
  errorMsg = '';
  returnUrl: string | null = null;

  ngOnInit(): void {
    this.form = this.fb.group({
      emailOrUser: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });

    // si fuiste redirigido por el guard, vendrá returnUrl
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  }

  get f() { return this.form.controls; }

  async submit() {
    this.errorMsg = '';
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    const { emailOrUser, password } = this.form.value;

    this.auth.login(emailOrUser, password).subscribe({
      next: ok => {
        this.loading = false;
        if (!ok) {
          this.errorMsg = 'Credenciales inválidas.';
          return;
        }

        // si había returnUrl (por ejemplo: /docente/curso/5), respétalo
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
          return;
        }

        // si no, decide dashboard por rol normalizado
        const role = this.auth.normalizedRole; // 'DOCENTE' | 'ESTUDIANTE' | ...
        if (role === 'ESTUDIANTE') {
          this.router.navigate(['/student-dashboard']);
        } else {
          // DOCENTE, DIRECTOR, ADMIN -> usan el dashboard de docente
          this.router.navigate(['/teacher-dashboard']);
        }
      },
      error: _ => {
        this.loading = false;
        this.errorMsg = 'No se pudo iniciar sesión. Inténtalo otra vez.';
      }
    });
  }
}
