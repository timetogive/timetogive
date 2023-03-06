import { faStar } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button } from '@rneui/themed';
import { VStack, HStack, Stack } from 'react-native-flex-layout';
import { SvgUri } from 'react-native-svg';
import colors from '../styles/colors';
import { GetTaskOffersResult } from '../types';
import { Text } from '../components/Text';
import { AcceptDeclineButtons } from './AcceptDeclineButtons';

interface Props {
  offers?: GetTaskOffersResult | null;
  onAccept: (offerId: string) => void;
  onDecline: (offerId: string) => void;
}

export const TaskOffers = ({
  offers,
  onAccept,
  onDecline,
}: Props) => {
  if (!offers || offers.length === 0) {
    return null;
  }
  return (
    <>
      {offers && offers.length > 0 && (
        <VStack shouldWrapChildren bg={colors.white} mt={20}>
          <VStack ph={20} pv={10}>
            <Text
              size="sm"
              color={colors.gray[700]}
              weight="semi-bold"
            >
              Volunteers
            </Text>
          </VStack>
          <VStack spacing={10} shouldWrapChildren>
            {offers.map((o) => (
              <HStack
                justify="between"
                shouldWrapChildren
                items="center"
                ph={25}
                borderBottom={0.5}
                borderColor={colors.gray[200]}
                pv={10}
                key={o.id}
              >
                <HStack spacing={10}>
                  <Stack
                    center
                    h={36}
                    w={36}
                    bg={colors.blue[100]}
                    radius={18}
                    overflow="hidden"
                  >
                    <SvgUri
                      width="100%"
                      height="100%"
                      uri={o.avatar_url}
                    />
                  </Stack>
                  <VStack spacing={2} shouldWrapChildren>
                    <Text size="xxs" color={colors.gray[500]}>
                      {o.full_name}
                    </Text>
                    <HStack items="center" spacing={4}>
                      <FontAwesomeIcon
                        icon={faStar}
                        color={colors.yellow[400]}
                        size={15}
                      />
                      <Text size="xs" color={colors.gray[500]}>
                        5.0
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
                <AcceptDeclineButtons
                  onAccept={() => onAccept(o.id)}
                  onDecline={() => onDecline(o.id)}
                />
              </HStack>
            ))}
          </VStack>
        </VStack>
      )}
    </>
  );
};
