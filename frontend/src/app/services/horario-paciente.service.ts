// src/app/services/horario-paciente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HorarioPacienteAPI } from '../models/horario.model';

@Injectable({
  providedIn: 'root'
})
export class HorarioPacienteService {
  private apiUrl = 'http://localhost:8000/api/agenda-pacientes/';

  constructor(private http: HttpClient) {}

  getHorarios(): Observable<HorarioPacienteAPI[]> {
    return this.http.get<HorarioPacienteAPI[]>(this.apiUrl);
  }

  getHorariosDispo(): Observable<any> {
    return this.http.get<any>('http://localhost:8000/api/horarios-disponibles/');
  }
}
