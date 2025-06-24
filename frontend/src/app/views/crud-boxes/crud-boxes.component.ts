import { Component, OnInit } from '@angular/core';
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
import { BoxService } from '../../services/box.service';
import { Box } from '../../models/box.model';
import { HttpClientModule } from '@angular/common/http';

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
    MatIconModule,
  HttpClientModule],
  templateUrl: './crud-boxes.component.html',
  styleUrl: './crud-boxes.component.css'
})
export class CrudBoxesComponent implements OnInit{
  boxes: Box[] = [];

  formVisible = false;
  boxEditando: Box | null = null;

  estados = [
    { valor: 'disponible', label: 'Disponible' },
    { valor: 'ocupado', label: 'Ocupado' },
    { valor: 'en_mantenimiento', label: 'En mantenimiento' }
  ];

  nuevoBox: Box = {
    id: 0,
    numero: 0,
    piso: 0,
    inmueble: '',
    estado: 'disponible'
  };

  filtroNumero: string = '';
  filtroPiso: string = 'todos';
  filtroEstado: string = 'todos';

  usuario = 'UsuarioEjemplo';
  rol = 'Administrador de Sistemas';

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private boxService: BoxService
  ) {}

  ngOnInit(): void {
    this.cargarBoxes();
  }

  cargarBoxes(): void {
    this.boxService.getBoxes().subscribe({
      next: data => this.boxes = data,
      error: err => console.error('Error al cargar boxes', err)
    });
  }

  abrirFormulario(): void {
    const dialogRef = this.dialog.open(BoxFormDialogComponent, {
    width: '500px',
    disableClose: true,
    data: {
      box: {
        numero: '',
        piso: '',
        estado: 'Disponible',
        inmueble: ''
      }
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.boxService.createBox(result).subscribe({
        next: (nuevoBox) => {
          this.boxes.push(nuevoBox);
        },
        error: (err) => {
          console.error('Error al crear box:', err);
        }
      });
    }
  });
}

  editarBox(box: Box) {
  const dialogRef = this.dialog.open(BoxFormDialogComponent, {
    width: '500px',
    data: { box }  // Pasamos el box actual como data
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.boxService.updateBox(result.id, result).subscribe({
        next: (boxActualizado) => {
          const index = this.boxes.findIndex(b => b.id === boxActualizado.id);
          if (index !== -1) {
            this.boxes[index] = boxActualizado;
          }
        },
        error: (err) => {
          console.error('Error al actualizar box:', err);
        }
      });
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

  async guardarBox(): Promise<void> {
    
    const payload = {
    ...this.nuevoBox,
    numero: Number(this.nuevoBox.numero),
    piso: Number(this.nuevoBox.piso)
  };
  console.log('Payload enviado al backend:', payload);

  if (this.boxEditando) {
    const confirmado = await this.confirmarAccion('Confirmar edición', '¿Deseas guardar los cambios en este box?');
    if (confirmado && this.boxEditando.id) {
      this.boxService.updateBox(this.boxEditando.id, payload).subscribe(() => {
        this.cargarBoxes();
        this.cerrarFormulario();
      });
    }
  } else {
    const confirmado = await this.confirmarAccion('Confirmar creación', '¿Deseas agregar este nuevo box?');
    if (confirmado) {
      this.boxService.createBox(payload).subscribe({
        next: () => {
          this.cargarBoxes();
          this.cerrarFormulario();
        },
        error: (error) => {
          console.error('Error al crear box:', error);
        }
      });
    }
  }
}
  async eliminarBox(id: number): Promise<void> {
    const confirmado = await this.confirmarAccion('Eliminar box', '¿Estás seguro de que deseas eliminar este box?');
    if (confirmado) {
      this.boxService.deleteBox(id).subscribe(() => {
        this.cargarBoxes();
      });
    }
  }

  async cancelarEdicion(): Promise<void> {
    const confirmado = await this.confirmarAccion('Cancelar', '¿Seguro que deseas cancelar? Se perderán los cambios.');
    if (confirmado) {
      this.cerrarFormulario();
    }
  }

  cerrarFormulario(): void {
    this.formVisible = false;
  }

  filteredBoxes(): Box[] {
    return this.boxes.filter(box => {
      const coincideNumero = this.filtroNumero === '' || box.numero.toString().includes(this.filtroNumero);
      const coincidePiso = this.filtroPiso === 'todos' || box.piso.toString() === this.filtroPiso;
      const coincideEstado = this.filtroEstado === 'todos' || box.estado === this.filtroEstado;
      return coincideNumero && coincidePiso && coincideEstado;
    });
  }

  pisosUnicos(): string[] {
    const pisos = this.boxes.map(b => b.piso.toString());
    return Array.from(new Set(pisos)).sort();
  }

  cerrarSesion(): void {
    this.router.navigate(['/login']);
  }
}