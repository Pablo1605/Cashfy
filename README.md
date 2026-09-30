# Cashfy

Cashfy es una aplicación web de gestión de finanzas personales diseñada para ayudar a controlar y optimizar gastos, ingresos y presupuestos. El proyecto combina un backend robusto desarrollado con Spring Boot y Spring Security, con una interfaz de usuario moderna construida en React y TypeScript.

## Capturas

![Dashboard](https://postimg.cc/VrX16h0M)

![Transactions](https://postimg.cc/njqZzW9m)

![Categores](https://postimg.cc/dkGv1fZh)


## Características

- **Gestión de Transacciones:** Registra y categoriza tus gastos e ingresos con facilidad.
- **Categorización Personalizada:** Crea y gestiona categorías de gastos según tus necesidades.
- **Análisis financiero:** visualiza la distribución de gastos y la evolución de tus finanzas mediante gráficos.
- **Autenticación Segura:** Sistema de autenticación robusto con JWT para proteger tus datos.
- **Panel de Control:** Dashboard intuitivo con resumen de balance total y gastos mensuales.
- **Interfaz Responsiva:** Diseño moderno y adaptable a cualquier dispositivo.

## Tecnologías Utilizadas

### Backend
- [Spring Boot](https://spring.io/projects/spring-boot) - Framework Java para aplicaciones empresariales
- [Spring Security](https://spring.io/projects/spring-security) - Autenticación y autorización
- [JWT (JSON Web Tokens)](https://jwt.io/) - Tokens seguros para autenticación
- [MongoDB](https://www.mongodb.com/) - Base de datos NoSQL
- [Gradle](https://gradle.org/) - Gestor de dependencias y build

### Frontend
- [React](https://react.dev/) - Librería JavaScript para interfaces de usuario
- [TypeScript](https://www.typescriptlang.org/) - Superset tipado de JavaScript
- [Vite](https://vitejs.dev/) - Build tool moderno y rápido
- [Zustand](https://github.com/pmndrs/zustand) - State management ligero

### DevOps
- [Docker](https://www.docker.com/) - Containerización de aplicaciones
- [Docker Compose](https://docs.docker.com/compose/) - Orquestación de contenedores

## Estructura del Proyecto

```
Cashfy/
├── Cashfy-api/                 # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/
│   │   │   │   ├── controller/    # Controladores REST
│   │   │   │   ├── service/       # Lógica de negocio
│   │   │   │   ├── repository/    # Acceso a datos
│   │   │   │   ├── model/         # Entidades
│   │   │   │   ├── config/        # Configuración
│   │   │   │   └── security/      # JWT y seguridad
│   │   │   └── resources/
│   │   │       └── application.properties  # Configuración
│   │   └── test/                  # Tests unitarios
│   ├── docker-compose.yml      # Configuración Docker
│   ├── build.gradle            # Dependencias Gradle
│   └── HELP.md
│
└── Cashfy-web/                 # Frontend React + TypeScript
    ├── src/
    │   ├── components/         # Componentes React
    │   ├── pages/              # Páginas principales
    │   ├── hooks/              # Custom hooks
    │   ├── store/              # Estado global (Zustand)
    │   ├── api/                # Cliente HTTP
    │   ├── types/              # Tipos TypeScript
    │   ├── auth/               # Lógica de autenticación
    │   └── theme/              # Estilos y tema
    ├── public/                 # Archivos estáticos
    ├── index.html              # HTML principal
    ├── package.json            # Dependencias npm
    ├── vite.config.ts          # Configuración Vite
    └── tsconfig.json           # Configuración TypeScript
```

## Comenzando

### Requisitos Previos

- [Java JDK 21](https://www.oracle.com/java/technologies/javase-downloads.html)
- [Node.js y npm](https://nodejs.org/) y npm
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Instalación

#### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/Cashfy.git
cd Cashfy
```

#### 2. Iniciar Mongo con Docker compose

```bash
cd Cashfy-api

# Inicia MongoDB y el backend
docker-compose up -d
```

#### 3. Iniciar el backend

En Windows:

```powershell
cd Stayly-backend
Y ejecutar:
export MONGODB_URI="mongodb://admin:password@localhost:27017/cashfydb?authSource=admin"
export JWT_SECRET="tu_clave_secreta"
gradlew.bat bootRun
```

En macOS o Linux:

```bash
cd Stayly-backend
Y ejecutar:
export MONGODB_URI="mongodb://admin:password@localhost:27017/cashfydb?authSource=admin"
export JWT_SECRET="tu_clave_secreta"
./gradlew bootRun
```

La API estará disponible en `http://localhost:8081`.

#### 4. Configurar el Frontend

```bash
cd Cashfy-web

# Instala las dependencias
npm install

# Inicia el servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173` (por defecto con Vite)

## Configuración de Variables de Entorno

### Backend (`Cashfy-api/src/main/resources/application.properties`)

El backend utiliza variables de entorno para configurar la conexión a MongoDB y la autenticación mediante JWT.

Dentro de Cashfy-api/, crea un archivo .env a partir de .env.example:
cp .env.example .env
Completa las variables del archivo .env:
MONGODB_URI=mongodb://admin:password@localhost:27017/cashfydb?authSource=admin
JWT_SECRET=tu_clave_secreta

Las variables utilizadas son:

-MONGODB_URI: URI de conexión a MongoDB.
-JWT_SECRET: clave secreta utilizada para firmar los tokens JWT.


Ejemplo de configuración:

server.port=8081
server.servlet.context-path=/api

spring.data.mongodb.uri=${MONGODB_URI}
spring.data.mongodb.database=cashfy

jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

app.cors.allowedOrigins=http://localhost:5173,http://localhost:3000

### Frontend (`Cashfy-web/.env`)

```
VITE_API_URL=http://localhost:8081/api
```

## Uso

### Flujo de Autenticación

1. **Registro:** Crea una nueva cuenta con email y contraseña
2. **Login:** Inicia sesión para obtener el JWT
3. **Token JWT:** Se almacena automáticamente en localStorage
4. **Acceso Protegido:** Las rutas protegidas verifican la validez del token

## Seguridad

- ✅ Autenticación con JWT
- ✅ Contraseñas almacenadas mediante hashing con BCrypt
- ✅ CORS configurado
- ✅ Rutas protegidas en frontend y backend
- ✅ Validación de datos en servidor


## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Transacciones
- `GET /api/transactions` - Listar transacciones del usuario
- `POST /api/transactions` - Crear nueva transacción
- `PUT /api/transactions/{id}` - Actualizar transacción
- `DELETE /api/transactions/{id}` - Eliminar transacción

### Categorías
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría
- `PUT /api/categories/{id}` - Actualizar categoría
- `DELETE /api/categories/{id}` - Eliminar categoría

### Dashboard
- `GET /api/dashboard` - Obtener resumen financiero

## Desarrollo

### Ejecutar Tests

```bash
cd Cashfy-api
./gradlew test
```

### Build para Producción

#### Backend
```bash
cd Cashfy-api
./gradlew build
```

#### Frontend
```bash
cd Cashfy-web
npm run build
```


## Autor

Pablo Ramírez

## Contacto

- LinkedIn: https://www.linkedin.com/in/pablo-ramirez-22203a377/
- GitHub: https://github.com/Pablo1605
- Email: pabloram1605@gmail.com

---

## Objetivo del Proyecto

Cashfy fue desarrollado como proyecto full-stack para aplicar conceptos de desarrollo web, arquitectura REST, autenticación, persistencia de datos y despliegue mediante Docker.

El objetivo principal es demostrar competencias en el desarrollo de aplicaciones web modernas utilizando Java, Spring Boot, React, TypeScript y MongoDB.