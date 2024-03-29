import Animated, {
  FadeOut,
  SlideInRight,
  SlideOutRight,
} from 'react-native-reanimated';
import { MissingAvatar } from '../components/MissingAvatar';
import { MissingBio } from '../components/MissingBio';
import { MissingHomeArea } from '../components/MissingHomeArea';
import { MissingName } from '../components/MissingName';
import { Text } from '../components/Text';
import { missingProfileData } from '../lib/profileHelpers';
import { useSession } from '../providers/session';

interface SlideInWrapperProps {
  children: React.ReactNode;
}

const SlideInWrapper = ({ children }: SlideInWrapperProps) => {
  return (
    <Animated.View
      style={{
        flex: 1,
      }}
      entering={SlideInRight.duration(500)}
      exiting={FadeOut.duration(500)}
    >
      {children}
    </Animated.View>
  );
};

export const MissingProfile = () => {
  const session = useSession();

  const missing = missingProfileData(session.user);

  return (
    <>
      {missing === 'name' && (
        <SlideInWrapper>
          <MissingName />
        </SlideInWrapper>
      )}
      {missing === 'bio' && (
        <SlideInWrapper>
          <MissingBio />
        </SlideInWrapper>
      )}
      {missing === 'avatar' && (
        <SlideInWrapper>
          <MissingAvatar />
        </SlideInWrapper>
      )}
      {missing === 'home' && (
        <SlideInWrapper>
          <MissingHomeArea />
        </SlideInWrapper>
      )}
    </>
  );
};
