<div align="center">

<img src="./docs/assets/z-labs-logo.png" alt="Z Labs Logo" width="360"/>

# Z Labs

### Personal Software Brand by Sebastián Sandoval

**Building software. Creating solutions.**

Z Labs es mi marca personal de desarrollo de software, enfocada en construir aplicaciones modernas, escalables y orientadas a resolver problemas reales mediante tecnología.

</div>

---

# 🎫 Z-ENTIK — Sistema HelpDesk TI Full Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-2563EB?style=for-the-badge\&logo=typescript\&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge\&logo=nestjs\&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=nodedotjs\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge\&logo=postgresql\&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-111827?style=for-the-badge\&logo=prisma\&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-111827?style=for-the-badge\&logo=jsonwebtokens\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge\&logo=githubactions\&logoColor=white)

**Z-Entik** es una aplicación Full Stack orientada a la gestión de tickets TI, soporte técnico y mesas de ayuda. El proyecto busca simular un sistema profesional de HelpDesk donde usuarios puedan crear solicitudes, técnicos puedan gestionarlas y administradores puedan supervisar estados, prioridades, roles y métricas operativas.

Este proyecto forma parte de mi portafolio profesional bajo la identidad **Z Labs**, y tiene como objetivo demostrar conocimientos en **frontend moderno, backend con API REST, autenticación segura, base de datos relacional, arquitectura separada, despliegue cloud, Docker, CI/CD y buenas prácticas de seguridad**.

---

## 📌 Estado del Proyecto

Actualmente el proyecto se encuentra en etapa inicial de desarrollo.

### Hitos completados

* Repositorio separado de Z-Commerce.
* Frontend creado con React + TypeScript + Vite.
* Backend creado con NestJS + TypeScript + Node.js.
* Endpoint inicial `/health` implementado.
* CORS configurado entre frontend y backend.
* Primera conexión funcional entre React y NestJS.
* Estética inicial basada en la identidad visual de Z Labs.

---

## 🌐 Demo

La demo pública será agregada cuando el proyecto sea desplegado.

```txt
Demo: En desarrollo
```

---

## 📦 Repositorio

```txt
https://github.com/SebastianASR/Z-Entik
```

---

## -> Vista inicial del proyecto

La primera versión del proyecto ya permite comprobar la comunicación entre frontend y backend:

```txt
Frontend React + TypeScript
        ↓
Consulta HTTP
        ↓
Backend NestJS
        ↓
Respuesta JSON desde la API
```

Endpoint de prueba:

```txt
GET http://localhost:3000/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "service": "Z-Entik API",
  "timestamp": "2026-..."
}
```

---

## 🚀 Objetivo del Proyecto

Z-Entik busca representar un sistema HelpDesk TI moderno con funcionalidades como:

* Registro e inicio de sesión de usuarios.
* Autenticación segura mediante JWT.
* Hash seguro de contraseñas.
* Verificación en dos pasos por correo.
* Roles diferenciados.
* Creación y gestión de tickets.
* Asignación de técnicos.
* Estados y prioridades.
* Comentarios en tickets.
* Dashboard por rol.
* API REST documentada.
* Base de datos PostgreSQL en la nube.
* Despliegue cloud.
* Automatización mediante GitHub Actions.

---

## 👥 Roles del Sistema

El sistema contempla tres tipos principales de usuario:

### Usuario

* Crear tickets de soporte.
* Ver sus propios tickets.
* Comentar en sus solicitudes.
* Consultar el estado de sus incidencias.

### Técnico

* Ver tickets asignados.
* Cambiar estado de tickets.
* Responder comentarios.
* Registrar avances de soporte.

### Administrador

* Gestionar usuarios.
* Asignar tickets a técnicos.
* Ver todos los tickets.
* Gestionar estados, prioridades y categorías.
* Consultar métricas del sistema.

---

## 🎫 Funcionalidades Planificadas

### Gestión de Tickets

* Crear ticket.
* Ver detalle de ticket.
* Editar ticket.
* Cambiar estado.
* Asignar técnico.
* Definir prioridad.
* Definir categoría.
* Agregar comentarios.
* Cerrar ticket.

### Estados de Ticket

* Abierto.
* En revisión.
* En progreso.
* En espera.
* Resuelto.
* Cerrado.

### Prioridades

* Baja.
* Media.
* Alta.
* Crítica.

### Categorías

* Hardware.
* Software.
* Red.
* Cuenta de usuario.
* Accesos.
* Seguridad.
* Otro.

---

## 🔐 Seguridad Planificada

El proyecto busca implementar una autenticación más completa que un login tradicional.

### Características de seguridad

* Hash seguro de contraseñas.
* Autenticación con JWT.
* Guards de NestJS para proteger rutas.
* Control de acceso basado en roles.
* Validación de datos de entrada.
* Variables de entorno para secretos.
* Verificación en dos pasos por correo.
* Protección de rutas privadas en frontend.
* Separación entre datos públicos y privados.

### Autenticación proyectada

```txt
Usuario ingresa correo y contraseña
        ↓
Backend valida credenciales
        ↓
Se verifica hash de contraseña
        ↓
Se genera código 2FA
        ↓
Se envía código por correo
        ↓
Usuario confirma el código
        ↓
Backend genera JWT
        ↓
Frontend accede a rutas protegidas
```

---

## 📧 2FA por Correo

El sistema contempla verificación en dos pasos mediante correo electrónico usando **Brevo API**.

Flujo esperado:

```txt
Login correcto
        ↓
Generar código temporal
        ↓
Enviar código por correo
        ↓
Validar código
        ↓
Crear sesión segura con JWT
```

---

## 🛠️ Tecnologías Utilizadas

### Frontend

* React
* TypeScript
* Vite
* HTML5
* CSS3
* Fetch API

### Backend

* Node.js
* NestJS
* TypeScript
* API REST
* Guards
* DTOs
* Services
* Controllers
* Modules

### Base de Datos

* PostgreSQL
* Neon PostgreSQL
* Prisma ORM

### Autenticación y Seguridad

* JWT
* Hash seguro de contraseñas
* 2FA por correo
* Brevo API
* Variables de entorno

### DevOps / Infraestructura

* Git
* GitHub
* Docker
* GitHub Actions
* Render
* Neon

---

## 🧱 Arquitectura del Proyecto

El proyecto está organizado como un monorepo simple, separando frontend y backend en carpetas independientes.

```txt
Z-Entik/
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   └── assets/
│       └── z-labs-logo.png
│
├── .github/
│   └── workflows/
│
├── README.md
└── .gitignore
```

---

## 🔌 Comunicación Frontend - Backend

El frontend se ejecuta en:

```txt
http://localhost:5173
```

El backend se ejecuta en:

```txt
http://localhost:3000
```

Para permitir la comunicación entre ambos entornos, el backend tiene CORS configurado para aceptar solicitudes desde el frontend.

```ts
app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true,
});
```

---

## ⚙️ Configuración Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/SebastianASR/Z-Entik.git
cd Z-Entik
```

---

## ▶️ Ejecutar Frontend

Entrar a la carpeta del frontend:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar servidor de desarrollo:

```bash
npm run dev
```

URL local:

```txt
http://localhost:5173
```

---

## ▶️ Ejecutar Backend

Entrar a la carpeta del backend:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar servidor de desarrollo:

```bash
npm run start:dev
```

URL local:

```txt
http://localhost:3000
```

Endpoint de salud:

```txt
http://localhost:3000/health
```

---

## 🧪 Prueba de Conexión

Para probar la conexión completa:

1. Ejecutar el backend en una terminal.
2. Ejecutar el frontend en otra terminal.
3. Abrir el navegador en:

```txt
http://localhost:5173
```

La pantalla inicial debe mostrar el estado de la API:

```txt
Servicio: Z-Entik API
Estado: ok
Última respuesta: timestamp generado por el backend
```

---

## 🗄️ Base de Datos Planificada

La base de datos usará PostgreSQL con Prisma ORM.

Entidades principales proyectadas:

```txt
User
Role
Ticket
TicketComment
TicketCategory
TicketPriority
TicketStatus
TwoFactorCode
```

Relaciones principales esperadas:

```txt
User 1 ─── N Ticket
User 1 ─── N TicketComment
Ticket 1 ─── N TicketComment
Role 1 ─── N User
TicketCategory 1 ─── N Ticket
TicketPriority 1 ─── N Ticket
TicketStatus 1 ─── N Ticket
```

---

## 🧭 Roadmap

### Fase 1 — Base Full Stack

* Crear repo separado.
* Crear frontend con React + TypeScript.
* Crear backend con NestJS + TypeScript.
* Configurar CORS.
* Crear endpoint `/health`.
* Conectar frontend con backend.

### Fase 2 — Base de Datos

* Configurar Prisma.
* Conectar PostgreSQL.
* Crear modelos iniciales.
* Ejecutar migración inicial.
* Probar conexión con Neon.

### Fase 3 — Autenticación

* Registro de usuarios.
* Login.
* Hash seguro de contraseñas.
* JWT.
* Guards de autenticación.
* Roles.

### Fase 4 — 2FA

* Generar código temporal.
* Enviar código por correo con Brevo.
* Validar código.
* Activar sesión segura.

### Fase 5 — Tickets

* Crear tickets.
* Listar tickets.
* Ver detalle.
* Actualizar estado.
* Asignar técnico.
* Comentar ticket.

### Fase 6 — Dashboard

* Dashboard de usuario.
* Dashboard de técnico.
* Dashboard de administrador.
* Métricas de tickets.

### Fase 7 — Infraestructura

* Docker para backend.
* Docker para frontend.
* GitHub Actions.
* Deploy en Render.
* Variables de entorno en producción.

---

## 📌 Estado Actual

* Proyecto en desarrollo.
* Frontend creado.
* Backend creado.
* Comunicación inicial frontend-backend funcionando.
* Diseño inicial inspirado en Z Labs.
* Próxima fase: PostgreSQL + Prisma ORM.

---

## 🧑‍💻 Autor

Desarrollado por Sebastián Sandoval Romero
Ingeniero en Informática
Perfil orientado a desarrollo **Backend / Full-Stack**
Santiago, Chile

* [LinkedIn](https://www.linkedin.com/in/sebastian-andre-sandoval-romero-115710296/)
* [Email](mailto:sandoval.romero.sebastian@gmail.com)

---

<div align="center">

### Z Labs

**Building software. Creating solutions.**

</div>
