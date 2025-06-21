import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';


@Component({
  standalone: true,
  selector: 'app-menu',
  imports: [CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  usuario = 'UsuarioEjemplo'; 
  rol = 'Administrador de Sistemas'; 

  constructor(private router: Router) {}

  cerrarSesion() {
    this.router.navigate(['/login']);
  }

  irAGestionPacientes() {
    this.router.navigate(['agenda-pacientes']);
  }

  irAGestionOfertaEspecialistas() {
    this.router.navigate(['oferta-especialistas']);
  }
}
