export interface User {
  id: string;
  fullName: string;
  callsign: string;
  email: string;
  phone: string;
  address: string;
  licenseClass: string;
  groupId: string;
  roles: Role[];
  approved: boolean;
  createdAt: number;
  lastActive: number;
}

export type Role = 'EC' | 'AEC' | 'Admin' | 'PIO' | 'Member';

export interface AlertAcknowledgment {
  userId: string;
  userName: string;
  userCallsign: string;
  timestamp: number;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  level: 'INFO' | 'DRILL' | 'STANDBY' | 'ACTIVATION';
  groupId: string;
  createdAt: number;
  createdBy: string;
  acknowledgments?: AlertAcknowledgment[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: number;
  endDate: number;
  groupId: string;
  createdBy: string;
  attendees: string[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  county: string;
  state: string;
  ecId: string;
  activationLevel: 'INFO' | 'DRILL' | 'STANDBY' | 'ACTIVATION';
  createdAt: number;
}

export interface Frequency {
  id: string;
  name: string;
  frequency: string;
  mode: string;
  tone: string;
  notes: string;
  groupId: string;
  isPrimary: boolean;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: number;
  groupId: string;
  category: string;
}