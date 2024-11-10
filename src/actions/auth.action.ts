import jwt from 'jsonwebtoken';
import { IUser } from '../user/user.model';
import User from '../user/user.model';

export const registerUserAction = async (userData: Partial<IUser>) => {
  const newUser = new User(userData);
  await newUser.save();
  return newUser;
};

export const loginUserAction = async (email: string, password: string) => {
  const user = await User.findOne({ email, isActive: true });
  
  if (!user) {
    throw new Error('User not found or inactive');
  }

  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  return { user, token };
};

export const verifyTokenAction = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
