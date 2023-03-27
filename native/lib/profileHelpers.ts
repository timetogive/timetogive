import { Profile } from '../types/nicerSupabaseTypes';

export const missingProfileData = (profile?: Profile | null) => {
  if (!profile?.full_name) {
    return 'name';
  }
  if (!profile?.description) {
    return 'bio';
  }
  if (!profile?.avatar_url) {
    return 'avatar';
  }
  if (!profile?.home_polygon) {
    return 'home';
  }
  return undefined;
};
