import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../user/user.model';
import { AuthRequest } from '../custom';

// Middleware de autenticación
export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;

  // Verificar si existe el token en el header
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    // Verificar si la variable de entorno JWT_SECRET está definida
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret is not defined' });
    }

    // Decodificar el token y verificar la validez
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);

    // Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Asignar la instancia del usuario a req.user para su uso posterior
    req.user = user as AuthRequest['user'];

    // Continuar con el siguiente middleware o controlador
    next();
  } catch (error) {
    // Capturar cualquier error relacionado con la verificación del token
    return res.status(401).json({ message: 'Invalid token' });
  }
};
