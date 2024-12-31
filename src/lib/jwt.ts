import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRATION = '24h'; // 24 Stunden

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRATION,
      algorithm: 'HS256'
    });
  } catch (error) {
    console.error('Token generation failed:', error);
    throw new Error('Token konnte nicht erstellt werden');
  }
};

export const verifyToken = (token: string): TokenPayload | null => {
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Validiere die Token-Struktur
    if (!decoded || 
        typeof decoded !== 'object' ||
        typeof decoded.userId !== 'string' ||
        typeof decoded.email !== 'string' ||
        typeof decoded.role !== 'string') {
      return null;
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  if (!token) {
    return true;
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return false;
  } catch (error) {
    return true;
  }
};
