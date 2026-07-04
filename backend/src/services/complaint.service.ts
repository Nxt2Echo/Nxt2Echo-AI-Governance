import { ComplaintModel } from '../models/Complaint';
import { Complaint, Status } from '../types';

export class ComplaintService {
  static async createComplaint(data: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Complaint> {
    // We could add business logic here (e.g. AI analysis trigger)
    return await ComplaintModel.create(data);
  }

  static async checkForDuplicate(latitude: number, longitude: number, category: string): Promise<boolean> {
    const activeComplaints = await ComplaintModel.findAll({ category });
    const thresholdMeters = 100; // 100 meters

    for (const c of activeComplaints) {
      if (c.status === Status.RESOLVED || c.status === Status.REJECTED) continue;
      
      const distance = this.calculateDistance(latitude, longitude, c.latitude, c.longitude);
      if (distance <= thresholdMeters) {
        return true;
      }
    }
    return false;
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // metres
    const p1 = lat1 * Math.PI / 180;
    const p2 = lat2 * Math.PI / 180;
    const dp = (lat2 - lat1) * Math.PI / 180;
    const dl = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
              Math.cos(p1) * Math.cos(p2) *
              Math.sin(dl / 2) * Math.sin(dl / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
  }

  static async getDashboardStats() {
    const complaints = await ComplaintModel.findAll();
    
    const stats = {
      total: complaints.length,
      byStatus: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byWard: {} as Record<string, number>,
    };

    complaints.forEach(c => {
      stats.byStatus[c.status] = (stats.byStatus[c.status] || 0) + 1;
      stats.byCategory[c.category] = (stats.byCategory[c.category] || 0) + 1;
      const wardKey = c.ward || 'Unknown';
      stats.byWard[wardKey] = (stats.byWard[wardKey] || 0) + 1;
    });

    return stats;
  }

  static async getComplaints(filters?: Record<string, any>): Promise<Complaint[]> {
    return await ComplaintModel.findAll(filters);
  }

  static async getComplaintById(id: string): Promise<Complaint | null> {
    return await ComplaintModel.findById(id);
  }

  static async updateComplaintStatus(id: string, status: Status): Promise<Complaint | null> {
    return await ComplaintModel.update(id, { status });
  }

  static async updateComplaint(id: string, data: Partial<Complaint>): Promise<Complaint | null> {
    return await ComplaintModel.update(id, data);
  }

  static async deleteComplaint(id: string): Promise<boolean> {
    const complaint = await ComplaintModel.findById(id);
    if (!complaint) return false;

    const ONE_HOUR = 60 * 60 * 1000;
    const createdAtTime = new Date(complaint.createdAt).getTime();
    if (Date.now() - createdAtTime < ONE_HOUR) {
      throw new Error('Cannot delete a new complaint. All new complaints must be stored for at least 1 hour.');
    }

    return await ComplaintModel.delete(id);
  }
}
