import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CitaService, Cita } from '../cita.service';

@Component({
  selector: 'app-cita-form',
  imports: [],
  templateUrl: './cita-form.component.html',
  styleUrl: './cita-form.component.css'
})
export class CitaFormComponent implements OnInit{
  cita: Cita = {
    paciente: '',
    doctor: '',
    fecha: '',
    hora: '',
    motivo: ''
  };

  isEdit = false;

  constructor(
    private citaService: CitaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.citaService.getCita(+id).subscribe(data => this.cita = data);
    }
  }

  guardarCita(): void {
    if (this.isEdit && this.cita.id) {
      this.citaService.updateCita(this.cita.id, this.cita).subscribe(() => this.router.navigate(['/']));
    } else {
      this.citaService.createCita(this.cita).subscribe(() => this.router.navigate(['/']));
    }
  }


}
