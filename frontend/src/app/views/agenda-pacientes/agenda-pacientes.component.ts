import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Reserva } from '../asignar-horario-dialog/asignar-horario-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormularioHorarioPacienteComponent } from '../formulario-horario-paciente/formulario-horario-paciente.component';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-agenda-pacientes',
  imports: [ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule,
    MatNativeDateModule
  ],
   providers: [provideNativeDateAdapter()],
  templateUrl: './agenda-pacientes.component.html',
  styleUrl: './agenda-pacientes.component.css'
})
export class AgendaPacientesComponent implements OnInit {

  usuario = 'UsuarioEjemplo';
  rol = 'Administrador de Sistemas';

  constructor(private router: Router, private dialog: MatDialog, private dateAdapter: DateAdapter<Date>, private injector: Injector, private location: Location) {
     this.dateAdapter.setLocale('es-CL');
   }

   volverAtras(): void {
  this.location.back();
}

  abrirFormularioAsignacion() {
  const dialogRef = this.dialog.open(FormularioHorarioPacienteComponent, {
    width: '600px',
  maxHeight: '90vh',
    disableClose: true,
    injector: this.injector
  });

  dialogRef.afterClosed().subscribe(resultado => {
    if (resultado) {
      this.reservas.push(resultado);
      this.actualizarReservasFiltradas();
    }
  });
}



  filtrosForm = new FormGroup({
    nombrePaciente: new FormControl(''),
    rut: new FormControl(''),
    box: new FormControl(''),
    piso: new FormControl(''),
    especialidad: new FormControl(''),
    especialista: new FormControl(''),
  });

  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];

  diasSemana: Date[] = [];
  horarios: string[] = [];

  ngOnInit(): void {
    this.inicializarDatos();
    this.generarDiasSemana(new Date());
    this.aplicarFiltros();


    this.filtrosForm.valueChanges.subscribe(() => {
      this.aplicarFiltros();
    });
  }

  limpiarFiltros(): void {
    this.filtrosForm.reset();
  }

  inicializarDatos() {
    this.reservas = [
      {
        id: 1,
        nombrePaciente: 'Juan Pérez',
        rut: '12345678-9',
        box: '101',
        piso: '1',
        especialidad: 'Cardiología',
        especialista: 'Dr. Soto',
        fecha: new Date('2025-06-17'),
        horaInicio: '09:00',
        horaFin: '09:30'
      },
      {
        id: 2,
        nombrePaciente: 'María López',
        rut: '98765432-1',
        box: '602',
        piso: '6',
        especialidad: 'Pediatría',
        especialista: 'Dra. Díaz',
        fecha: new Date('2025-06-24'),
        horaInicio: '10:05',
        horaFin: '10:30'
      },
      {
        id: 3,
        nombrePaciente: 'Pedro Ramírez',
        rut: '11223344-5',
        box: '201',
        piso: '2',
        especialidad: 'Dermatología',
        especialista: 'Dra. Gómez',
        fecha: new Date('2025-06-25'),
        horaInicio: '09:45',
        horaFin: '10:02'
      },
    ];

    this.horarios = this.generarHorarios('08:00', '19:30', 30);
  }

  generarHorarios(horaInicio: string, horaFin: string, intervaloMinutos: number): string[] {
    const horarios: string[] = [];
    let [hora, minutos] = horaInicio.split(':').map(Number);
    const [horaFinH, minutosFin] = horaFin.split(':').map(Number);

    while (hora < horaFinH || (hora === horaFinH && minutos < minutosFin)) {
      const hh = hora.toString().padStart(2, '0');
      const mm = minutos.toString().padStart(2, '0');
      horarios.push(`${hh}:${mm}`);

      minutos += intervaloMinutos;
      if (minutos >= 60) {
        minutos -= 60;
        hora++;
      }
    }
    return horarios;
  }

  generarDiasSemana(fecha: Date) {
    const lunes = new Date(fecha);
    const dia = lunes.getDay();
    const diff = (dia === 0 ? -6 : 1) - dia;
    lunes.setDate(lunes.getDate() + diff);

    this.diasSemana = [];
    for (let i = 0; i < 7; i++) {
      const diaActual = new Date(lunes);
      diaActual.setDate(lunes.getDate() + i);
      this.diasSemana.push(diaActual);
    }
  }

  aplicarFiltros() {
    const {
      nombrePaciente,
      rut,
      box,
      piso,
      especialidad,
      especialista,
    } = this.filtrosForm.value;

    this.reservasFiltradas = this.reservas.filter(r => {
      const dentroSemana = this.diasSemana.some(dia =>
        r.fecha.getFullYear() === dia.getFullYear() &&
        r.fecha.getMonth() === dia.getMonth() &&
        r.fecha.getDate() === dia.getDate()
      );

      const normalizar = (texto: string) =>
        texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();


      const cumpleNombre = nombrePaciente
        ? normalizar(r.nombrePaciente).includes(normalizar(nombrePaciente))
        : true;
      const cumpleRut = rut ? r.rut.toLowerCase().includes(rut.toLowerCase()) : true;
      const cumpleBox = box ? r.box.toLowerCase().includes(box.toLowerCase()) : true;
      const cumplePiso = piso ? r.piso.toLowerCase().includes(piso.toLowerCase()) : true;
      const cumpleEspecialidad = especialidad ? normalizar(r.especialidad).includes(normalizar(especialidad)) : true;
      const cumpleEspecialista = especialista ? normalizar(r.especialista).includes(normalizar(especialista)) : true;

      return dentroSemana && cumpleNombre && cumpleRut && cumpleBox &&
        cumplePiso && cumpleEspecialidad && cumpleEspecialista;
    });
  }


  reservasEnCelda(dia: Date, hora: string): Reserva[] {
    const [horaBase, minutoBase] = hora.split(':').map(Number);
    const bloqueInicio = horaBase * 60 + minutoBase;
    const bloqueFin = bloqueInicio + 30;

    return this.reservasFiltradas.filter(r => {
      const mismaFecha =
        r.fecha.getFullYear() === dia.getFullYear() &&
        r.fecha.getMonth() === dia.getMonth() &&
        r.fecha.getDate() === dia.getDate();

      if (!mismaFecha) return false;

      const [hInicio, mInicio] = r.horaInicio.split(':').map(Number);
      const [hFin, mFin] = r.horaFin.split(':').map(Number);
      const inicioReserva = hInicio * 60 + mInicio;
      const finReserva = hFin * 60 + mFin;

      return inicioReserva < bloqueFin && finReserva > bloqueInicio;
    });
  }

  fechaActual = new Date();

  cambiarSemana(direccion: number): void {
    const nuevaFecha = new Date(this.fechaActual);
    nuevaFecha.setDate(nuevaFecha.getDate() + (7 * direccion));
    this.fechaActual = nuevaFecha;

    this.generarDiasSemana(this.fechaActual);
    this.aplicarFiltros();
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }

  asignandoHorario = false;

nuevaReserva: Reserva = {
  id: 0,
  nombrePaciente: '',
  rut: '',
  box: '',
  piso: '',
  especialidad: '',
  especialista: '',
  fecha: new Date(),
  horaInicio: '08:00',
  horaFin: '08:30'
};

guardarReserva() {
  this.reservas.push({ ...this.nuevaReserva });
  this.aplicarFiltros();
  this.asignandoHorario = false;
}
cerrarFormulario() {
  this.asignandoHorario = false;
}

actualizarReservasFiltradas(): void {
  this.reservasFiltradas = this.reservas.filter(reserva => {
    const coincideNombre = this.filtrosForm.value.nombrePaciente ?
      reserva.nombrePaciente?.toLowerCase().includes(this.filtrosForm.value.nombrePaciente.toLowerCase()) : true;

    const coincideRut = this.filtrosForm.value.rut ?
      reserva.rut?.toLowerCase().includes(this.filtrosForm.value.rut.toLowerCase()) : true;

    const coincideEspecialidad = this.filtrosForm.value.especialidad ?
      reserva.especialidad?.toLowerCase().includes(this.filtrosForm.value.especialidad.toLowerCase()) : true;

    const coincideEspecialista = this.filtrosForm.value.especialista ?
      reserva.especialista?.toLowerCase().includes(this.filtrosForm.value.especialista.toLowerCase()) : true;

    const coincideBox = this.filtrosForm.value.box ?
      reserva.box?.toString().includes(this.filtrosForm.value.box.toString()) : true;

    const coincidePiso = this.filtrosForm.value.piso ?
      reserva.piso?.toString().includes(this.filtrosForm.value.piso.toString()) : true;

    return coincideNombre && coincideRut && coincideEspecialidad && coincideEspecialista && coincideBox && coincidePiso;
  });
}


}
