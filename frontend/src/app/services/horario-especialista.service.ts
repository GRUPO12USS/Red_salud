import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
//import { HorarioEspecialistaAPI } from '../models/horario-especialista.model';

export interface HorarioEspecialistaAPI {
  id: number;
  especialista: number;
  especialista_nombre?: string;
  box: number;
  box_numero?: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
}

export interface HorarioEspecialista {
  id: number;
  especialista: string;
  especialidad: string;
  box: string;
  piso: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
}

@Injectable({
  providedIn: 'root'
})
export class HorarioEspecialistaService {
  private apiUrl = 'http://localhost:8000/api/agenda-especialistas/';

  constructor(private http: HttpClient) {}

  getHorarios(filtros?: any): Observable<HorarioEspecialista[]> {
    let params = new HttpParams();
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
          params = params.set(key, filtros[key]);
        }
      });
    }

    return this.http.get<any[]>(this.apiUrl, { params }).pipe(
      map(data =>
        data.map(item => ({
          id: item.id,
          especialista: item.especialista_nombre || '',
          especialidad: '', // si necesitas cargarla aparte
          box: item.box_numero || '',
          piso: '', // si lo tienes en otra relación
          fecha: new Date(item.fecha),
          horaInicio: item.hora_inicio,
          horaFin: item.hora_fin
        }))
      )
    );
  }
}