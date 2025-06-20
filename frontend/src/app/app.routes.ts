import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { AdminLoginComponent } from './views/admin-login/admin-login.component';
import { MenuComponent } from './views/menu/menu.component';
import { AgendaUsuarioComponent } from './views/agenda-usuario/agenda-usuario.component';
import { AgendaComponent } from './views/agenda/agenda.component';
import { CrudBoxesComponent } from './views/crud-boxes/crud-boxes.component';
import { OfertaEspecialistasComponent } from './views/oferta-especialistas/oferta-especialistas.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'admin/login', component: AdminLoginComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'oferta-especialistas', component: OfertaEspecialistasComponent },
    { path: 'agenda', component: AgendaComponent },
    { path: 'agenda-usuario', component: AgendaUsuarioComponent },
    { path: 'admin/boxes', component: CrudBoxesComponent },
    { path: '', redirectTo: 'admin/boxes', pathMatch: 'full' },
];
