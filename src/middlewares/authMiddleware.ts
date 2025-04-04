import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
  const JWT_ISSUER = process.env.JWT_ISSUER!;
  const JWT_AUDIENCE = process.env.JWT_AUDIENCE!;

  if (!JWT_SECRET_KEY || !JWT_ISSUER || !JWT_AUDIENCE) {
    console.error('❌ Missing JWT configuration. Please check your .env file.');
    process.exit(1);
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Missing Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE
    });

    (req as any).user = decoded;

    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
}
