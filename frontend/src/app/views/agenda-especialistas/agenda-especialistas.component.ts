import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AsignarHorarioDialogEspecialistaComponent } from '../asignar-horario-dialog-especialista/asignar-horario-dialog-especialista.component';
import { Location } from '@angular/common';


interface HorarioEspecialista {
  id: number;
  especialista: string;
  especialidad: string;
  box: string;
  piso: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
}

@Component({
  standalone: true,
  selector: 'app-agenda-especialistas',
  templateUrl: './agenda-especialistas.component.html',
  styleUrl: './agenda-especialistas.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class AgendaEspecialistasComponent implements OnInit {
  usuario = 'UsuarioEjemplo';
  rol = 'Administrador de Sistemas';

  horarios: string[] = [];
  diasSemana: Date[] = [];
  fechaActual = new Date();
  formularioVisible: boolean = false;

  constructor(private router: Router, private dialog: MatDialog, private location: Location) { }

  volverAtras(): void {
  this.location.back();
}


  abrirFormularioAsignacion(): void {
  const dialogRef = this.dialog.open(AsignarHorarioDialogEspecialistaComponent, {
    width: '500px',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Horario recibido desde el modal:', result);

      const nuevoId = this.horariosEspecialistas.length + 1;

      const nuevoHorario: HorarioEspecialista = {
        id: nuevoId,
        especialista: result.especialista,
        especialidad: result.especialidad,
        box: result.box,
        piso: result.piso,
        fecha: new Date(result.fecha),
        horaInicio: result.horaInicio,
        horaFin: result.horaFin
      };

      this.horariosEspecialistas.push(nuevoHorario);
      this.aplicarFiltros();
    }
  });
}

  
  cerrarSesion() {
    this.router.navigate(['/login']);
  }

  horariosEspecialistas: HorarioEspecialista[] = [];
  horariosFiltrados: HorarioEspecialista[] = [];

  mostrandoFormulario = false;
  nuevoHorario: HorarioEspecialista = this.getHorarioVacio();

  filtrosForm = new FormGroup({
    especialista: new FormControl(''),
    especialidad: new FormControl(''),
    piso: new FormControl(''),
    box: new FormControl(''),
  });

  ngOnInit(): void {
    this.generarHorarios('08:00', '19:30', 30);
    this.generarDiasSemana(this.fechaActual);
    this.cargarHorariosIniciales();
    this.aplicarFiltros();

    this.filtrosForm.valueChanges.subscribe(() => {
      this.aplicarFiltros();
    });
  }

  limpiarFiltros(): void {
  this.filtrosForm.reset();
}

  getHorarioVacio(): HorarioEspecialista {
    return {
      id: 0,
      especialista: '',
      especialidad: '',
      box: '',
      piso: '',
      fecha: new Date(),
      horaInicio: '',
      horaFin: ''
    };
  }

  mostrarFormulario(): void {
    this.mostrandoFormulario = true;
    this.nuevoHorario = this.getHorarioVacio();
  }

  ocultarFormulario(): void {
    this.mostrandoFormulario = false;
  }

  guardarHorario(): void {
    if (this.nuevoHorario.id === 0) {
      const nuevoId = this.horariosEspecialistas.length + 1;
      this.horariosEspecialistas.push({ ...this.nuevoHorario, id: nuevoId });
    } else {
      const index = this.horariosEspecialistas.findIndex(h => h.id === this.nuevoHorario.id);
      if (index !== -1) {
        this.horariosEspecialistas[index] = { ...this.nuevoHorario };
      }
    }

    this.mostrandoFormulario = false;
    this.aplicarFiltros();
  }

  generarHorarios(horaInicio: string, horaFin: string, intervaloMinutos: number): void {
    const [hInicio, mInicio] = horaInicio.split(':').map(Number);
    const [hFin, mFin] = horaFin.split(':').map(Number);
    const horarios: string[] = [];

    let hora = hInicio;
    let minutos = mInicio;
    while (hora < hFin || (hora === hFin && minutos < mFin)) {
      horarios.push(`${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`);
      minutos += intervaloMinutos;
      if (minutos >= 60) {
        minutos -= 60;
        hora++;
      }
    }

    this.horarios = horarios;
  }

  generarDiasSemana(fechaBase: Date): void {
    const lunes = new Date(fechaBase);
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

  cargarHorariosIniciales(): void {
    this.horariosEspecialistas = [
      {
        id: 1,
        especialista: 'Dra. Ana Ruiz',
        especialidad: 'Cardiología',
        box: '101',
        piso: '1',
        fecha: new Date('2025-06-24'),
        horaInicio: '08:30',
        horaFin: '09:30'
      },
      {
        id: 2,
        especialista: 'Dr. Carlos Méndez',
        especialidad: 'Dermatología',
        box: '201',
        piso: '2',
        fecha: new Date('2025-06-25'),
        horaInicio: '09:00',
        horaFin: '10:00'
      }
    ];
  }

  cambiarSemana(direccion: number): void {
    const nuevaFecha = new Date(this.fechaActual);
    nuevaFecha.setDate(nuevaFecha.getDate() + direccion * 7);
    this.fechaActual = nuevaFecha;
    this.generarDiasSemana(this.fechaActual);
  }

  aplicarFiltros(): void {
    const f = this.filtrosForm.value;

    this.horariosFiltrados = this.horariosEspecialistas.filter(h =>
      (!f.especialista || h.especialista.toLowerCase().includes(f.especialista.toLowerCase())) &&
      (!f.especialidad || h.especialidad.toLowerCase().includes(f.especialidad.toLowerCase())) &&
      (!f.piso || h.piso === f.piso) &&
      (!f.box || h.box === f.box)
    );
  }

  obtenerBloques(dia: Date, hora: string): HorarioEspecialista[] {
    const [h, m] = hora.split(':').map(Number);
    const bloqueInicio = h * 60 + m;
    const bloqueFin = bloqueInicio + 30;

    return this.horariosFiltrados.filter(r => {
      const mismaFecha =
        r.fecha.getFullYear() === dia.getFullYear() &&
        r.fecha.getMonth() === dia.getMonth() &&
        r.fecha.getDate() === dia.getDate();

      if (!mismaFecha) return false;

      const [rInicioH, rInicioM] = r.horaInicio.split(':').map(Number);
      const inicioMin = rInicioH * 60 + rInicioM;

      return inicioMin >= bloqueInicio && inicioMin < bloqueFin;
    });
  }
}
