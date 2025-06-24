import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Location } from '@angular/common';



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

  constructor(private router: Router, private location: Location) {}

  cerrarSesion() {
    this.router.navigate(['/login']);
  }

  volverAtras(): void {
  this.location.back();
}

  irAGestionPacientes() {
    this.router.navigate(['agenda-pacientes']);
  }

  irAGestionOfertaEspecialistas() {
    this.router.navigate(['oferta-especialistas']);
  }
}
