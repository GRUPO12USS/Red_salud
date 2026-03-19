import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Especialista {
    id?: number;
    nombre: string;
    especialidad: string;
    piso: number;
    estado?: 'Disponible' | 'No Disponible';
}

@Injectable({
    providedIn: 'root'
})
export class EspecialistaService {
    private apiUrl = 'http://localhost:8000/api/especialistas/';

    constructor(private http: HttpClient) { }

    getEspecialistas(params?: { estado?: string }): Observable<Especialista[]> {
        let url = this.apiUrl;
        if (params?.estado) {
            url += `?estado=${params.estado}`;
        }
        return this.http.get<Especialista[]>(url);
    }

    getEspecialistasDisponibles(): Observable<Especialista[]> {
        return this.http.get<Especialista[]>(`${this.apiUrl}?estado=Disponible`);
    }


    //getEspecialistasDisponibles(): Observable<Especialista[]> {
    //    return this.http.get<Especialista[]>(`${this.apiUrl}/especialistas/?estado=Disponible`);
    //}

    //getEspecialistasDisponibles(): Observable<Especialista[]> {
    //const params = new HttpParams().set('estado', 'Disponible');
    //return this.http.get<Especialista[]>(this.apiUrl, { params });
    //}

    //getEspecialistasDisponibles(): Observable<Especialista[]> {
    //  return this.http.get<Especialista[]>(`${this.apiUrl}disponibles/`);
    //}

    crearEspecialista(especialista: Especialista): Observable<Especialista> {
        return this.http.post<Especialista>(this.apiUrl, especialista);
    }

    actualizarEspecialista(especialista: Especialista): Observable<Especialista> {
        if (!especialista.id) {
            throw new Error('El especialista debe tener un id para actualizar');
        }
        return this.http.put<Especialista>(`${this.apiUrl}${especialista.id}/`, especialista);
    }

    eliminarEspecialista(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }
}
