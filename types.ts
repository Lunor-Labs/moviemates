
export enum GuestStatus {
  CONFIRMED = 'confirmed',
  PENDING = 'pending'
}

export interface Guest {
  id: string;
  name: string;
  specialty: string;
  discipline: string;
  status: GuestStatus;
  avatar: string;
  locked?: boolean; // True if status has been confirmed and cannot be changed
}

export interface AttendanceStats {
  confirmed: number;
  pending: number;
}
