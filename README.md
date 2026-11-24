# ms-tickets

Microservicio de gestión de tickets para la Evaluación del Módulo 3 (Redes y Servicios Multimedia - UAO).

**Integrantes (Pareja 2 - Jornada Diurna):**
- Julián Jair Peñaloza Chavarriaga
- Bryan Andrés Peñaranda Soto

## Requisitos y configuración
1. Crear la base de datos ejecutando `db/schema.sql` en MySQL (`tickets_db`).
2. Copiar `.env.example` a `.env` y ajustar las credenciales de MySQL y `JWT_SECRET` (debe coincidir con `ms-usuarios`).
3. Instalar dependencias y arrancar:
   ```bash
   npm install
   npm start