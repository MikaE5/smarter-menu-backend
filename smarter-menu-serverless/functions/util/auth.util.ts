import { compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';

export const isValidPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await compare(password, hash);
};

export const createToken = (user: object): string =>
  sign(user, JWT_SECRET, { expiresIn: '15m' });

export const verifyToken = (
  token: string
): { valid: boolean; user?: string } => {
  try {
    const data = verify(token, JWT_SECRET);
    return {
      valid: true,
      user: data['user'],
    };
  } catch (error) {
    return {
      valid: false,
    };
  }
};
