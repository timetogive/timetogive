import { ReactNode } from 'react';
import { missingProfileData } from '../lib/profileHelpers';
import { useSession } from '../providers/session';

interface Props {
  children: ReactNode;
}

export const ProfileNotComplete = ({ children }: Props) => {
  const session = useSession();

  if (
    session.isReady &&
    (!session.user || missingProfileData(session.user))
  ) {
    return <>{children}</>;
  }

  return <></>;
};
