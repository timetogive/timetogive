import { ReactNode } from 'react';
import { useSession } from '../providers/session';

interface Props {
  children: ReactNode;
}

export const SignedOut = ({ children }: Props) => {
  const session = useSession();

  if (session.isReady && !session.user) {
    return <>{children}</>;
  }

  return <></>;
};
