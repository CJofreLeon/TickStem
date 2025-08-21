# TickStem: Sistema de Gestión de Tickets

TickStem es una aplicación web full-stack diseñada para ofrecer una solución robusta y eficiente para la gestión de tickets de soporte. Construida con tecnologías modernas, la plataforma permite a las organizaciones manejar solicitudes de clientes, asignar tareas a equipos de soporte y supervisar el ciclo de vida completo de cada ticket a través de un sistema de roles bien definido.

## ✨ Características Principales

- **Gestión Completa de Tickets:** Creación, asignación, actualización de estado, y seguimiento de tickets.
- **Control de Acceso Basado en Roles (RBAC):** Permisos y vistas personalizadas para diferentes tipos de usuarios (Clientes, Analistas, Jefatura, Superadmin).
- **Dashboard Interactivo:** Visualización de métricas clave y estado general del sistema en tiempo real.
- **Autenticación Segura:** Implementación de JSON Web Tokens (JWT) para proteger las rutas y los datos de la aplicación.
- **Interfaz de Usuario Moderna:** Una interfaz limpia y responsiva construida con React para una experiencia de usuario fluida.
- **Notificaciones:** Sistema de notificaciones para mantener a los usuarios informados sobre actualizaciones relevantes en sus tickets.

## 🎭 Roles de Usuario

El sistema opera con cuatro roles distintos, cada uno con responsabilidades y permisos específicos para garantizar un flujo de trabajo organizado y seguro.

### 1. Cliente
El rol fundamental del sistema. Los clientes son los usuarios que generan los tickets.
- **Permisos:**
  - Crear nuevos tickets de soporte.
  - Ver y hacer seguimiento del estado de sus propios tickets.
  - Añadir comentarios o respuestas a sus tickets.

### 2. Analista de Soporte
Miembros del equipo de soporte que trabajan directamente en la resolución de los tickets.
- **Permisos:**
  - Ver los tickets que les han sido asignados.
  - Tomar tickets de una cola de solicitudes no asignadas.
  - Actualizar el estado, la prioridad y otros detalles de los tickets.
  - Comunicarse con los clientes a través de los comentarios del ticket.

### 3. Jefatura (Management)
Supervisores o líderes de equipo que gestionan a los analistas y supervisan las operaciones.
- **Permisos:**
  - Acceso a un dashboard con métricas generales (tickets resueltos, tiempos de respuesta, etc.).
  - Ver todos los tickets del sistema, sin importar el analista asignado.
  - Asignar o reasignar tickets a los analistas.
  - Gestionar el equipo de analistas (sin poder crearlos o eliminarlos).

### 4. Superadmin
El rol con el nivel más alto de acceso, responsable de la configuración y administración general del sistema.
- **Permisos:**
  - Todas las capacidades de los roles anteriores.
  - Crear, editar y eliminar cuentas de usuario de cualquier rol.
  - Configurar parámetros globales del sistema.
  - Acceso completo a todos los datos y funcionalidades de la aplicación.

## 🛠️ Arquitectura y Tecnologías

TickStem sigue una arquitectura de aplicación web moderna, separando claramente el backend y el frontend para un desarrollo y despliegue más sencillos.

### Backend
Construido con **Java** y el framework **Spring Boot**, sigue un patrón de diseño de **Arquitectura en Capas (Layered Architecture)**:

- **Controladores (`Controllers`):** Exponen la API RESTful, manejando las solicitudes HTTP y las respuestas. Utiliza Spring Security con JWT para la autenticación y autorización.
- **Servicios (`Services`):** Contienen la lógica de negocio principal de la aplicación. Desacoplan los controladores de la capa de acceso a datos.
- **Repositorios (`Repositories`):** Gestionan la comunicación con la base de datos utilizando **Spring Data JPA**, abstrayendo las operaciones CRUD. 
- **Entidades (`Entities`):** Modelan los objetos del dominio que se persisten en la base de datos.

**Tecnologías Principales:**
- **Java 24**
- **Spring Boot 3**
- **Spring Security (JWT)**
- **Spring Data JPA (Hibernate)**
- **Maven** (Gestor de dependencias)
- **MySQL** (Base de datos relacional, gestionada vía Docker Compose)

### Frontend
Una **Single Page Application (SPA)** desarrollada con **React**, que sigue un patrón de **Arquitectura Basada en Componentes**.

- **Componentes (`Components`):** Piezas reutilizables de la interfaz de usuario que gestionan su propio estado.
- **React Router:** Para la navegación y el enrutamiento del lado del cliente.
- **Context API (`Context`):** Para la gestión del estado global, especialmente la información de autenticación del usuario.
- **Servicios de API:** Funciones dedicadas para consumir la API RESTful del backend.

**Tecnologías Principales:**
- **React 18**
- **JavaScript (ES6+)**
- **CSS3** (con un enfoque de estilos unificados)
- **Node.js & npm** (Entorno de ejecución y gestor de paquetes)

## 🚀 Despliegue en Local (con Docker Compose)

La forma recomendada para desplegar y ejecutar TickStem en tu entorno local es utilizando Docker Compose. Asegúrate de tener **Docker** instalado en tu sistema.

1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/TickStem.git
    cd TickStem
    ```

2.  **Construir e Iniciar la Aplicación:**
    Desde la raíz del proyecto (`TickStem/`), ejecuta el siguiente comando. Esto construirá las imágenes de Docker para el backend y el frontend, y luego iniciará todos los servicios (base de datos MySQL, backend de Spring Boot y frontend de React).
    ```bash
    docker-compose up --build
    ```
    Una vez que los servicios estén en funcionamiento, podrás acceder a la aplicación frontend en `http://localhost:3000`. El backend estará disponible en `http://localhost:8080`.

## 👤 Usuario Superadmin Inicial

Para facilitar el inicio, la base de datos se inicializa automáticamente con un usuario superadmin.

-   **Correo:** `superadmin@email.com`
-   **Contraseña:** `password`

**Nota Importante sobre la Contraseña:**
La contraseña `password` se inserta en texto plano en la base de datos durante la inicialización. Sin embargo, la aplicación backend (Spring Boot) utiliza un mecanismo de hashing de contraseñas (como BCrypt) por razones de seguridad.

Para obtener un usuario superadmin funcional con el que puedas iniciar sesión:
1.  Una vez que la aplicación esté completamente levantada y accesible en `http://localhost:3000`, utiliza la interfaz de registro de usuarios de la aplicación para crear un nuevo usuario.


---

### Nota Sobre el Origen del Proyecto

La idea conceptual de TickStem se originó a partir de un proyecto para un curso universitario. Sin embargo, esta implementación es una reinvención completa construida desde cero. Se tomó únicamente la idea base de un "sistema de tickets con roles" y se desarrolló con un enfoque profesional, aplicando mejores prácticas de la industria, una arquitectura de software robusta, un diseño de interfaz de usuario más cuidado y una lógica de negocio más sólida y escalable. El objetivo fue transformar un concepto académico en una aplicación funcional y bien diseñada.
