import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import localeEsCL from '@angular/common/locales/es-CL';
import { registerLocaleData } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

registerLocaleData(localeEsCL);

@Component({
  selector: 'app-agregar-oferta-dialog-especialista',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './agregar-oferta-dialog-especialista.component.html',
  styleUrls: ['./agregar-oferta-dialog-especialista.component.css'],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CL' },
    provideNativeDateAdapter(),
  ],
})
export class AgregarOfertaDialogEspecialistaComponent {
  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgregarOfertaDialogEspecialistaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
    private dialog: MatDialog
  ) {
    this.formulario = this.fb.group({
      especialista: [null, Validators.required],
      especialidad: [null, Validators.required],
      fechaInicio: [null, Validators.required],
      fechaFin: [null, Validators.required],
      horarioDisponible: [null, Validators.required],
      observaciones: [''],
      estado: ['Disponible', Validators.required]
    });
    if (data) {
    this.formulario.patchValue(data);
    }
  }

  minDate = new Date();

  async cancelar() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '350px',
    data: {
      titulo: 'Cancelar',
      mensaje: '¿Seguro que deseas cancelar? Se perderán los cambios.'
    }
  });

  const confirmado = await dialogRef.afterClosed().toPromise();
  if (confirmado) {
    this.dialogRef.close();
  }
}

  guardar(): void {
    if (this.formulario.valid) {
      this.dialogRef.close(this.formulario.value);
    }
  }

  
}
