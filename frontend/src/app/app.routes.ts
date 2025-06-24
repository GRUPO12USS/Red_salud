import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { AdminLoginComponent } from './views/admin-login/admin-login.component';
import { MenuComponent } from './views/menu/menu.component';
import { CrudBoxesComponent } from './views/crud-boxes/crud-boxes.component';
import { OfertaEspecialistasComponent } from './views/oferta-especialistas/oferta-especialistas.component';
import { AgendaEspecialistasComponent } from './views/agenda-especialistas/agenda-especialistas.component';
import { AgendaPacientesComponent } from './views/agenda-pacientes/agenda-pacientes.component';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./views/login/login.component').then(m => m.LoginComponent)
    },
    { path: 'admin/login', component: AdminLoginComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'oferta-especialistas', component: OfertaEspecialistasComponent },
    { path: 'agenda-especialistas', component: AgendaEspecialistasComponent },
    { path: 'agenda-pacientes', component: AgendaPacientesComponent },
    { path: 'admin/boxes', component: CrudBoxesComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];
