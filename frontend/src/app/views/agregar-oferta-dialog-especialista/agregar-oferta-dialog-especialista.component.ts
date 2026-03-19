import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import localeEsCL from '@angular/common/locales/es-CL';
import { CommonModule, registerLocaleData } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { EspecialistaService, Especialista } from '../../services/especialista.service';
import { BoxService } from '../../services/box.service';
import { Box } from '../../models/box.model';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { FormularioEspecialistaComponent } from '../asignar-horario-dialog-especialista/formulario-especialista.component';

registerLocaleData(localeEsCL);

@Component({
  selector: 'app-agregar-oferta-dialog-especialista',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
  templateUrl: './agregar-oferta-dialog-especialista.component.html',
  styleUrls: ['./agregar-oferta-dialog-especialista.component.css'],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CL' },
    provideNativeDateAdapter(),
  ],
})
export class AgregarOfertaDialogEspecialistaComponent implements OnInit {
  formulario: FormGroup;
  especialistas: Especialista[] = [];
  especialistasFiltrados!: Observable<Especialista[]>;
  boxes: Box[] = [];
  pisosDisponibles: number[] = [];
  cantidadBoxesPorPiso: { [key: number]: number } = {};
  mensajeErrorHorario: string = '';
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgregarOfertaDialogEspecialistaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private especialistaService: EspecialistaService,
    private boxService: BoxService,
    private dialog: MatDialog
  ) {
    this.formulario = this.fb.group({
      especialista: [null, Validators.required],
      especialidad: [null, Validators.required],
      fecha_inicio: [null, Validators.required],
      fecha_fin: [null, Validators.required],
      piso: [null, Validators.required],
      hora_inicio: [null, Validators.required],
      hora_fin: [null, Validators.required],
      observaciones: [''],
      estado: ['Disponible', Validators.required]
    });

    // Validación de horarios
    this.formulario.get('hora_inicio')?.valueChanges.subscribe(() => this.validarHorarios());
    this.formulario.get('hora_fin')?.valueChanges.subscribe(() => this.validarHorarios());

    if (data?.especialista) {
      const fecha_inicio = this.parseFechaLocal(data.fecha_inicio);
      const fecha_fin = this.parseFechaLocal(data.fecha_fin);
      
      // Parsear horario_disponible si existe
      let hora_inicio = '';
      let hora_fin = '';
      if (data.horario_disponible) {
        const horarios = data.horario_disponible.split('-').map((h: string) => h.trim());
        if (horarios.length === 2) {
          hora_inicio = horarios[0];
          hora_fin = horarios[1];
        }
      }

      this.formulario.patchValue({
        especialista: data.especialista?.id || data.especialista,
        especialidad: data.especialidad,
        fecha_inicio,
        fecha_fin,
        piso: data.piso || null,
        hora_inicio,
        hora_fin,
        observaciones: data.observaciones || '',
        estado: data.estado || 'Disponible'
      });
    }

    // Cuando cambia el especialista, actualizar la especialidad
    this.formulario.get('especialista')?.valueChanges.subscribe(especialistaId => {
      const esp = this.especialistas.find(e => e.id === especialistaId);
      if (esp) {
        this.formulario.patchValue({ especialidad: esp.especialidad }, { emitEvent: false });
      } else {
        this.formulario.patchValue({ especialidad: '' }, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    // Cargar especialistas disponibles
    this.especialistaService.getEspecialistas({ estado: 'Disponible' }).subscribe({
      next: (especialistas) => {
        this.especialistas = especialistas;
      },
      error: (err) => console.error('Error al cargar especialistas', err)
    });

    // Cargar boxes disponibles
    this.boxService.getDisponibles().subscribe({
      next: (boxes) => {
        this.boxes = boxes;
        this.calcularPisosDisponibles();
      },
      error: (err) => console.error('Error al cargar boxes', err)
    });
  }

  calcularPisosDisponibles(): void {
    // Contar boxes disponibles por piso
    this.cantidadBoxesPorPiso = {};
    this.boxes.forEach(box => {
      if (!this.cantidadBoxesPorPiso[box.piso]) {
        this.cantidadBoxesPorPiso[box.piso] = 0;
      }
      this.cantidadBoxesPorPiso[box.piso]++;
    });

    // Obtener pisos únicos ordenados
    this.pisosDisponibles = Object.keys(this.cantidadBoxesPorPiso)
      .map(Number)
      .sort((a, b) => a - b);
  }

  validarHorarios(): void {
    const horaInicio = this.formulario.get('hora_inicio')?.value;
    const horaFin = this.formulario.get('hora_fin')?.value;

    if (horaInicio && horaFin) {
      if (horaFin <= horaInicio) {
        this.mensajeErrorHorario = 'La hora de fin debe ser posterior a la hora de inicio';
      } else {
        this.mensajeErrorHorario = '';
      }
    } else {
      this.mensajeErrorHorario = '';
    }
  }

  parseFechaLocal(fechaStr: string): Date {
    const [year, month, day] = fechaStr.split('-').map(Number);
    return new Date(year, month - 1, day);
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

  guardar(): void {
    if (this.formulario.valid && !this.mensajeErrorHorario) {
      const horaInicio = this.formulario.value.hora_inicio;
      const horaFin = this.formulario.value.hora_fin;
      const horarioDisponible = `${horaInicio} - ${horaFin}`;

      const data = {
        ...this.data,
        ...this.formulario.value,
        fecha_inicio: this.formulario.value.fecha_inicio.toISOString().split('T')[0],
        fecha_fin: this.formulario.value.fecha_fin.toISOString().split('T')[0],
        horario_disponible: horarioDisponible,
      };
      this.dialogRef.close(data);
    }
  }

  private setupFiltroEspecialistas(): void {
    this.especialistasFiltrados = this.formulario.get('especialista')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filtrarEspecialistas(value || ''))
    );
  }

  private _filtrarEspecialistas(value: string): Especialista[] {
    const filterValue = value.toLowerCase();
    return this.especialistas.filter(esp =>
      esp.nombre.toLowerCase().includes(filterValue)
    );
  }

  obtenerEspecialistaSeleccionado(): Especialista | undefined {
    const especialistaId = this.formulario.get('especialista')?.value;
    return this.especialistas.find(e => e.id === especialistaId);
  }

  abrirFormularioEspecialista(especialista?: Especialista): void {
    const dialogRef = this.dialog.open(FormularioEspecialistaComponent, {
      width: '500px',
      data: especialista ? { ...especialista } : null
    });

    dialogRef.afterClosed().subscribe((result: Especialista) => {
      if (result) {
        if (result.id) {
          // Editar
          this.especialistaService.actualizarEspecialista(result).subscribe({
            next: (especialistaActualizado: Especialista) => {
              const index = this.especialistas.findIndex(e => e.id === especialistaActualizado.id);
              if (index !== -1) {
                this.especialistas[index] = especialistaActualizado;
              }
              console.log('Especialista actualizado:', especialistaActualizado);
            },
            error: (err: any) => console.error('Error al actualizar especialista', err)
          });
        } else {
          // Crear
          this.especialistaService.crearEspecialista(result).subscribe({
            next: (nuevoEspecialista: Especialista) => {
              this.especialistas.push(nuevoEspecialista);
              console.log('Especialista creado:', nuevoEspecialista);
            },
            error: (err: any) => console.error('Error al crear especialista', err)
          });
        }
      }
    });
  }

  eliminarEspecialista(especialista: Especialista): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        titulo: 'Eliminar Especialista',
        mensaje: `¿Está seguro de eliminar al especialista ${especialista.nombre}?`
      }
    });

    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado && especialista.id) {
        this.especialistaService.eliminarEspecialista(especialista.id).subscribe({
          next: () => {
            this.especialistas = this.especialistas.filter(e => e.id !== especialista.id);
            console.log('Especialista eliminado');
          },
          error: (err: any) => console.error('Error al eliminar especialista', err)
        });
      }
    });
  }
}
