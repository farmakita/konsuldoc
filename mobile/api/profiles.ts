import { api } from './client';
import { ProfileInput } from '../../shared/schemas/order';
import { Profile } from '../../shared/types';

export async function saveProfile(input: ProfileInput): Promise<Profile> {
  return api.post<Profile>('/api/profiles', input);
}

export async function loadProfile(deviceId: string): Promise<Profile | null> {
  try {
    return await api.get<Profile>(`/api/profiles/${deviceId}`);
  } catch {
    return null;
  }
}
