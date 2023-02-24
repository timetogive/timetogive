import { Text } from '../components/Text';
import { useSession } from '../providers/session';
import { Profile } from '../types';
import { MissingAvatar } from './MissingAvatar';
import { MissingBio } from './MissingBio';
import { MissingName } from './MissingName';

const missingStuff = (profile?: Profile | null) => {
  if (!profile?.full_name) {
    return 'name';
  }
  if (!profile?.description) {
    return 'bio';
  }
  if (!profile?.avatar_url) {
    return 'avatar';
  }
  return undefined;
};

export const MissingProfile = () => {
  const session = useSession();

  const missing = missingStuff(session.user);

  switch (missing) {
    case 'name':
      return <MissingName />;
    case 'bio':
      return <MissingBio />;
    case 'avatar':
      return <MissingAvatar />;
    default:
      return <Text>Nothing missing</Text>;
  }
};
