export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type CitizenStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface Citizen {
  id: number;
  citizenId: string;
  userId: number;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  wardNumber: string;
  city: string;
  state: string;
  postalCode: string;
  status: CitizenStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCitizenRequest {
  userId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  wardNumber: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface UpdateCitizenRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  wardNumber: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface CitizenStats {
  totalCitizens: number;
  activeCitizens: number;
  inactiveCitizens: number;
  wardDistribution: Record<string, number>;
}
