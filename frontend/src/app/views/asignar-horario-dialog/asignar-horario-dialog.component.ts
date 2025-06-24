import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


export interface Reserva {
  id: number;
  nombrePaciente: string;
  rut: string;
  box: string;
  piso: string;
  especialidad: string;
  especialista: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
}

@Component({
  selector: 'app-asignar-horario-dialog',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './asignar-horario-dialog.component.html',
  styleUrl: './asignar-horario-dialog.component.css'
})
export class AsignarHorarioDialogComponent {
  reserva: Reserva;

  constructor(
    public dialogRef: MatDialogRef<AsignarHorarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.reserva = {
      id: data.id,
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
  }

  guardar() {
    this.dialogRef.close(this.reserva);
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}

