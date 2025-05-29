import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CitaListComponent } from './cita-list/cita-list.component';
import { CitaFormComponent } from './cita-form/cita-form.component';

const routes: Routes = [
  { path: '', component: CitaListComponent },
  { path: 'crear', component: CitaFormComponent },
  { path: 'editar/:id', component: CitaFormComponent },
  { path: '**', redirectTo: '' }
];


@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
