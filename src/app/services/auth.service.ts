// services/auth.service.ts (ACTUALIZADO)
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  grade?: string;
  section?: string; // Agregado para estudiantes
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    // Verificar si hay usuario guardado
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string, userType: 'teacher' | 'student' = 'teacher'): Observable<boolean> {
    return new Observable(observer => {
      // Simulación de login con diferentes tipos de usuario
      if (email && password) {
        let user: User;
        
        if (userType === 'teacher') {
          user = {
            id: '1',
            name: 'Jonás Chávez Bolaños',
            email: email,
            role: 'teacher',
            grade: '5° Grado'
          };
        } else {
          user = {
            id: '2',
            name: 'Ana María García López',
            email: email,
            role: 'student',
            grade: '5° Grado',
            section: 'A'
          };
        }
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        observer.next(true);
        observer.complete();
      } else {
        observer.next(false);
        observer.complete();
      }
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isTeacher(): boolean {
    return this.currentUserSubject.value?.role === 'teacher';
  }

  isStudent(): boolean {
    return this.currentUserSubject.value?.role === 'student';
  }
}