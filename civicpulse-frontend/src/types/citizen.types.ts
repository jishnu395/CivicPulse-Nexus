export interface Citizen {
  id?: number | string;
  citizenId?: string;
  userId: number | string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  wardNumber: string | number;
  city: string;
  state: string;
  postalCode: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCitizenRequest {
  userId: number | string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  wardNumber: string | number;
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
