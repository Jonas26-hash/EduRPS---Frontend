import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export type Role = 'ADMIN' | 'DIRECTOR' | 'DOCENTE' | 'ESTUDIANTE';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;          // SIEMPRE normalizado en MAYÚSCULAS
  photo?: string;
  schoolName?: string;
  // IDs útiles si los tienes
  idDocente?: number;
  idGrado?: number;
  idAnio?: number;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    role: string;      // puede venir en minúscula — lo normalizamos
    email: string;
    name: string;
    schoolName?: string;
    idDocente?: number;
    idGrado?: number;
    idAnio?: number;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private subj = new BehaviorSubject<User | null>(null);
  currentUser$ = this.subj.asObservable();

  private readonly DEFAULT_SCHOOL = 'I.E. Ricardo Palma Soriano';

  constructor() {
    const cachedUser = localStorage.getItem('edurps_user');
    if (cachedUser) this.subj.next(JSON.parse(cachedUser));
  }

  get currentUser(): User | null {
    return this.subj.value;
  }

  /** Rol normalizado del usuario actual (o null) */
  get normalizedRole(): Role | null {
    const u = this.currentUser;
    if (!u?.role) return null;
    return u.role;
  }

  /** ¿Hay token + user? */
  get isAuthenticated(): boolean {
    const token = localStorage.getItem('edurps_token')
      || localStorage.getItem('token')
      || localStorage.getItem('access_token');
    return !!token && !!this.currentUser;
  }

  login(emailOrUser: string, password: string) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
      emailOrUser, password,
    }).pipe(
      tap(res => {
        localStorage.setItem('edurps_token', res.token);

        const roleUpper = (res.user.role || '').toString().toUpperCase();
        // Mapear DIRECTOR a DOCENTE si tu app usa permisos de docente
        const effectiveRole = (roleUpper === 'DIRECTOR') ? 'DOCENTE' : roleUpper;

        const user: User = {
          id: res.user.id,
          email: res.user.email,
          name: res.user.name,
          role: effectiveRole as Role,
          schoolName: res.user.schoolName || this.DEFAULT_SCHOOL,
          idDocente: res.user.idDocente,
          idGrado: res.user.idGrado,
          idAnio: res.user.idAnio,
        };

        localStorage.setItem('edurps_user', JSON.stringify(user));
        this.subj.next(user);
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout() {
    try { localStorage.removeItem('edurps_token'); } catch {}
    try { localStorage.removeItem('edurps_user'); } catch {}
    try { localStorage.removeItem('token'); } catch {}
    try { localStorage.removeItem('access_token'); } catch {}
    try { sessionStorage.clear(); } catch {}
    this.subj.next(null);
  }
}
