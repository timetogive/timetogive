import { Profile } from '../types/nicerSupabaseTypes';

export const profileIsComplete = (profile: Profile) => {
  if (profile.avatar_url) {
    return true;
  }
  return false;
};
