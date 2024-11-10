import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './auth/auth.routes';
import userRoutes from './user/user.routes';
import bookRoutes from './books/books.routes';
import connectDB from './config/db';

// Configuración de variables de entorno
dotenv.config();

// Configuración de puerto
const PORT = process.env.PORT || 8080;

// Inicialización de la aplicación express
const app: Application = express();

// Función de configuración inicial
const configureApp = (): void => {
  // Conexión a la base de datos
  connectDB();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Rutas de la API
  configureRoutes();
};

// Función para configurar las rutas de la API
const configureRoutes = (): void => {
  app.use('/api/auth', authRoutes);   // Rutas de autenticación
  app.use('/api/user', userRoutes);   // Rutas de usuarios
  app.use('/api/books', bookRoutes);  // Rutas de libros

  // Middleware para manejo de rutas no encontradas
  app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
  });
};

// Iniciar el servidor
const startServer = (): void => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

// Ejecutar configuración de la app e iniciar el servidor
const runApp = (): void => {
  configureApp();
  startServer();
};

// Ejecutar la aplicación
runApp();
