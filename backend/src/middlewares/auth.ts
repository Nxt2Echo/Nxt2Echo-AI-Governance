import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '../types';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
}

import { auth } from '../firebase';
import { UserModel } from '../models/User';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      // Verify as Firebase ID Token
      const decodedToken = await auth.verifyIdToken(token);
      let user = await UserModel.findById(decodedToken.uid);
      if (!user) {
        // Auto-create user if they logged in via Google Auth but don't exist in Firestore
        await UserModel.create(decodedToken.uid, {
          email: decodedToken.email || '',
          name: decodedToken.name || 'Citizen',
          role: Role.CITIZEN
        });
        user = await UserModel.findById(decodedToken.uid);
      }
      
      if (!user) {
         return res.status(401).json({ error: 'Failed to auto-create user in database' });
      }

      req.user = { id: decodedToken.uid, role: user.role };
      return next();
    } catch (fbError: any) {
      try {
        // Fallback to custom JWT token
        const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; role: Role };
        req.user = decoded;
        return next();
      } catch (jwtError) {
        return res.status(401).json({ error: `Auth Error - FB: ${fbError.message}, JWT: Invalid` });
      }
    }
  } catch (error: any) {
    return res.status(401).json({ error: error.message || 'Invalid or expired token' });
  }
};

export const authorize = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};
