import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { registerLocaleData } from '@angular/common';
import localeEsCL from '@angular/common/locales/es-CL';
import { LOCALE_ID } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';



registerLocaleData(localeEsCL);

@Component({
  standalone: true,
  selector: 'app-formulario-horario-paciente',
  imports: [
    CommonModule,
  ReactiveFormsModule,  
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatIconModule,
  MatDialogModule
  ],
  templateUrl: './formulario-horario-paciente.component.html',
  styleUrls: ['./formulario-horario-paciente.component.css'],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CL' },
    provideNativeDateAdapter(),
  ],
})
export class FormularioHorarioPacienteComponent implements OnInit{
  formulario!: FormGroup;
  pisoAutoDetectado: number | '' = '';
  mensajeAdvertencia: string = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormularioHorarioPacienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {
    this.formulario = this.fb.group({
      nombrePaciente: ['', Validators.required],
      rut: ['', Validators.required],
      box: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      piso: ['', Validators.required],
      especialidad: ['', Validators.required],
      especialista: ['', Validators.required],
      fecha: [new Date(), Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
    });
  }

  minDate = new Date();

  ngOnInit(): void {
  this.formulario.get('box')?.valueChanges.subscribe(boxValue => {
    const pisoDetectado = this.obtenerPisoPorBox(boxValue);
    const pisoNum = parseInt(pisoDetectado, 10);
    if (!isNaN(pisoNum)) {
      this.pisoAutoDetectado = pisoNum;
      this.formulario.patchValue({ piso: pisoNum }, { emitEvent: false });
      this.mensajeAdvertencia = '';
    }
  });

  this.formulario.get('piso')?.valueChanges.subscribe(pisoManual => {
    if (this.pisoAutoDetectado && pisoManual !== this.pisoAutoDetectado) {
      this.mensajeAdvertencia = `⚠️ Estás modificando el piso detectado automáticamente (${this.pisoAutoDetectado}).`;
    } else {
      this.mensajeAdvertencia = '';
    }
  });
}

  obtenerPisoPorBox(box: string): string {
    if (!box) return '';

    const match = String(box).match(/^(\d+)/);
    if (!match) return '';

    const numeroStr = match[1];
    const length = numeroStr.length;

    let piso = '';

    if (length >= 4) {
      piso = numeroStr.substring(0, 2);
    } else if (length === 3) {
      piso = numeroStr.substring(0, 1);
    } else if (length <= 2) {
      piso = '1';
    }

    return piso;
  }

  actualizarMensajeAdvertencia(): void {
    const pisoManual = this.formulario.get('piso')?.value;
    if (this.pisoAutoDetectado !== null && pisoManual && +pisoManual !== this.pisoAutoDetectado) {
      this.mensajeAdvertencia = `⚠️ El número ingresado sugiere que este box está en el piso ${this.pisoAutoDetectado}, pero se seleccionó el piso ${pisoManual}.`;
    } else {
      this.mensajeAdvertencia = '';
    }
  }

  async cancelar() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { titulo: 'Cancelar', mensaje: '¿Seguro que deseas cancelar? Se perderán los cambios.' }
    });
    const confirmado = await dialogRef.afterClosed().toPromise();
    if (confirmado) this.dialogRef.close();
  }

  guardar() {
    if (this.formulario.valid) {
      this.dialogRef.close(this.formulario.value);
    }
  }

  onWheel(event: WheelEvent): void {
  (event.target as HTMLInputElement).blur(); 
  event.preventDefault();
}
}

