import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Horario {
  id?: number;
  especialista: number;
  box: number;
  paciente?: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  disponible?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private apiUrl = 'http://localhost:8000/api/horarios/';

  constructor(private http: HttpClient) {}

  crearHorario(horario: Horario): Observable<Horario> {
    return this.http.post<Horario>(this.apiUrl, horario);
  }

  getHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(this.apiUrl + '?disponible=true');
  }

  asignarPaciente(horarioId: number, pacienteId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${horarioId}/asignar/`, { paciente: pacienteId });
  }

  cancelarHorario(horarioId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${horarioId}/cancelar/`, {});
  }
}
