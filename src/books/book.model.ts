import { Schema, model } from 'mongoose';

// Definir la interfaz IBook que describe la estructura del libro
export interface IBook {
  title: string;
  author: string;
  genre: string;
  publishedDate: Date;
  publisher: string;
  isAvailable: boolean;
  reservedBy: Array<{
    userId: string;
    reservedDate: Date;
    returnDate: Date;
  }>;
  isActive: boolean;
}

// Definir el esquema de libro
const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    publishedDate: {
      type: Date,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    reservedBy: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        reservedDate: {
          type: Date,
          required: true,
        },
        returnDate: {
          type: Date,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Asegura que Mongoose maneje las fechas de creación y actualización
  }
);

// Crear y exportar el modelo Book a partir del esquema
const Book = model<IBook>('Book', bookSchema);

export default Book;
