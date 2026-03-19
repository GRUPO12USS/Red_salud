import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Box } from '../models/box.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoxService {
  private apiUrl = 'http://localhost:8000/api/boxes/';

  constructor(private http: HttpClient) { }

  getBoxes(): Observable<Box[]> {
    return this.http.get<Box[]>(this.apiUrl);
  }

  getBox(id: number): Observable<Box> {
    return this.http.get<Box>(`${this.apiUrl}${id}/`);
  }

  createBox(box: Box): Observable<Box> {
    return this.http.post<Box>(this.apiUrl, box);
  }

  updateBox(id: number, box: Box): Observable<Box> {
    return this.http.put<Box>(`${this.apiUrl}${id}/`, box);
  }

  deleteBox(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

  getBoxesDisponibles(): Observable<Box[]> {
    return this.http.get<Box[]>(`${this.apiUrl}disponibles/`);
  }

  getDisponibles(): Observable<Box[]> {
    return this.getBoxesDisponibles();
  }
}
