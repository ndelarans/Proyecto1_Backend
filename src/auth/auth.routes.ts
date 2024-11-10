import { Router, Request, Response } from 'express';
import { registerController, loginController } from './auth.controller';

const router = Router();

// Registrar un nuevo usuario
const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const user = await registerController({ name, email, password });
    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Iniciar sesión de un usuario
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { user, token } = await loginController(email, password);
    res.status(200).json({
      message: 'Login successful',
      user,
      token
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Manejar errores de la aplicación
const handleError = (error: unknown, res: Response) => {
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  res.status(400).json({ message: errorMessage });
};

// Definir las rutas
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
