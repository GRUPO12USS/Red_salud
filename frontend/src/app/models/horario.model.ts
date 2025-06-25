// Datos que llegan desde el backend (API)
export interface HorarioPacienteAPI {
  id: number;
  paciente_nombre: string;
  paciente_rut: string;
  box_numero: number;
  piso: number;
  especialidad: string;
  especialista_nombre: string;
  fecha: string; // normalmente viene como string desde la API
  hora_inicio: string;
  hora_fin: string;
  estado: string; // puedes quitarlo si no lo usas
}

// Estructura que usas en el frontend (tabla, visualización, etc.)
export interface HorarioPaciente {
  id: number;
  nombrePaciente: string;
  rut: string;
  box: string;
  piso: string;
  especialidad: string;
  especialista: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
}
