import { registerUserAction, loginUserAction } from '../actions/auth.action';

// Registrar un nuevo usuario
export const registerController = async (userData: { name: string; email: string; password: string }) => {
  const newUser = await registerUserAction(userData);
  return newUser;
};

// Iniciar sesión de un usuario
export const loginController = async (email: string, password: string) => {
  const authData = await loginUserAction(email, password);
  return {
    user: authData.user,
    token: authData.token
  };
};
