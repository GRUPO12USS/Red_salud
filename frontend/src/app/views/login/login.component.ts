import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  rol = 'coordinador';
  mostrarError: boolean = false; 

  constructor(private router: Router) {}

  iniciarSesion() {
    this.mostrarError = false;

    if (!this.username || !this.password || !this.rol) {
      this.mostrarError = true;
      return;
    }
    if (this.rol === 'admin') {
      this.router.navigate(['/admin/boxes']);
    } else {
      this.router.navigate(['/menu']);
    }
  }
}
