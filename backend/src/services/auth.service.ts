import { auth } from '../firebase';
import { UserModel } from '../models/User';
import { User, Role } from '../types';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';

export class AuthService {
  static async registerUser(data: { email: string; password?: string; name: string; role?: Role }): Promise<{ token: string; user: Omit<User, 'password'> }> {
    // 1. Create user in Firebase Auth (mock in dev)
    const userRecord = await auth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
    });

    // 2. Save user profile (UserModel.create hashes the password)
    const role = data.role || Role.CITIZEN;
    const userData: Partial<User> = {
      name: data.name,
      email: data.email.toLowerCase(),
      role: role,
      password: data.password, // Will be hashed by UserModel.create
    };
    
    await UserModel.create(userRecord.uid, userData);

    // 3. Generate JWT
    const token = this.generateToken(userRecord.uid, role);
    const { password: _pw, ...safeUser } = userData as any;

    return {
      token,
      user: { id: userRecord.uid, ...safeUser } as Omit<User, 'password'>,
    };
  }

  static async verifyPassword(plain: string, hashed: string): Promise<boolean> {
    if (!hashed) return false;
    // Support both bcrypt hashes and plain-text mock passwords
    if (hashed.startsWith('$2')) {
      return bcrypt.compare(plain, hashed);
    }
    return plain === hashed;
  }

  static async loginUser(uid: string): Promise<{ token: string; user: Omit<User, 'password'> }> {
    const user = await UserModel.findById(uid);
    if (!user) throw new Error('User not found');

    const token = this.generateToken(uid, user.role as Role);
    const { password: _pw, ...safeUser } = user as any;
    return { token, user: safeUser };
  }

  static generateToken(userId: string, role: Role): string {
    return jwt.sign({ id: userId, role }, env.JWT_SECRET, {
      expiresIn: '7d',
    });
  }
}
