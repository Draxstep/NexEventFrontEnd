# 🎟️ NexEvent - Frontend

Bienvenido al repositorio frontend de **NexEvent**, una plataforma escalable y responsiva para la gestión integral de eventos. Este proyecto fue desarrollado como parte de la asignatura de **Software 2**.

## 📖 Contexto del Proyecto

**NexEvent** está diseñado con una arquitectura modular para separar claramente las responsabilidades según los tipos de usuarios y sus flujos dentro de la aplicación.

La plataforma se divide principalmente en dos grandes módulos (ubicados en `src/features/`):

- **👨‍💼 Módulo de Administradores (`EventsAdmin`)**: Panel completo donde los organizadores pueden crear, modificar, y eliminar eventos, visualizar métricas (`StatsCard`), estados rápidos mediante indicadores (`StatusBadge`), y generar informes detallados (`EventReport`).
- **👤 Módulo de Usuarios (`EventsUsers`)**: Vista pública para los asistentes, donde pueden explorar un catálogo de eventos (`EventGrid` y `EventCard`), filtrar eventos de interés y consultar los detalles de los mismos.

### 🛠️ Tecnologías y Herramientas

El proyecto está construido sobre las siguientes tecnologías modernas:

- **[React 19](https://react.dev/) + [Vite](https://vitejs.dev/)**: Para el renderizado rápido y entorno de desarrollo de alta velocidad.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Construcción de interfaces limpias, adaptables y con utilidades preconfiguradas.
- **[Clerk](https://clerk.dev/) (`@clerk/clerk-react`)**: Servicio seguro y robusto para el manejo de sesiones y autenticación.
- **[React Router DOM](https://reactrouter.com/)**: Control de navegación y enrutamiento (incluyendo rutas protegidas).
- **[Lucide React](https://lucide.dev/)**: Sistema de íconos SVG moderno.

---

## 🚀 Cómo ejecutar el proyecto (Paso a Paso)

Sigue estos pasos para arrancar el proyecto de manera local en tu equipo.

### 1. Requisitos previos

Asegúrate de tener instalado en tu computadora:

- **Node.js**: Se recomienda la versión v18 o superior. ([Descargar Node.js](https://nodejs.org/))
- **NPM** (Viene por defecto al instalar Node) o un gestor de paquetes de tu preferencia como `yarn` o `pnpm`.

### 2. Clonar el repositorio

Si no lo has hecho, clona este proyecto y ubícate en la carpeta principal:

```bash
git clone <URL_DEL_REPOSITORIO>
cd NexEventFrontEnd
```

### 3. Instalar las dependencias

Instala todas las librerías necesarias ejecutando el siguiente comando:

```bash
npm install
```

### 4. Configurar Variables de Entorno

Este proyecto utiliza **Clerk** para la autenticación, lo que significa que requiere unas claves de acceso.

1. Crea un archivo llamado `.env` en la raíz del proyecto (al mismo nivel que el `package.json`).
2. Agrega las variables necesarias de Clerk. El archivo base debería verse similar a esto:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
VITE_API_URL=http://localhost:tunumero (o la url del backend)
```

### 5. Lanzar el servidor de desarrollo

Una vez instaladas las dependencias e ingresadas las variables de entorno, inicia la aplicación ejecutando:

```bash
npm run dev
```

Te aparecerá en la consola una URL parecida a `http://localhost:5173`. Ábrela en tu navegador (puedes presionar la tecla `o` más `Enter` en la misma consola) ¡y listo!

---

## 📁 Estructura Principal (`src/`)

```text
src/
 ├── assets/          # Imágenes estáticas y recursos gráficos.
 ├── components/      # Componentes globales y reutilizables (ej. Breadcrumbs).
 ├── config/          # Configuraciones generales de la app.
 ├── features/        # Módulos principales separando lógica por negocio:
 │    ├── EventsAdmin/ # Lógica, componentes, páginas y hooks exclusivos de Administración
 │    ├── EventsUsers/ # Lógica, componentes, páginas y hooks exclusivos de Usuarios y vista pública
 │    └── Login/       # Lógica e interfaz del inicio de sesión
 ├── hooks/           # Hooks personalizados globales.
 ├── layouts/         # Envoltorios de diseño (ej. MainLayout con Navbar).
 ├── routes/          # Lógica de las rutas principales (AppRouter) y protección (ProtectedRoute).
 └── services/        # Archivos base de conexión a la API (fetch/axios).
```
