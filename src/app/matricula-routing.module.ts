// src/app/pages/admin/matricula/matricula-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Importar las nuevas páginas standalone
import { MatriculaListComponent } from './components/matricula-list/matricula-list.component';
import { MatriculaFormComponent } from './components/matricula-form/matricula-form.component';
import { MatriculaDetailComponent } from './components/matricula-detail/matricula-detail.component';

const routes: Routes = [
  {
    path: '',
    component: MatriculaListComponent
  },
  {
    path: 'nueva',
    component: MatriculaFormComponent
  },
  {
    path: ':id',
    component: MatriculaDetailComponent
  },
  {
    path: ':id/editar',
    component: MatriculaFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatriculaRoutingModule { }