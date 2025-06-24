import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BoxFormDialogComponent } from '../box-form-dialog/box-form-dialog.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-crud-boxes',
  imports: [CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule],
  templateUrl: './crud-boxes.component.html',
  styleUrl: './crud-boxes.component.css'
})
export class CrudBoxesComponent {
  boxes = [
    { id: 1, numero: '401', piso: '4', estado: 'Disponible' },
    { id: 2, numero: '502', piso: '5', estado: 'Ocupado' },
  ];

  formVisible = false;
  boxEditando: any = null;

  usuario = 'UsuarioEjemplo';
  rol = 'Administrador de Sistemas';

  filtroNumero: string = '';
  filtroPiso: string = 'todos';
  filtroEstado: string = 'todos';


  nuevoBox = {
    id: 0,
    numero: '',
    piso: '',
    estado: ''
  };



  constructor(private dialog: MatDialog, private router: Router) { }

  abrirFormulario() {
    const dialogRef = this.dialog.open(BoxFormDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nuevoId = Math.max(...this.boxes.map(b => b.id), 0) + 1;
        this.boxes.push({ ...result, id: nuevoId });
      }
    });
  }

  async confirmarAccion(titulo: string, mensaje: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { titulo, mensaje }
    });

    return dialogRef.afterClosed().toPromise();
  }

  cerrarFormulario() {
    this.formVisible = false;
  }

  async guardarBox() {
    if (this.boxEditando) {
      const confirmado = await this.confirmarAccion('Confirmar edición', '¿Deseas guardar los cambios en este box?');
      if (confirmado) {
        const index = this.boxes.findIndex(b => b.id === this.boxEditando.id);
        this.boxes[index] = { ...this.nuevoBox };
        this.cerrarFormulario();
      }
    } else {
      const confirmado = await this.confirmarAccion('Confirmar creación', '¿Deseas agregar este nuevo box?');
      if (confirmado) {
        const nuevoId = Math.max(...this.boxes.map(b => b.id), 0) + 1;
        this.boxes.push({ ...this.nuevoBox, id: nuevoId });
        this.cerrarFormulario();
      }
    }
  }

  editarBox(box: any) {
    const dialogRef = this.dialog.open(BoxFormDialogComponent, {
      width: '400px',
      data: { box }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.boxes.findIndex(b => b.id === box.id);
        this.boxes[index] = result;
      }
    });
  }

  async eliminarBox(id: number) {
    const confirmado = await this.confirmarAccion('Eliminar box', '¿Estás seguro de que deseas eliminar este box?');
    if (confirmado) {
      this.boxes = this.boxes.filter(b => b.id !== id);
    }
  }

  async cancelarEdicion() {
    const confirmado = await this.confirmarAccion('Cancelar', '¿Seguro que deseas cancelar? Se perderán los cambios.');
    if (confirmado) {
      this.cerrarFormulario();
    }
  }

  filteredBoxes() {
    return this.boxes.filter(box => {
      const coincideNumero = this.filtroNumero === '' || box.numero.includes(this.filtroNumero);
      const coincidePiso = this.filtroPiso === 'todos' || box.piso === this.filtroPiso;
      const coincideEstado = this.filtroEstado === 'todos' || box.estado === this.filtroEstado;
      return coincideNumero && coincidePiso && coincideEstado;
    });
  }
  pisosUnicos(): string[] {
    const pisos = this.boxes.map(b => b.piso);
    return Array.from(new Set(pisos)).sort();
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }


}
