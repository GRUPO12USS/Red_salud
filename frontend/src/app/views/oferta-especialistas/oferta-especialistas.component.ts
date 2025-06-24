import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { Location } from '@angular/common';
import { AgregarOfertaDialogEspecialistaComponent } from '../agregar-oferta-dialog-especialista/agregar-oferta-dialog-especialista.component';
import { MatDialog } from '@angular/material/dialog';

interface OfertaEspecialista {
  id: number;
  especialista: string;
  especialidad: string;
  fechaInicio: Date;
  fechaFin: Date;
  horarioDisponible: string;
  observaciones?: string;
  estado: 'Disponible' | 'No Disponible' | '';
}

@Component({
  selector: 'app-oferta-especialistas',
  imports: [FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    CommonModule,
    MatTableModule,
    MatToolbarModule,
  MatDatepickerModule,
MatNativeDateModule],
  templateUrl: './oferta-especialistas.component.html',
  styleUrl: './oferta-especialistas.component.css'
})
export class OfertaEspecialistasComponent implements OnInit {

  usuario = 'UsuarioEjemplo';
  rol = 'Administrador de Sistemas';

  constructor(private router: Router, private dateAdapter: DateAdapter<Date>, private location: Location, private dialog: MatDialog) {
    this.dateAdapter.setLocale('es-CL');
   }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }

  volverAtras(): void {
  this.location.back();
}

irAgendaEspecialistas(): void {
  this.router.navigate(['/agenda-especialistas']);
}


  ofertas: OfertaEspecialista[] = [];

  columnasTabla: string[] = ['especialista', 'especialidad', 'fechaInicio', 'fechaFin', 'horario', 'estado', 'acciones'];
  nuevaOferta: OfertaEspecialista = this.crearOfertaVacia();
  mostrandoFormulario = false;
  
  abrirFormularioOferta(oferta?: OfertaEspecialista): void {
  const dialogRef = this.dialog.open(AgregarOfertaDialogEspecialistaComponent, {
    width: '500px',
    disableClose: true,
    data: oferta ? { ...oferta } : null
  });

  dialogRef.afterClosed().subscribe((result: OfertaEspecialista) => {
    if (result) {
      if (oferta) {

        const index = this.ofertas.findIndex(o => o.id === oferta.id);
        if (index !== -1) {
    this.ofertas[index] = { ...result, id: oferta.id };
    this.ofertas = [...this.ofertas];
        }
      } else {
        const nuevoId = this.ofertas.length > 0 ? Math.max(...this.ofertas.map(o => o.id)) + 1 : 1;
  this.ofertas = [...this.ofertas, { ...result, id: nuevoId }];
      }
    }
  });
}

  ngOnInit(): void {
    this.cargarOfertas();
  }

  cargarOfertas() {
    this.ofertas = [
      {
        id: 1,
        especialista: 'Dr. Juan Pérez',
        especialidad: 'Cardiología',
        fechaInicio: new Date('2025-07-01'),
        fechaFin: new Date('2025-07-31'),
        horarioDisponible: 'Lunes a Viernes 9:00-17:00',
        observaciones: 'Disponibilidad limitada en julio',
        estado: 'Disponible'
      },
      {
        id: 2,
        especialista: 'Dra. María López',
        especialidad: 'Pediatría',
        fechaInicio: new Date('2025-07-15'),
        fechaFin: new Date('2025-08-15'),
        horarioDisponible: 'Martes y Jueves 10:00-15:00',
        estado: 'No Disponible'
      }
    ];
  }

  crearOfertaVacia(): OfertaEspecialista {
    return {
      id: 0,
      especialista: '',
      especialidad: '',
      fechaInicio: new Date(),
      fechaFin: new Date(),
      horarioDisponible: '',
      observaciones: '',
      estado: ''
    };
  }

  mostrarFormulario() {
    this.mostrandoFormulario = true;
  }

  ocultarFormulario() {
    this.mostrandoFormulario = false;
    this.nuevaOferta = this.crearOfertaVacia();
  }

  guardarOferta() {
    if (this.nuevaOferta.id === 0) {
      const nuevoId = this.ofertas.length > 0 ? Math.max(...this.ofertas.map(o => o.id)) + 1 : 1;
      this.nuevaOferta.id = nuevoId;
      this.ofertas.push({ ...this.nuevaOferta });
    } else {
      const index = this.ofertas.findIndex(o => o.id === this.nuevaOferta.id);
      if (index !== -1) {
        this.ofertas[index] = { ...this.nuevaOferta };
      }
    }
    this.ocultarFormulario();
  }

  editarOferta(oferta: OfertaEspecialista) {
    this.nuevaOferta = { ...oferta };
    this.mostrandoFormulario = true;
  }

  eliminarOferta(id: number) {
    this.ofertas = this.ofertas.filter(o => o.id !== id);
  }

}
