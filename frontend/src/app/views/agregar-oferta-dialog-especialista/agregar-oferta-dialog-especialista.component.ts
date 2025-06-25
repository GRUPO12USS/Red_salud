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
import { CommonModule, registerLocaleData } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { EspecialistaService, Especialista } from '../../services/especialista.service';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';

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
export class AgregarOfertaDialogEspecialistaComponent {
  formulario: FormGroup;
  especialistas: Especialista[] = [];
  especialistasFiltrados!: Observable<Especialista[]>;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgregarOfertaDialogEspecialistaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private especialistaService: EspecialistaService,
    private dialog: MatDialog
  ) {
    this.formulario = this.fb.group({
      especialista: [null, Validators.required],
      especialidad: [null, Validators.required],
      fecha_inicio: [null, Validators.required],
      fecha_fin: [null, Validators.required],
      horario_disponible: [null, Validators.required],
      observaciones: [''],
      estado: ['Disponible', Validators.required]
    });
    if (data?.especialista) {
      const fecha_inicio = this.parseFechaLocal(data.fecha_inicio);
      const fecha_fin = this.parseFechaLocal(data.fecha_fin);
      this.formulario.patchValue({
        ...data,
        //fecha_inicio: new Date(data.fecha_inicio),
        //fecha_fin: new Date(data.fecha_fin),
        especialista: data.especialista,
        especialidad: data.especialidad,
        //fecha_inicio: data.fecha_inicio,
        //fecha_fin: data.fecha_fin,
        fecha_inicio,
        fecha_fin,
        horario_disponible: data.horario_disponible,
        observaciones: data.observaciones,
        estado: data.estado,
      });     
    }

    this.especialistaService.getEspecialistas().subscribe({
      next: (res) => {
        this.especialistas = res;
        this.setupFiltroEspecialistas();
      },
      error: (err) => console.error('Error al cargar especialistas', err)
    });

    this.formulario.get('especialista')?.valueChanges.subscribe(nombre => {
      const esp = this.especialistas.find(e => e.nombre === nombre);
      if (esp) {
        this.formulario.patchValue({ especialidad: esp.especialidad }, { emitEvent: false });
      } else {
        this.formulario.patchValue({ especialidad: '' }, { emitEvent: false });
      }
    });
  }

    
  

  minDate = new Date();
  parseFechaLocal(fechaStr: string): Date {
    const [year, month, day] = fechaStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }


  //ngOnInit(): void {
   // this.cargarEspecialistas();
  //}
  ngOnInit(): void {
    this.especialistaService.getEspecialistasDisponibles().subscribe({
      next: (res) => {
        this.especialistas = res;
        this.setupFiltroEspecialistas();
      },
      error: (err) => console.error('Error al cargar especialistas', err)
    });

    this.formulario.get('especialista')?.valueChanges.subscribe((esp: Especialista | string) => {
      if (esp && typeof esp === 'object') {
        this.formulario.patchValue({ especialidad: esp.especialidad });
      }
    });
  }

  cargarEspecialistas() {
    this.especialistaService.getEspecialistas().subscribe({
      next: (res) => this.especialistas = res,
      error: (err) => console.error('Error al cargar especialistas', err)
    });
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

  formatFecha(fecha: any): string {
    return new Date(fecha).toLocaleDateString('en-CA'); 
  }

  guardar(): void {
  if (this.formulario.valid) {
    const data = {
      ...this.data, 
      ...this.formulario.value,
      fecha_inicio: this.formulario.value.fecha_inicio.toISOString().split('T')[0],
      fecha_fin: this.formulario.value.fecha_fin.toISOString().split('T')[0],
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

}
