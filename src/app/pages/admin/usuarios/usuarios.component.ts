import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService, Usuario } from '../../../services/usuarios.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>Usuarios</h2>
      <div *ngIf="loading">Cargando...</div>
      <div *ngIf="error" class="error">{{ error }}</div>
      <table *ngIf="!loading && usuarios.length" class="tbl">
        <thead><tr><th>#</th><th>Nombre</th><th>Email</th><th>Rol</th></tr></thead>
        <tbody>
          <tr *ngFor="let u of usuarios; index as i">
            <td>{{ i+1 }}</td>
            <td>{{ u.nombre }} {{ u.apellido }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.rol }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles:[`
    .card{background:#fff;padding:16px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.06);margin:16px;font-family:Georgia,serif}
    .tbl{width:100%;border-collapse:collapse}
    .tbl th,.tbl td{border-bottom:1px solid #eee;padding:8px 6px;text-align:left}
    .error{color:#c62828;background:#ffebee;border-left:4px solid #c62828;padding:8px;border-radius:8px}
  `]
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  error = '';
  constructor(private api: UsuariosService) {}
  ngOnInit() {
    this.loading = true;
    this.api.listar().subscribe({
      next: d => { this.usuarios = d; this.loading = false; },
      error: e => { this.error = 'No se pudo cargar usuarios'; this.loading = false; console.error(e); }
    });
  }
}
