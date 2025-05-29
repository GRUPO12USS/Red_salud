import { Component, OnInit } from '@angular/core';
import { CitaService, Cita } from '../cita.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cita-list',
  imports: [],
  templateUrl: './cita-list.component.html',
  styleUrl: './cita-list.component.css'
})
export class CitaListComponent implements OnInit{
  citas: Cita[] = [];

  constructor(private citaService: CitaService, private router: Router) {}

  ngOnInit(): void {
    this.loadCitas();
  }

  loadCitas(): void {
    this.citaService.getCitas().subscribe(data => this.citas = data);
  }

  deleteCita(id: number): void {
    this.citaService.deleteCita(id).subscribe(() => this.loadCitas());
  }

  editCita(id: number): void {
    this.router.navigate(['/editar', id]);
  }

  nuevaCita(): void {
    this.router.navigate(['/crear']);
  }
}
