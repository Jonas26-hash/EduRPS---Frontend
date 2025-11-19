// src/app/pages/admin/matricula/matricula.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatriculaRoutingModule } from './matricula-routing.module';

// Componentes standalone
import { MatriculaListComponent } from './components/matricula-list/matricula-list.component';
import { MatriculaFormComponent } from './components/matricula-form/matricula-form.component';
import { MatriculaDetailComponent } from './components/matricula-detail/matricula-detail.component';
import { EstudianteSearchComponent } from './components/estudiante-search/estudiante-search.component';
import { PadreSearchComponent } from './components/padre-search/padre-search.component';

// Servicios
import { MatriculaService } from './services/matricula.service';
import { StudentService } from './services/student.service';
import { PadreService } from './services/padre.service';
import { GradoService } from './services/grado.service';
import { SeccionService } from './services/seccion.service';
import { VacanteService } from './services/vacante.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatriculaRoutingModule,
    MatriculaListComponent,
    MatriculaFormComponent,
    MatriculaDetailComponent,
    EstudianteSearchComponent,
    PadreSearchComponent
  ],
  providers: [
    MatriculaService,
    StudentService,
    PadreService,
    GradoService,
    SeccionService,
    VacanteService
  ]
})
export class MatriculaModule { }