import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Especialista } from '../../services/especialista.service';

@Component({
  standalone: true,
  selector: 'app-formulario-especialista',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Nuevo' }} Especialista</h2>
    
    <div mat-dialog-content>
      <form [formGroup]="formulario">
        <mat-form-field appearance="fill" style="width: 100%;">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" required>
          <mat-error *ngIf="formulario.get('nombre')?.invalid">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" style="width: 100%;">
          <mat-label>Especialidad</mat-label>
          <input matInput formControlName="especialidad" required>
          <mat-error *ngIf="formulario.get('especialidad')?.invalid">
            La especialidad es requerida
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" style="width: 100%;">
          <mat-label>Piso</mat-label>
          <input matInput type="number" formControlName="piso" required min="1">
          <mat-error *ngIf="formulario.get('piso')?.invalid">
            El piso es requerido y debe ser mayor a 0
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" style="width: 100%;">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="estado" required>
            <mat-option value="Disponible">Disponible</mat-option>
            <mat-option value="No Disponible">No Disponible</mat-option>
          </mat-select>
          <mat-error *ngIf="formulario.get('estado')?.invalid">
            El estado es requerido
          </mat-error>
        </mat-form-field>
      </form>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-raised-button color="primary" [disabled]="formulario.invalid" (click)="guardar()">
        <mat-icon>save</mat-icon> Guardar
      </button>
      <button mat-button (click)="cancelar()">
        <mat-icon>cancel</mat-icon> Cancelar
      </button>
    </div>
  `,
  styles: [`
    mat-form-field {
      margin-bottom: 10px;
    }
  `]
})
export class FormularioEspecialistaComponent {
  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormularioEspecialistaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Especialista | null
  ) {
    this.formulario = this.fb.group({
      nombre: [data?.nombre || '', Validators.required],
      especialidad: [data?.especialidad || '', Validators.required],
      piso: [data?.piso || 1, [Validators.required, Validators.min(1)]],
      estado: [data?.estado || 'Disponible', Validators.required]
    });
  }

  guardar(): void {
    if (this.formulario.valid) {
      const especialista: Especialista = {
        ...this.formulario.value,
        id: this.data?.id
      };
      this.dialogRef.close(especialista);
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
