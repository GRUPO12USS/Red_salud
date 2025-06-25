import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEsCL from '@angular/common/locales/es-CL';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { Box } from '../../models/box.model';
import { Especialista, EspecialistaService } from '../../services/especialista.service';
import { BoxService } from '../../services/box.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { map, Observable, startWith } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OfertaEspecialista, OfertaService } from '../../services/oferta.service';

registerLocaleData(localeEsCL);

@Component({
  standalone: true,
  selector: 'app-asignar-horario-dialog-especialista',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatOptionModule,
  ],
  templateUrl: './asignar-horario-dialog-especialista.component.html',
  styleUrls: ['./asignar-horario-dialog-especialista.component.css'],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CL' },
    provideNativeDateAdapter(),
  ],
})
export class AsignarHorarioDialogEspecialistaComponent implements OnInit {
  formulario: FormGroup;
  minDate = new Date();
  pisoAutoDetectado: number | '' = '';
  mensajeAdvertencia: string = '';
  especialistas: Especialista[] = [];
  boxes: Box[] = [];
  //especialistasFiltrados!: Observable<Especialista[]>;
  //especialistasFiltrados: Observable<Especialista[]> = new Observable<Especialista[]>();
  ofertas: OfertaEspecialista[] = [];
  ofertasFiltradas: Observable<Especialista[]> = new Observable<Especialista[]>();


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AsignarHorarioDialogEspecialistaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private dialog: MatDialog,
    private especialistaService: EspecialistaService,
    private boxService: BoxService,
    private ofertaService: OfertaService
  ) {
    this.formulario = this.fb.group({
      especialista: [null, Validators.required],
      especialidad: [null, Validators.required],
      box: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      piso: [null, Validators.required],
      fecha: [null, Validators.required],
      horaInicio: [null, Validators.required],
      horaFin: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.ofertaService.getOfertas().subscribe({
      next: (res) => {
        console.log('Especialistas cargados:', res);
        this.ofertas = res;
        //this.setupFiltroEspecialistas();
        this.ofertasFiltradas  = this.formulario.get('especialista')!.valueChanges.pipe(
          startWith(''),
          map(value => {
            console.log('Input autocomplete especialista:', value);
            return this._filtrarEspecialistas(value || '');
          })
        );
      },
      error: (err) => console.error('Error al cargar especialistas', err)
    });

    this.boxService.getBoxesDisponibles().subscribe({
      next: (res) => this.boxes = res,
      error: (err) => console.error('Error al cargar boxes', err)
    });

    this.formulario.get('especialista')?.valueChanges.subscribe(nombre => {
      const esp = this.especialistas.find(e => e.nombre === nombre);
      if (esp) {
        this.formulario.patchValue({ especialidad: esp.especialidad, piso: esp.piso });
      }
    });
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



  setupFiltroEspecialistas() {
    this.ofertasFiltradas = this.formulario.get('especialista')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filtered = this._filtrarEspecialistas(value || '');
        console.log('Filtro especialistas con:', value, '=>', filtered);
        return filtered;
      })
    );
  }
  private _filtrarEspecialistas(value: string): Especialista[] {
    const filterValue = value.toLowerCase();
    return this.especialistas.filter(esp =>
      esp.nombre.toLowerCase().includes(filterValue)
    );
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


  onWheel(event: WheelEvent): void {
    (event.target as HTMLInputElement).blur();
    event.preventDefault();
  }



}


