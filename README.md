# RedSalud - Especificación Funcional del Sistema de Gestión de Citas Médicas

## 1. DESCRIPCIÓN GENERAL DEL PROYECTO

Sistema web para gestionar la asignación de consultorios médicos (boxes) a especialistas y la reserva de citas para pacientes en un centro de salud. El sistema debe permitir a coordinadores médicos administrar la disponibilidad de recursos físicos y profesionales, así como gestionar las agendas de atención.

### Arquitectura Tecnológica Requerida
- **Backend**: API REST con Django y Django REST Framework
- **Base de datos**: MySQL
- **Frontend**: Aplicación web con Angular y Material Design
- **Infraestructura**: Docker Compose con 3 contenedores (backend, frontend, base de datos)

---

## 2. MODELO DE DATOS

El sistema debe manejar las siguientes entidades:

### 2.1 Box (Consultorio Médico)
Representa espacios físicos donde se realizan las consultas médicas.
- Número del box (identificador único)
- Piso donde se ubica
- Nombre/tipo del inmueble
- Estado: disponible, ocupado, en mantenimiento

### 2.2 Especialista (Profesional Médico)
Médicos y profesionales de salud que atienden en el centro.
- Nombre completo
- Especialidad médica
- Piso donde trabaja habitualmente
- Estado: Disponible, No Disponible

### 2.3 OfertaEspecialista (Disponibilidad del Especialista)
Define los períodos en que un especialista está disponible para atender.
- Especialista asociado
- Especialidad que ofrecerá
- Piso en el que atenderá
- Fecha de inicio del período
- Fecha de fin del período
- Rango horario de disponibilidad (ej: "08:00 - 12:00")
- Observaciones adicionales
- Estado: Disponible, No Disponible

### 2.4 Paciente
Personas que solicitan atención médica.
- Nombre
- Apellido
- RUT (identificador único nacional)

### 2.5 Horario (Bloque de Atención/Cita)
Bloques específicos de tiempo asignados para atención médica.
- Especialista asignado
- Box asignado
- Paciente (opcional si está reservado)
- Fecha de atención
- Hora de inicio
- Hora de fin
- Indicador de disponibilidad

---

## 3. ROLES Y PERFILES DE USUARIO

### 3.1 Administrador de Sistemas
- Acceso completo a la gestión de boxes (CRUD)
- Configuración de recursos físicos del centro

### 3.2 Coordinador de Boxes
- Gestión de ofertas de especialistas
- Asignación de horarios a especialistas
- Visualización de agendas
- Gestión de citas de pacientes

---

## 4. FLUJOS FUNCIONALES PRINCIPALES

### FLUJO 1: Gestión de Especialistas

**Objetivo**: Administrar el catálogo de profesionales médicos del centro.

**Funcionalidades**:
- **Crear especialista**: Registrar nuevos profesionales con nombre, especialidad, piso de trabajo y estado
- **Editar especialista**: Modificar datos de especialistas existentes
- **Eliminar especialista**: Dar de baja profesionales del sistema
- **Listar especialistas**: Ver todos los especialistas con filtro por estado (Disponible/No Disponible)

**Reglas de negocio**:
- Todos los campos son obligatorios al crear/editar
- El piso debe ser un número positivo
- Solo se pueden asignar horarios a especialistas en estado "Disponible"

---

### FLUJO 2: Gestión de Boxes (Consultorios)

**Objetivo**: Administrar los espacios físicos disponibles para atención médica.

**Funcionalidades**:
- **Crear box**: Registrar nuevo consultorio con número, piso, inmueble y estado
- **Editar box**: Modificar información de boxes existentes
- **Eliminar box**: Dar de baja consultorios
- **Listar boxes**: Ver todos los boxes con filtros por número, piso y estado
- **Consultar boxes disponibles**: Obtener solo los boxes en estado "disponible"

**Reglas de negocio**:
- El número de box debe ser único
- Los pisos deben ser números enteros positivos
- Solo boxes en estado "disponible" pueden ser asignados a horarios

---

### FLUJO 3: Gestión de Ofertas de Especialistas

**Objetivo**: Definir períodos de disponibilidad de especialistas para atención.

**Funcionalidades**:
- **Crear oferta**: Registrar período de disponibilidad de un especialista
  - Seleccionar especialista de lista de disponibles
  - Especificar especialidad a ofrecer
  - Seleccionar piso donde atenderá (solo mostrar pisos con boxes disponibles)
  - Definir rango de fechas (inicio y fin)
  - Establecer horario disponible (hora inicio - hora fin)
  - Agregar observaciones opcionales
  - Definir estado
- **Visualizar ofertas**: Lista de todas las ofertas creadas
- **Eliminar oferta**: Cancelar oferta de disponibilidad

**Reglas de negocio**:
- Solo mostrar especialistas en estado "Disponible"
- El campo "piso" debe mostrar únicamente pisos que tengan al menos un box disponible
- Debe indicar cuántos boxes hay disponibles en cada piso
- La fecha de fin debe ser posterior a la fecha de inicio
- La hora de fin debe ser posterior a la hora de inicio
- El horario disponible debe estar en formato "HH:MM - HH:MM"

**Validaciones críticas**:
- **Filtrado dinámico de pisos**: Calcular en tiempo real qué pisos tienen boxes disponibles y mostrar contador de boxes por piso
- **Cálculo de disponibilidad**: Contar boxes disponibles agrupados por piso antes de mostrar opciones

---

### FLUJO 4: Asignación de Horarios a Especialistas

**Objetivo**: Crear bloques de tiempo específicos donde un especialista estará disponible para atender.

**Funcionalidades**:
- **Crear horario**: Asignar bloque de tiempo a especialista
  - Seleccionar especialista de lista de disponibles
  - Seleccionar box (filtrado por piso del especialista y disponibilidad)
  - Seleccionar fecha de atención
  - Definir hora de inicio y fin
  - Marcar como disponible por defecto
- **Visualizar agenda de especialistas**: Tabla con todos los horarios
- **Filtrar agenda**: Por especialista, especialidad, piso, box

**Reglas de negocio**:
- Solo mostrar especialistas en estado "Disponible"
- Solo mostrar boxes que:
  - Estén en el mismo piso de la oferta del especialista seleccionado
  - Tengan estado "disponible"
- El horario (inicio-fin) debe estar dentro del rango definido en la oferta del especialista
- La fecha no puede ser anterior al día actual

**Validaciones críticas**:
- **Validación de rango horario**: El sistema debe verificar en tiempo real que el horario ingresado esté dentro del horario_disponible de la oferta del especialista
- **Filtrado de boxes por piso**: Al seleccionar un especialista, buscar su oferta activa, obtener el piso y filtrar boxes solo de ese piso
- **Resolución de IDs**: Al guardar, debe enviarse el ID del box (no el número) al backend

---

### FLUJO 5: Gestión de Agenda de Pacientes

**Objetivo**: Permitir a pacientes reservar citas en horarios disponibles.

**Funcionalidades**:
- **Ver horarios disponibles**: Tabla de bloques de tiempo sin paciente asignado
- **Crear/seleccionar paciente**: Registrar nuevo paciente o buscar existente por RUT
- **Reservar cita**: Asignar paciente a horario disponible
- **Cancelar reserva**: Liberar horario ocupado por paciente
- **Filtrar agenda**: Por nombre de paciente, RUT, especialista, fecha

**Reglas de negocio**:
- Solo se pueden reservar horarios marcados como "disponible"
- Al asignar paciente, el horario debe cambiar a "no disponible"
- Al cancelar, el horario vuelve a "disponible"
- El RUT del paciente debe ser único

---

### FLUJO 6: Sistema de Filtrado por Estado

**Objetivo**: Garantizar que solo entidades disponibles puedan ser asignadas.

**Funcionalidades**:
- Todos los listados de especialistas, boxes y ofertas deben soportar filtro por estado
- Los formularios de asignación solo deben mostrar opciones con estado "Disponible"
- El backend debe validar parámetros de estado y rechazar valores inválidos

**Reglas de negocio**:
- Estados válidos para especialistas: "Disponible", "No Disponible"
- Estados válidos para boxes: "disponible", "ocupado", "en_mantenimiento"
- Estados válidos para ofertas: "Disponible", "No Disponible"
- Filtrado debe aplicarse tanto en frontend (UI) como backend (API)

---

### FLUJO 7: Visualización de Agenda en Bloques de Tiempo

**Objetivo**: Mostrar horarios de manera visual en intervalos de 30 minutos.

**Funcionalidades**:
- Generar vista de agenda dividida en bloques de 30 minutos
- Filtrar horarios por especialista, especialidad, piso, box
- Mostrar estado de cada bloque (disponible/ocupado)
- Indicar especialista y box asignado en cada bloque

**Reglas de negocio**:
- Los bloques deben ser de 30 minutos exactos
- Validar que existan datos de fecha y hora antes de procesar
- Prevenir errores de lectura de datos incompletos o nulos

**Validaciones críticas**:
- Antes de procesar un horario, verificar que campos críticos (horaInicio, fecha) no sean null o undefined
- Implementar manejo seguro de cadenas de tiempo para evitar errores de split()

---

## 5. ENDPOINTS API REQUERIDOS

El backend debe exponer los siguientes endpoints REST:

### Boxes
- `GET /api/boxes/` - Listar todos los boxes
- `POST /api/boxes/` - Crear nuevo box
- `GET /api/boxes/{id}/` - Obtener box específico
- `PUT /api/boxes/{id}/` - Actualizar box
- `DELETE /api/boxes/{id}/` - Eliminar box
- `GET /api/boxes/disponibles/` - Listar solo boxes disponibles

### Especialistas
- `GET /api/especialistas/` - Listar especialistas (con filtro opcional `?estado=Disponible`)
- `POST /api/especialistas/` - Crear especialista
- `PUT /api/especialistas/{id}/` - Actualizar especialista
- `DELETE /api/especialistas/{id}/` - Eliminar especialista

### Ofertas de Especialistas
- `GET /api/ofertas/` - Listar ofertas (con filtro opcional `?estado=Disponible`)
- `POST /api/ofertas/` - Crear oferta
- `DELETE /api/ofertas/{id}/` - Eliminar oferta

### Pacientes
- `GET /api/pacientes/` - Listar pacientes
- `POST /api/pacientes/` - Crear paciente

### Horarios
- `GET /api/horarios/` - Listar horarios (con filtros: disponible, fecha, box_id)
- `POST /api/horarios/` - Crear horario
- `PUT /api/horarios/{id}/` - Actualizar horario
- `DELETE /api/horarios/{id}/` - Eliminar horario
- `POST /api/horarios/{id}/cancelar/` - Cancelar reserva de paciente
- `POST /api/horarios/{id}/asignar/` - Asignar paciente a horario

### Agendas
- `GET /api/agenda-especialistas/` - Obtener agenda con datos enriquecidos de especialistas (filtros: especialista, especialidad, piso, box)
- `GET /api/agenda-pacientes/` - Obtener agenda de pacientes (filtros: nombre, rut, especialista, fecha)

### Reportes
- `GET /api/reporte/` - Obtener estadísticas del sistema

---

## 6. FUNCIONALIDADES TRANSVERSALES

### 6.1 Autenticación y Autorización
- Sistema de login con usuario, contraseña y selección de rol
- Rutas protegidas según rol (admin vs coordinador)
- Sesión persistente durante navegación
- Funcionalidad de logout

### 6.2 Navegación
- Menú principal con tarjetas de acceso a módulos
- Breadcrumbs o botones de "volver atrás"
- Barra superior con información de usuario y sesión

### 6.3 Validación de Formularios
- Validación de campos obligatorios
- Validación de tipos de datos (números, fechas, horas)
- Validación de rangos (fechas futuras, horas coherentes)
- Mensajes de error descriptivos
- Prevención de envío de formularios inválidos

### 6.4 Feedback al Usuario
- Mensajes de éxito al completar operaciones
- Alertas de error con descripción del problema
- Diálogos de confirmación para acciones destructivas (eliminar)
- Indicadores de carga durante operaciones asíncronas

### 6.5 Manejo de Errores
- Validación de datos en backend antes de procesar
- Respuestas HTTP apropiadas (400 para errores de validación, 404 para no encontrado, etc.)
- Logs de errores para depuración
- Manejo seguro de valores nulos o indefinidos

---

## 7. REGLAS DE INTEGRIDAD Y CONSISTENCIA

### 7.1 Validaciones de Negocio
1. **Unicidad**: Número de box y RUT de paciente deben ser únicos
2. **Coherencia temporal**: Fechas/horas de fin posteriores a inicio
3. **Disponibilidad**: Solo asignar recursos en estado disponible
4. **Rangos horarios**: Horarios de atención dentro de rangos de oferta
5. **Coincidencia de piso**: Box y especialista deben estar en el mismo piso

### 7.2 Integridad Referencial
- Al eliminar especialista, considerar impacto en ofertas y horarios existentes
- Al eliminar box, considerar horarios asignados
- Al eliminar oferta, verificar horarios dependientes

### 7.3 Cálculos Dinámicos
- **Pisos disponibles**: Calcular en tiempo real basándose en boxes con estado "disponible"
- **Contador de boxes por piso**: Agregar boxes disponibles por cada piso
- **Boxes elegibles**: Filtrar por piso del especialista y estado disponible
- **Validación de rango**: Parsear horario_disponible y comparar con horario ingresado

---

## 8. REQUISITOS NO FUNCIONALES

### 8.1 Rendimiento
- Respuestas API en menos de 1 segundo para operaciones CRUD simples
- Carga inicial de listas en menos de 2 segundos

### 8.2 Usabilidad
- Interfaz intuitiva con componentes de Material Design
- Formularios con etiquetas claras
- Acciones importantes destacadas visualmente
- Feedback inmediato a acciones del usuario

### 8.3 Mantenibilidad
- Código organizado en módulos/componentes reutilizables
- Separación clara entre lógica de negocio y presentación
- Servicios HTTP centralizados
- Modelos de datos bien definidos

### 8.4 Escalabilidad
- Arquitectura basada en contenedores Docker
- Base de datos relacional normalizada
- API REST stateless
- Frontend SPA con carga dinámica

---

## 9. CRITERIOS DE ÉXITO

El sistema debe ser capaz de:

1.   Gestionar completo ciclo CRUD de boxes, especialistas, pacientes
2.   Crear ofertas mostrando solo pisos con boxes disponibles
3.   Mostrar contador de boxes disponibles por piso
4.   Asignar horarios validando rangos de disponibilidad del especialista
5.   Filtrar boxes por piso del especialista al asignar horarios
6.   Prevenir errores de datos nulos en procesamiento de agenda
7.   Permitir a pacientes reservar citas en horarios disponibles
8.   Cancelar reservas y liberar horarios
9.   Filtrar todos los listados por múltiples criterios
10.   Ejecutarse completamente en Docker Compose
11.   Manejar errores de validación apropiadamente
12.   Mantener consistencia entre frontend y backend

---

## 10. CASOS DE USO PRIORITARIOS

### Caso de Uso 1: Coordinador crea oferta de especialista
**Precondición**: Existen boxes disponibles en al menos un piso
1. Coordinador accede a módulo de ofertas
2. Selecciona especialista disponible
3. Sistema muestra solo pisos con boxes disponibles y cuenta
4. Selecciona piso, define fechas y horario
5. Sistema valida coherencia de datos
6. Guarda oferta exitosamente

### Caso de Uso 2: Coordinador asigna horario a especialista
**Precondición**: Existe al menos una oferta disponible
1. Coordinador accede a agenda de especialistas
2. Selecciona especialista
3. Sistema filtra boxes del piso del especialista que estén disponibles
4. Selecciona box, fecha y horario
5. Sistema valida que horario esté dentro del rango de la oferta
6. Si válido, crea horario; si no, muestra advertencia
7. Horario queda disponible para pacientes

### Caso de Uso 3: Paciente reserva cita médica
**Precondición**: Existen horarios disponibles
1. Paciente (o coordinador) busca horarios disponibles
2. Filtra por especialista/especialidad deseada
3. Selecciona horario específico
4. Ingresa/selecciona datos de paciente
5. Sistema asigna paciente al horario
6. Horario cambia a no disponible

---

## 11. CONFIGURACIÓN DE ENTORNO

### Requisitos del entorno de desarrollo:
- Docker y Docker Compose instalados
- Puertos disponibles: 4200 (frontend), 8000 (backend), 3307 (MySQL)
- Variables de entorno para conexión a base de datos
- Credenciales de superusuario por defecto para acceso administrativo

### Comandos de inicialización:
1. Levantar servicios con Docker Compose
2. Ejecutar migraciones de base de datos
3. Crear usuario administrador por defecto
4. Verificar conectividad entre servicios

---

## 12. CONSIDERACIONES TÉCNICAS ESPECÍFICAS

### Backend Django
- Usar serializadores con soporte para lectura y escritura de relaciones
- Implementar ViewSets con filtros personalizados
- Validar parámetros de query string
- Configurar CORS para permitir peticiones del frontend

### Frontend Angular
- Usar servicios HTTP con tipado TypeScript
- Implementar modelos/interfaces para cada entidad
- Utilizar componentes de diálogo para formularios
- Implementar validación reactiva en formularios
- Manejar estados de carga y error

### Base de Datos
- Relaciones con claves foráneas apropiadas
- Índices en campos frecuentemente consultados
- Restricciones de integridad referencial

---

## RESUMEN EJECUTIVO

Este sistema debe proporcionar una plataforma completa para la gestión eficiente de recursos médicos (boxes y especialistas) y la coordinación de citas para pacientes. Los flujos críticos involucran validaciones complejas de disponibilidad, filtrado dinámico por estado, y coherencia entre asignaciones de pisos, boxes y horarios.

La arquitectura debe ser modular, escalable y mantenible, con clara separación de responsabilidades entre backend (lógica de negocio y datos) y frontend (presentación e interacción).

El éxito del sistema se mide por su capacidad de prevenir asignaciones inválidas, mostrar solo opciones disponibles en cada contexto, y mantener la integridad de datos a través de validaciones tanto en frontend como backend.
