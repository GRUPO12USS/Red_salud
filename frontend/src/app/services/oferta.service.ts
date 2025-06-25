import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface OfertaEspecialista {
  id?: number;
  especialista: string;
  especialidad: string;
  fecha_inicio: string;   
  fecha_fin: string;      
  horario_disponible: string;
  observaciones?: string;
  estado: 'Disponible' | 'No Disponible';
}

@Injectable({
  providedIn: 'root'
})
export class OfertaService {
  private apiUrl = 'http://localhost:8000/api/ofertas/';

  constructor(private http: HttpClient) {}

  getOfertas(): Observable<OfertaEspecialista[]> {
    return this.http.get<OfertaEspecialista[]>(this.apiUrl);
  }

  crearOferta(oferta: OfertaEspecialista): Observable<OfertaEspecialista> {
    return this.http.post<OfertaEspecialista>(this.apiUrl, oferta);
  }

  actualizarOferta(oferta: OfertaEspecialista): Observable<OfertaEspecialista> {
    return this.http.put<OfertaEspecialista>(`${this.apiUrl}${oferta.id}/`, oferta);
  }

  eliminarOferta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
