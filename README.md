# 🛒 E-Commerce Frontend & Backend API Integration

Aplicación Full Stack de comercio electrónico desarrollada con Next.js (App Router) para el frontend y Laravel API para el backend. Ofrece autenticación basada en tokens Bearer (httpOnly cookies), control de acceso basado en roles (Admin/User), gestión de productos (CRUD), integración de pasarela de pago con Stripe y notificaciones flotantes con react-hot-toast.

---

## 🚀 Características Principales

- **Gestión de Productos (CRUD):** 
  - Catálogo público con detalle de productos.
  - Creación, edición y eliminación limitada exclusivamente a usuarios con rol admin.
- **Control de Acceso por Roles (admin vs user):**
  - Doble capa de seguridad: validación en Server Actions contra /me y renderizado condicional en la interfaz.
- **Autenticación y Persistencia:**
  - Manejo de sesiones mediante cookies httpOnly y tokens Bearer.
- **Carrito de Compras y Checkout:**
  - Procesamiento de pagos en modo prueba integrado con Stripe.
  - Flujo completo de órdenes y consulta del historial (/my-orders).
- **Retroalimentación de Usuario (UX):**
  - Notificaciones flotantes con react-hot-toast.
- **Infraestructura con Docker:**
  - Base de datos populada automáticamente con seeders en Laravel (admin@admin.com y user@user.com).

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Framework:** Next.js 15+ (App Router, Server Components & Server Actions)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Notificaciones:** react-hot-toast
- **Pagos:** Stripe SDK / React Stripe

### Backend
- **Framework:** Laravel (RESTful API)
- **Base de Datos:** MySQL / PostgreSQL
- **Contenedorización:** Docker & Docker Compose

---

## 📋 Requisitos Previos

Tener instalado en tu sistema:
- Node.js (versión 18 o superior)
- Git
- Docker y Docker Compose

---

## ⚙️ Configuración e Instalación

### 1. Clonar el Repositorio

git clone https://github.com/RDCFlores/e-commerce-frontend.git
cd e-commerce-frontend

### 2. Variables de Entorno (.env.local)

Crear un archivo .env.local en la raíz del proyecto frontend y configurar las siguientes variables:

NEXT_PUBLIC_API_URL=http://localhost:8000/api

### 3. Instalación de Dependencias

npm install

### 4. Inicialización del Backend (Laravel + Docker)

Para configurar la API y la base de datos, consultar los requisitos específicos e instrucciones detalladas en el repositorio del backend:
👉 https://github.com/RDCFlores/api_ecommerce_app

1. Clonar e ingresar al repositorio de la API.
2. Levantar los contenedores:
   docker compose up -d
3. Ejecutar las migraciones y sembrar la base de datos:
   docker compose exec app php artisan migrate:fresh --seed

### 5. Iniciar Servidor de Desarrollo Frontend

npm run dev

Abre http://localhost:3000 en el navegador para ver la aplicación funcionando.

---

## 🔑 Credenciales de Prueba

La base de datos se inicializa automáticamente con dos cuentas de usuario para pruebas de rol y funcionalidad:

| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| Administrador | admin@admin.com | password123 | Crear, editar y eliminar productos + Comprar |
| Cliente Regular | user@user.com | password123 | Navegar catálogo, carrito de compras y realizar checkout |

---

## 🧪 Comandos Útiles

# Correr linter de Next.js
npm run lint

# Generar build de producción
npm run build

# Iniciar en modo producción
npm run start

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT.