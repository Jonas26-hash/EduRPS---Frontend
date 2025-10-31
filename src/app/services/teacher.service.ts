import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface MenuItem {
  title: string;
  icon: string;
  route: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor() { }

  getTeacherMenuItems(): Observable<MenuItem[]> {
    const menuItems: MenuItem[] = [
      {
        title: 'Portal del\ndocente',
        icon: 'assets/Img/portal-estu.svg',
        route: '/teacher/portal'
      },
      {
        title: 'Asistencia',
        icon: 'assets/Img/Asis.svg',
        route: '/teacher/attendance'
      },
      {
        title: 'Plan\nacademico',
        icon: 'assets/Img/Plan.svg',
        route: '/teacher/academic-plan'
      },
      {
        title: 'Biblioteca\nElectronica',
        icon: 'assets/Img/BiblioElec.svg',
        route: '/teacher/library'
      }
    ];

    return of(menuItems);
  }

  getTeacherProfile(): Observable<any> {
    return of({
      name: 'Jonás Chávez Bolaños',
      role: 'Docente',
      grade: '5° Grado',
      profileImage: null
    });
  }
}