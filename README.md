# DIGICORP Mini E-commerce

---

## 1. Descripción del Proyecto

DIGICORP Mini E-commerce es una aplicación web desarrollada con un backend en Flask (Python) y un frontend construido con Vite + Firebase Authentication y Firestore.

El sistema permite a los usuarios autenticarse mediante Firebase, visualizar productos almacenados en una base de datos MySQL a través de una API REST y gestionar un carrito de compras sincronizado en Firestore.

El carrito de compras permite agregar y eliminar productos, mantener su estado por usuario y realizar la compra, lo que bloquea futuras modificaciones.

---

## 2. Tecnologías Utilizadas

- **Backend:** Python 3, Flask, MySQL Connector, Flask-CORS
- **Frontend:** Vite, Vanilla JavaScript, Firebase Authentication, Firebase Firestore
- **Base de datos:** MySQL (o MariaDB)
- **Autenticación y almacenamiento en tiempo real:** Firebase
- **Despliegue recomendado:** Vercel para frontend, Heroku o VPS para backend

---

## 3. Requisitos Previos

- Python 3.8 o superior
- Node.js 16 o superior y npm
- MySQL o MariaDB instalado y configurado
- Cuenta y proyecto configurado en Firebase
- Git instalado para control de versiones

---

## 4. Estructura del Proyecto

```plaintext
digicorp-ecommerce/
├── backend/
│   ├── app.py
│   ├── db.py
│   ├── requirements.txt
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── main.js
│   ├── firebase-config.js
│   └── assets/
├── digicorp-ecommerce-frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
├── .gitignore
├── README.md

5. Instalación y Configuración

5.1 Backend

Navegar a la carpeta backend:

cd backend

Crear entorno virtual e instalar dependencias:

python -m venv venv

# En Windows
venv\Scripts\activate

# En Linux/Mac
source venv/bin/activate

pip install -r requirements.txt

Crear base de datos MySQL y tabla de productos (ejecutar script SQL proporcionado).

Configurar las variables de entorno para conexión a base de datos en un archivo .env:

MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=tu_contraseña_mysql
MYSQL_DB=digicorp_db
Nota: El archivo .env NO debe ser incluido en el repositorio.

5.2 Frontend

Navegar a la carpeta frontend (o digicorp-ecommerce-frontend si se usa Vite):

cd ../digicorp-ecommerce-frontend

Instalar dependencias:

npm install

Crear archivo .env para Firebase con las variables necesarias (prefijo VITE_ obligatorio):

VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

6. Ejecución Local

Backend

Desde la carpeta backend y con entorno virtual activado:

python app.py

El backend estará disponible en http://localhost:5000.

Frontend

Desde la carpeta digicorp-ecommerce-frontend:

npm run dev

El frontend estará disponible en http://localhost:5173.

7. Uso y Funcionalidades

Registro y autenticación mediante Firebase Authentication.

Visualización de productos consumidos desde la API Flask y base de datos MySQL.

Gestión de carrito de compras almacenado en Firestore, asociado a cada usuario.

Botones para agregar y eliminar productos del carrito.

Opción para vaciar carrito.

Al confirmar compra, el carrito se marca como comprado y no se muestra en futuras sesiones.

8. Despliegue Recomendado

Frontend: Plataforma Vercel o Netlify para aplicaciones estáticas.

Backend: Plataforma Heroku, Railway o VPS que soporte Python + MySQL.

Configurar las variables de entorno adecuadamente en los entornos de producción.

9. Buenas Prácticas Implementadas

Uso de variables de entorno para credenciales sensibles.

Separación clara entre frontend y backend.

Restricción de acceso a datos por usuario en Firestore.

Uso de CORS para permitir comunicación segura entre frontend y backend.

Manejo adecuado de estados de autenticación y sincronización del carrito.

10. Información del Desarrollador

Gustavo Franco Cardenas Manrique
Email: gus.localhost@gmail.com
GitHub: https://github.com/gustavofranco26/digicorp-ecommerce
