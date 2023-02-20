import { ReactNode } from 'react';
import { profileIsComplete } from '../lib/profileHelpers';
import { useSession } from '../providers/session';

interface Props {
  children: ReactNode;
}

export const ProfileIsComplete = ({
  children,
}: Props): JSX.Element | null => {
  const session = useSession();

  if (
    session.isReady &&
    session.user &&
    profileIsComplete(session.user)
  ) {
    return <>{children}</>;
  }

  return null;
};
