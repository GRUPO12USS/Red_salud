import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { Location } from '@angular/common';
import { AgregarOfertaDialogEspecialistaComponent } from '../agregar-oferta-dialog-especialista/agregar-oferta-dialog-especialista.component';
import { MatDialog } from '@angular/material/dialog';
import { EspecialistaService, Especialista } from '../../services/especialista.service';
import { OfertaService, OfertaEspecialista } from '../../services/oferta.service';

@Component({
  selector: 'app-oferta-especialistas',
  imports: [FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './oferta-especialistas.component.html',
  styleUrl: './oferta-especialistas.component.css'
})
export class OfertaEspecialistasComponent implements OnInit {

  usuario = 'UsuarioEjemplo';
  rol = 'Administrador de Sistemas';

  ofertas: OfertaEspecialista[] = [];
  columnasTabla: string[] = ['especialista', 'especialidad', 'fecha_inicio', 'fecha_fin', 'horario_disponible', 'estado', 'acciones'];

  constructor(private router: Router,
    private dateAdapter: DateAdapter<Date>,
    private location: Location,
    private dialog: MatDialog,
    private especialistaService: EspecialistaService,
    private ofertaService: OfertaService) 
    {
    this.dateAdapter.setLocale('es-CL');
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.cargarOfertas();
  }

  cargarOfertas() {
    this.ofertaService.getOfertas().subscribe({
      next: (data) => this.ofertas = data,
      error: (err) => console.error('Error al cargar ofertas', err)
    });
  }

  volverAtras(): void {
    this.location.back();
  }

  irAgendaEspecialistas(): void {
    this.router.navigate(['/agenda-especialistas']);
  }

  abrirFormularioOferta(oferta?: OfertaEspecialista): void {
    const dialogRef = this.dialog.open(AgregarOfertaDialogEspecialistaComponent, {
      width: '500px',
      disableClose: true,
      data: oferta ? { ...oferta } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Transformar el campo especialista a especialista_id para el backend
        const payload = {
          ...result,
          especialista_id: result.especialista,
        };
        delete payload.especialista; // Eliminar el campo original

        if (result.id) {
          this.ofertaService.actualizarOferta({ ...result, ...payload }).subscribe({
            next: () => this.cargarOfertas(),
            error: (err) => console.error('Error actualizando oferta:', err)
          });
        } else {
          this.ofertaService.crearOferta(payload).subscribe({
            next: () => this.cargarOfertas(),
            error: (err) => console.error('Error creando oferta:', err)
          });
        }
      }
    });
  }

  eliminarOferta(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta oferta?')) {
      this.ofertaService.eliminarOferta(id).subscribe({
        next: () => this.cargarOfertas(),
        error: (err) => console.error('Error eliminando oferta:', err)
      });
    }
  }
}
