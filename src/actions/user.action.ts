import User, { IUser } from '../user/user.model';

// Actualizar un usuario por ID
export const updateUserById = async (userId: string, updates: Partial<IUser>): Promise<IUser | null> => {
  const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true })
    .select('-password');
  
  if (!updatedUser) {
    throw new Error('User not found');
  }

  return updatedUser;
};

// Desactivar un usuario por ID
export const desactivateUserById = async (userId: string): Promise<void> => {
  const user = await User.findByIdAndUpdate(userId, { isActive: false });
  
  if (!user) {
    throw new Error('User not found');
  }
};
