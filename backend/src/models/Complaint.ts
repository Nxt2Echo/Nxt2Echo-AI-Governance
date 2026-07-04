import { db } from '../firebase';
import { Complaint, Status } from '../types';

export const ComplaintCollection = db.collection('complaints');

export const ComplaintModel = {
  async create(data: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Complaint> {
    const now = new Date().toISOString();
    const newComplaint = {
      ...data,
      status: Status.PENDING,
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await ComplaintCollection.add(newComplaint);
    return { id: docRef.id, ...newComplaint } as Complaint;
  },

  async findById(id: string): Promise<Complaint | null> {
    const doc = await ComplaintCollection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Complaint;
  },

  async findAll(filters?: Record<string, any>): Promise<Complaint[]> {
    let query: FirebaseFirestore.Query = ComplaintCollection;
    
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined) {
          query = query.where(key, '==', value);
        }
      }
    }
    
    // Do not use .orderBy() in the DB query if we have filters, 
    // as it requires composite indexes for every filter combination.
    // We will sort the results in memory instead.
    const snapshot = await query.get();
    const complaints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint));
    
    // Sort in memory by createdAt descending
    return complaints.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  },

  async update(id: string, data: Partial<Complaint>): Promise<Complaint | null> {
    const docRef = ComplaintCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await docRef.update(updateData);
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() } as Complaint;
  },

  async delete(id: string): Promise<boolean> {
    const docRef = ComplaintCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return false;
    
    await docRef.delete();
    return true;
  },
};
