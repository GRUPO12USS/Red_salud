import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';


@Component({
  standalone: true,
  selector: 'app-box-form-dialog',
  imports: [FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
  MatIconModule],
  templateUrl: './box-form-dialog.component.html',
  styleUrl: './box-form-dialog.component.css'
})
export class BoxFormDialogComponent {
  box = {
    id: 0,
    numero: '',
    piso: '',
    estado: ''
  };

  pisoSugerido = '';
  pisoEditadoManualmente = false;
  pisosDisponibles = ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

  constructor(
  public dialogRef: MatDialogRef<BoxFormDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private dialog: MatDialog   // 👈 agrega esta línea
) {
  if (data?.box) {
    this.box = { ...data.box };
  }
}

  obtenerPisoDesdeNumero(numero: string): string {
    if (!numero) return '';
    return numero.length >= 3 ? numero.charAt(0) : '';
  }

  verificarInconsistenciaDePiso() {
  const pisoDetectado = this.obtenerPisoDesdeNumero(this.box.numero);
  if (pisoDetectado) {
    this.pisoSugerido = pisoDetectado;
  } else {
    this.pisoSugerido = '';
  }
}

  actualizarPisoDesdeNumero() {
    this.verificarInconsistenciaDePiso();
  if (!this.pisoEditadoManualmente && this.pisoSugerido) {
    this.box.piso = this.pisoSugerido;
  }
}

  onPisoEditado() {
    this.pisoEditadoManualmente = true;
    this.verificarInconsistenciaDePiso();
  }

  guardar() {
    this.dialogRef.close(this.box);
  }

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
}
