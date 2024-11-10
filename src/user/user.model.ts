import { Schema, model } from 'mongoose';
import argon2 from 'argon2';

// Definición de la interfaz IUser
interface IUser {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  permissions: Record<string, boolean>;
  reservations?: Array<{
    bookId: Schema.Types.ObjectId;
    reservedAt: Date;
    returnedAt?: Date;
  }>;
  comparePassword(candidatePassword: string): Promise<boolean>;
  hasPermission(permission: keyof IUser['permissions']): boolean;
}

// Esquema del usuario
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: Object,
      default: {
        edit_user: false,
        delete_user: false,
        create_book: false,
        edit_book: false,
        delete_book: false,
      },
    },
    reservations: [
      {
        bookId: { 
          type: Schema.Types.ObjectId, 
          ref: 'Book' 
        },
        reservedAt: {
          type: Date,
          default: Date.now,
        },
        returnedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Middleware para hash de la contraseña
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await argon2.hash(this.password);
    next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      next(err);  // Si err es una instancia de Error, se pasa a next()
    } else {
      next(new Error('Error al procesar la contraseña')); // En caso de que err no sea un Error conocido
    }
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (err: unknown) {
    return false;
  }
};

// Método para verificar permisos
userSchema.methods.hasPermission = function (
  permission: keyof IUser['permissions']
): boolean {
  return Boolean(this.permissions[permission]);
};

// Modelo de Usuario
const User = model<IUser>('User', userSchema);
export default User;
