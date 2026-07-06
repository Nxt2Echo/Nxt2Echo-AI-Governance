export enum Role {
  CITIZEN = 'CITIZEN',
  OFFICER = 'OFFICER',
  ADMIN = 'Admin',
}

export enum Category {
  WATER_SUPPLY = 'Water Supply',
  GARBAGE = 'Garbage',
  ROAD_DAMAGE = 'Road Damage',
  STREET_LIGHTS = 'Street Lights',
  DRAINAGE = 'Drainage',
  AIR_POLLUTION = 'Air Pollution',
  FLOOD = 'Flood',
  OTHERS = 'Others',
}

export enum Status {
  PENDING = 'Pending',
  ASSIGNED = 'Assigned',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  REJECTED = 'Rejected',
}

export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string; // Hashed password
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Complaint {
  id?: string;
  userId: string;
  title: string;
  description: string;
  category: Category;
  severity: string; // e.g., Low, Medium, High
  priorityScore: number;
  language?: string;
  translatedDescription?: string;
  sentiment?: string;
  isDuplicate?: boolean;
  latitude: number;
  longitude: number;
  ward: string;
  address: string;
  status: Status;
  imageUrl?: string;
  voiceUrl?: string;
  createdAt: string;
  updatedAt: string;
}
