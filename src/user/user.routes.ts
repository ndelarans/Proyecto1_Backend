import { Router, Response } from 'express';
import { updateUserController, desactivateUserController } from '../user/user.controller';
import { authMiddleware } from '../auth/authMiddleware';
import { updateUserPermissionMiddleware, deleteUserPermissionMiddleware } from '../middlewares/permissionMiddleware';
import { AuthRequest } from '../custom';

const userRoutes = Router();

// Controlador para actualizar un usuario
const handleUpdateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId || req.user?.id;
    if (!userId) {
      throw new Error('User ID is missing');
    }

    const userUpdates = req.body;
    const updatedUser = await updateUserController(userId, userUpdates);

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(400).json({ message: errorMessage });
  }
};

// Controlador para desactivar un usuario
const handleDesactivateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId || req.user?.id;
    if (!userId) {
      throw new Error('User ID is missing');
    }

    await desactivateUserController(userId);

    res.status(200).json({
      message: 'User deactivated successfully',
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(400).json({ message: errorMessage });
  }
};

// Rutas para actualizar y desactivar usuario
userRoutes.put(
  '/update/:userId?',
  authMiddleware,
  updateUserPermissionMiddleware,
  handleUpdateUser
);

userRoutes.delete(
  '/desactivate/:userId?',
  authMiddleware,
  deleteUserPermissionMiddleware,
  handleDesactivateUser
);

export default userRoutes;
