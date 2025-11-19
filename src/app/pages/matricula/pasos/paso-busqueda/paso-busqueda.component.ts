import { Component, EventEmitter, Output } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-paso-busqueda',
  templateUrl: './paso-busqueda.component.html',
  styleUrls: ['./paso-busqueda.component.css']
})
export class PasoBusquedaComponent {

  @Output() continuar = new EventEmitter<any>();

  dni: string = '';
  loading = false;

  usuarioEncontrado: any = null;
  noExiste = false;

  constructor(private usuariosService: UsuariosService) {}

  buscar() {
    if (this.dni.length !== 8) return;

    this.loading = true;
    this.noExiste = false;
    this.usuarioEncontrado = null;

    this.usuariosService.buscarPorDni(this.dni).subscribe({
      next: (respuesta) => {
        this.loading = false;
        if (respuesta) {
          this.usuarioEncontrado = respuesta;
        } else {
          this.noExiste = true;
        }
      },
      error: () => {
        this.loading = false;
        this.noExiste = true;
      }
    });
  }

  siguiente() {
    this.continuar.emit(this.usuarioEncontrado);
  }
}
