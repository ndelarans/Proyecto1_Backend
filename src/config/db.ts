import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Conecta a la base de datos de MongoDB.
 * Si no se puede conectar, termina el proceso.
 */
const connectDatabase = async (): Promise<void> => {
  const connectionString = process.env.DB_CONNECT;

  if (!connectionString) {
    throw new Error('La cadena de conexión a la base de datos no está definida.');
  }

  try {
    await mongoose.connect(connectionString);
    console.log('Conexión exitosa a la base de datos');
  } catch (err) {
    const error = err as Error;
    console.error('Error al conectar a la base de datos:', error.message);
    process.exit(1);
  }
};

export default connectDatabase;
