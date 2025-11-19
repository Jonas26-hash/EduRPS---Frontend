import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grado } from '../models/grado.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GradoService {
  private apiUrl = `${environment.apiUrl}/api/grados`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
