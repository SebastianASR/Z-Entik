<div align="center">

<img src="https://github.com/user-attachments/assets/b8f70459-0361-439e-9d0c-b9c8c5ff316a" alt="Z Labs Logo" width="460"/>

# Z Labs

### Personal Software Brand by Sebastian Sandoval

**Building software. Creating solutions.**

Z Labs es mi marca personal de desarrollo de software, enfocada en construir aplicaciones modernas, escalables y orientadas a resolver problemas reales mediante tecnologia.

</div>

## 🚀 Demo en producción

Puedes probar Z-Entik desplegado en Render desde el siguiente enlace:

🔗 **Frontend:** [https://z-entik-web.onrender.com/](https://z-entik-web.onrender.com/)

> La demo incluye usuarios de prueba para explorar el sistema como usuario normal, técnico y demo admin. También puedes registrarte (con correos reales por verificación).

---

## 🖼️ Vista previa

### Landing y diseño principal

![Vista previa Z-Entik 1](https://github.com/user-attachments/assets/3ed312df-c06b-4ca3-9d72-d6d3cf9c83a8)

![Vista previa Z-Entik 2](https://github.com/user-attachments/assets/4627c078-5bd7-4633-a772-32fa21660511)

### Login y seguridad

![Vista previa Z-Entik 3](https://github.com/user-attachments/assets/1a012a26-8244-47ac-a3b4-90ad1b1637f4)

![Vista previa Z-Entik 4](https://github.com/user-attachments/assets/ff87e01f-d952-441f-86ec-284d0d4d4561)

### Dashboard HelpDesk

![Vista previa Z-Entik 5](https://github.com/user-attachments/assets/a399aeac-7d27-4827-8940-7088a80a4def)


---

# Z-ENTIK - Sistema HelpDesk TI Full Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-2563EB?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-111827?style=for-the-badge&logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-111827?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Render](https://img.shields.io/badge/Render-111827?style=for-the-badge&logo=render&logoColor=white)
![Brevo](https://img.shields.io/badge/Brevo-0B996E?style=for-the-badge&logo=maildotru&logoColor=white)

**Z-Entik** es una aplicacion Full Stack orientada a la gestion de tickets TI, soporte tecnico y mesas de ayuda. El proyecto simula un sistema profesional de HelpDesk donde usuarios pueden crear solicitudes, tecnicos pueden gestionarlas y administradores pueden supervisar estados, prioridades, roles y metricas operativas.

Este proyecto forma parte de mi portafolio profesional bajo la identidad **Z Labs**, y tiene como objetivo demostrar conocimientos en **frontend moderno, backend con API REST, autenticacion segura, 2FA por correo, base de datos relacional, arquitectura separada, despliegue cloud, roles, guards, Prisma ORM y buenas practicas de seguridad**.

---

## Estado del Proyecto

Actualmente el proyecto cuenta con una version funcional desplegada en Render.

### Hitos completados

* Frontend creado con React + TypeScript + Vite.
* Backend creado con NestJS + TypeScript + Node.js.
* API REST protegida con JWT y guards.
* Registro e inicio de sesion implementados.
* Verificacion de correo con Brevo.
* Recuperacion de contraseña por correo.
* 2FA por correo para login y configuracion de seguridad.
* Roles diferenciados: usuario, tecnico, administrador y demo admin.
* Modulo HelpDesk de tickets implementado.
* Base de datos PostgreSQL en Neon conectada con Prisma 7.
* Seed de usuarios demo y tickets iniciales.
* Despliegue separado de frontend y backend en Render.
* Variables de entorno configuradas para produccion.
* Estetica basada en la identidad visual de Z Labs.

---

## Demo

La aplicacion se encuentra desplegada en Render.

```txt
Frontend: https://z-entik-web.onrender.com
Backend: https://z-entik-api.onrender.com
```

---

## Repositorio

```txt
https://github.com/SebastianASR/Z-Entik
```

---

## -> Vista inicial del proyecto

La version actual permite comprobar el flujo completo entre frontend, backend, base de datos y servicios externos:

```txt
Frontend React + TypeScript
        ↓
API REST
        ↓
Backend NestJS
        ↓
Prisma ORM
        ↓
PostgreSQL Neon
        ↓
Brevo para correos transaccionales
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

## Objetivo del Proyecto

Z-Entik busca representar un sistema HelpDesk TI moderno con funcionalidades como:

* Registro e inicio de sesion de usuarios.
* Autenticacion segura mediante JWT.
* Hash seguro de contraseñas con Argon2id.
* Verificacion de correo por Brevo.
* Recuperacion de contraseña por correo.
* Verificacion en dos pasos por correo.
* Roles diferenciados.
* Creacion y gestion de tickets.
* Asignacion de tecnicos.
* Estados y prioridades.
* Comentarios en tickets.
* Dashboard por rol.
* API REST estructurada.
* Base de datos PostgreSQL en la nube.
* Despliegue cloud con Render.
* Seeds para entorno demo y portafolio.

---

## Roles del Sistema

El sistema contempla tres tipos principales de usuario:

### Usuario

* Crear tickets de soporte.
* Ver sus propios tickets.
* Comentar en sus solicitudes.
* Consultar el estado de sus incidencias.

### Tecnico

* Ver tickets asignados.
* Ver tickets sin asignar disponibles para atencion.
* Cambiar estado de tickets.
* Responder comentarios.
* Registrar avances de soporte.

### Administrador

* Ver todos los tickets.
* Asignar tickets a tecnicos.
* Gestionar estados, prioridades y categorias.
* Consultar metricas del sistema.
* Acceder a vistas administrativas.

---

## Funcionalidades Planificadas

### Gestion de Tickets

* Crear ticket.
* Ver detalle de ticket.
* Editar ticket.
* Cambiar estado.
* Asignar tecnico.
* Definir prioridad.
* Definir categoria.
* Agregar comentarios.
* Cerrar ticket.

### Estados de Ticket

* Abierto.
* En revision.
* En progreso.
* En espera.
* Resuelto.
* Cerrado.

### Prioridades

* Baja.
* Media.
* Alta.
* Critica.

### Categorias

* Hardware.
* Software.
* Red.
* Cuenta de usuario.
* Accesos.
* Seguridad.
* Otro.

---

## Seguridad Planificada

El proyecto implementa una autenticacion mas completa que un login tradicional.

### Caracteristicas de seguridad

* Hash seguro de contraseñas con Argon2id.
* Autenticacion con JWT.
* Política de Contraseña Robusta
* Guards de NestJS para proteger rutas.
* Control de acceso basado en roles.
* Validacion de datos de entrada con DTOs.
* Variables de entorno para secretos.
* Verificacion de correo por Brevo.
* Recuperacion de contraseña por token temporal.
* Verificacion en dos pasos por correo.
* Tokens temporales separados para login 2FA.
* Proteccion de rutas privadas en frontend.
* Separacion entre datos publicos, privados y demo.
* Bloqueo de acciones criticas para cuentas demo.

### Autenticacion proyectada

```txt
Usuario ingresa correo y contraseña
        ↓
Backend valida credenciales
        ↓
Se verifica hash de contraseña
        ↓
Si la cuenta tiene 2FA activo, se genera codigo temporal
        ↓
Se envia codigo por correo
        ↓
Usuario confirma el codigo
        ↓
Backend genera JWT final
        ↓
Frontend accede a rutas protegidas
```

---

## 2FA por Correo

El sistema implementa verificacion en dos pasos mediante correo electronico usando **Brevo API**.

Flujo esperado:

```txt
Login correcto
        ↓
Backend detecta 2FA activo
        ↓
Generar codigo temporal
        ↓
Guardar hash del codigo
        ↓
Enviar codigo por correo
        ↓
Validar codigo
        ↓
Marcar codigo como usado
        ↓
Crear sesion segura con JWT
```

Tambien existe flujo para activar y desactivar 2FA desde la seccion de seguridad del usuario.

---

## Tecnologias Utilizadas

### Frontend

* React
* TypeScript
* Vite
* React Router
* HTML5
* CSS3
* Fetch API
* Diseno responsive
* Modo claro / oscuro

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
* Argon2id
* Passport JWT

### Base de Datos

* PostgreSQL
* Neon PostgreSQL
* Prisma ORM 7
* Prisma migrations
* Prisma seed

### Autenticacion y Seguridad

* JWT
* Hash seguro de contraseñas
* Verificacion de correo
* Recuperacion de contraseña
* 2FA por correo
* Brevo API
* Variables de entorno
* Roles y guards
* Bloqueo de acciones demo

### DevOps / Infraestructura

* Git
* GitHub
* Render
* Neon
* Variables de entorno en produccion
* Build separado de frontend y backend
* Seed automatico para datos demo

---

## Arquitectura del Proyecto

El proyecto esta organizado como un monorepo simple, separando frontend y backend en carpetas independientes.

```txt
Z-Entik/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── auth/
│   │   ├── prisma/
│   │   ├── tickets/
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── package.json
│   ├── prisma.config.ts
│   └── tsconfig.json
│
├── README.md
└── .gitignore
```

---

## Comunicacion Frontend - Backend

El frontend se ejecuta localmente en:

```txt
http://localhost:5173
```

El backend se ejecuta localmente en:

```txt
http://localhost:3000
```

En produccion, ambos servicios estan desplegados por separado en Render:

```txt
Frontend: https://z-entik-web.onrender.com
Backend: https://z-entik-api.onrender.com
```

Para permitir la comunicacion entre ambos entornos, el backend tiene CORS configurado para aceptar solicitudes desde el frontend.

```ts
app.enableCors({
  origin: allowedOrigins,
  credentials: true,
});
```

---

## Configuracion Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/SebastianASR/Z-Entik.git
cd Z-Entik
```

Variables principales del backend:

```txt
DATABASE_URL=
FRONTEND_URL=http://localhost:5173
APP_BACKEND_URL=http://localhost:3000
JWT_SECRET=
JWT_EXPIRES_IN=1h
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=Z-Entik
EMAIL_VERIFICATION_EXPIRES_MINUTES=30
PASSWORD_RESET_EXPIRES_MINUTES=30
TWO_FACTOR_CODE_EXPIRES_MINUTES=5
TWO_FACTOR_LOGIN_TOKEN_EXPIRES_MINUTES=5
```

Variables principales del frontend:

```txt
VITE_API_URL=http://localhost:3000
```

---

## Ejecutar Frontend

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

## Ejecutar Backend

Entrar a la carpeta del backend:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Generar cliente Prisma:

```bash
npm run prisma:generate
```

Ejecutar migraciones en desarrollo:

```bash
npm run prisma:migrate
```

Ejecutar seed:

```bash
npm run prisma:seed
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

## Prueba de Conexion

Para probar la conexion completa:

1. Ejecutar el backend en una terminal.
2. Ejecutar el frontend en otra terminal.
3. Abrir el navegador en:

```txt
http://localhost:5173
```

La aplicacion debe permitir:

```txt
Registro de usuario
Verificacion de correo
Inicio de sesion
Activacion de 2FA
Creacion de tickets
Consulta de tickets por rol
```

---

## Base de Datos Planificada

La base de datos usa PostgreSQL con Prisma ORM.

Entidades principales:

```txt
User
Ticket
TicketComment
TicketCategory
TicketPriority
TicketStatus
TwoFactorCode
EmailVerificationToken
PasswordResetToken
```

Relaciones principales:

```txt
User 1 --- N Ticket
User 1 --- N TicketComment
Ticket 1 --- N TicketComment
User 1 --- N EmailVerificationToken
User 1 --- N PasswordResetToken
User 1 --- N TwoFactorCode
```

---

## Roadmap

### Fase 1 - Base Full Stack

* Crear repo separado.
* Crear frontend con React + TypeScript.
* Crear backend con NestJS + TypeScript.
* Configurar CORS.
* Crear endpoint `/health`.
* Conectar frontend con backend.

### Fase 2 - Base de Datos

* Configurar Prisma.
* Conectar PostgreSQL.
* Crear modelos iniciales.
* Ejecutar migracion inicial.
* Probar conexion con Neon.

### Fase 3 - Autenticacion

* Registro de usuarios.
* Login.
* Hash seguro de contraseñas.
* JWT.
* Guards de autenticacion.
* Roles.

### Fase 4 - 2FA

* Generar codigo temporal.
* Guardar hash del codigo.
* Enviar codigo por correo con Brevo.
* Validar codigo.
* Marcar codigos usados.
* Activar sesion segura.

### Fase 5 - Tickets

* Crear tickets.
* Listar tickets.
* Ver detalle.
* Actualizar estado.
* Asignar tecnico.
* Comentar ticket.

### Fase 6 - Dashboard

* Dashboard de usuario.
* Dashboard de tecnico.
* Dashboard de administrador.
* Metricas de tickets.

### Fase 7 - Infraestructura

* Deploy frontend en Render.
* Deploy backend en Render.
* PostgreSQL en Neon.
* Variables de entorno en produccion.
* Build y start commands configurados.
* Seed de datos demo en despliegue.

---

## Estado Actual

* Proyecto en desarrollo avanzado para portafolio.
* Frontend completo de autenticacion y HelpDesk.
* Backend funcional con NestJS, Prisma y PostgreSQL.
* Autenticacion JWT implementada.
* Verificacion de correo implementada con Brevo.
* Recuperacion de contraseña implementada.
* 2FA por correo implementado.
* Roles y guards implementados.
* Tickets HelpDesk implementados.
* Usuarios demo y tickets demo disponibles mediante seed.
* Frontend y backend desplegados en Render.
* Base de datos desplegada en Neon.
* Proximas mejoras: refinamiento visual, pruebas ampliadas, documentacion API y endurecimiento de produccion.

---

## Autor

Desarrollado por Sebastian Sandoval Romero  
Ingeniero en Informatica  
Perfil orientado a desarrollo **Backend / Full-Stack**  
Santiago, Chile

* [LinkedIn](https://www.linkedin.com/in/sebasti%C3%A1n-andr%C3%A9-sandoval-romero-115710296/)
* [Email] sandoval.romero.sebastian@gmail.com

---

<div align="center">

### Z Labs

**Building software. Creating solutions.**

</div>

