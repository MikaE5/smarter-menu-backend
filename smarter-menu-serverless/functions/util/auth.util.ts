import { sign, verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';
import { StoredPassword } from '../model/user.interface';
import { pbkdf2Sync } from 'crypto';
import { TOKEN_NA } from '../constants/token.constants';

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
  sign(user, JWT_SECRET, { expiresIn: '59m' });

export const verifyToken = (
  token: string
): { valid: boolean; customer?: string } => {
  if (token === TOKEN_NA) {
    return {
      valid: false,
    };
  }

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
