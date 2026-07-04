import { db } from '../firebase';
import { User } from '../types';
import bcrypt from 'bcryptjs';

export const UserCollection = db.collection('users');

export const UserModel = {
  async create(userId: string, data: Partial<User>): Promise<void> {
    const now = new Date().toISOString();
    // Hash password before storing if provided
    let storedData: any = { ...data, createdAt: now, updatedAt: now };
    if (storedData.password) {
      storedData.password = await bcrypt.hash(storedData.password, 10);
    }
    await UserCollection.doc(userId).set(storedData);
  },

  async findById(userId: string): Promise<User | null> {
    const doc = await UserCollection.doc(userId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as User;
  },

  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await UserCollection.where('email', '==', email.toLowerCase()).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  },

  async update(userId: string, data: Partial<User>): Promise<void> {
    await UserCollection.doc(userId).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  async updatePassword(email: string, newPassword: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) throw new Error('User not found');
    const hashed = await bcrypt.hash(newPassword, 10);
    await UserCollection.doc(user.id).update({
      password: hashed,
      updatedAt: new Date().toISOString(),
    });
  },
};

