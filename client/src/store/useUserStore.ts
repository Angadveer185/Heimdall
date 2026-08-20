import { create } from 'zustand';

export interface ShelterData {
  id: string;
  name: string;
  country: string;
  organizationIdType: string;
  organizationId: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  rejectionReason?: string | null;
  description?: string | null;
  street: string;
  city: string;
  state: string;
  zip: string;
  dropOffHours: string;
  contactEmail: string;
  phone?: string | null;
  website?: string | null;
  profileImageUrl?: string | null;
  shelterImages?: string[];
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  profileImageUrl?: string | null;
  role: 'DONOR' | 'SHELTER_ADMIN' | 'SUPER_ADMIN';
  shelterId?: string | null;
  shelter?: ShelterData | null;
  isReported: boolean;
  pledgesCompleted: number;
  pledgesExpired: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface UserState {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
