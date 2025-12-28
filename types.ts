
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
}

export interface AttendanceStats {
  confirmed: number;
  pending: number;
}
