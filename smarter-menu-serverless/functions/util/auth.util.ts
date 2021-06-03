import { sign, verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';
import { StoredPassword } from '../model/user.interface';
import { pbkdf2Sync } from 'crypto';

export const isValidPassword = (
  password: string,
  storedPassword: StoredPassword
): boolean => {
  const key = pbkdf2Sync(
    password,
    storedPassword.salt,
    storedPassword.iterations,
    64,
    'sha512'
  );
  const hash = key.toString('hex');
  return hash === storedPassword.hash;
};

export const createToken = (user: object): string =>
  sign(user, JWT_SECRET, { expiresIn: '15m' });

export const verifyToken = (
  token: string
): { valid: boolean; customer?: string } => {
  try {
    const data = verify(token, JWT_SECRET);
    return {
      valid: true,
      customer: data['customer'],
    };
  } catch (error) {
    return {
      valid: false,
    };
  }
};
