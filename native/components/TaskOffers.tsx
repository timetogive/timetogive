import { faStar } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button } from '@rneui/themed';
import { VStack, HStack, Stack } from 'react-native-flex-layout';
import { SvgUri } from 'react-native-svg';
import colors from '../styles/colors';
import { GetTaskOffersResult, TaskOfferStatus } from '../types';
import { Text } from '../components/Text';
import { AcceptDeclineButtons } from './AcceptDeclineButtons';
import { faChevronRight } from '@fortawesome/sharp-solid-svg-icons';
import { TouchableOpacity } from 'react-native';
import { Chip } from './Chip';
import { MiniProfile } from './MiniProfile';

interface Props {
  offers?: GetTaskOffersResult | null;
  onOfferPressed: (
    offerId: string,
    offerStatus: TaskOfferStatus,
    userId: string,
    fullName: string
  ) => void;
}

export const TaskOffers = ({ offers, onOfferPressed }: Props) => {
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
              <TouchableOpacity
                onPress={() =>
                  onOfferPressed(
                    o.id,
                    o.status,
                    o.user_id,
                    o.full_name
                  )
                }
                key={`${o.id}`}
              >
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
                  <MiniProfile
                    avatarUrl={o.avatar_url}
                    fullName={o.full_name}
                  />
                  <HStack
                    items="center"
                    spacing={5}
                    shouldWrapChildren
                  >
                    {o.status === 'Pending' && (
                      <Chip
                        textSize="xxs"
                        backgroundColor={colors.orange[500]}
                      >
                        New!
                      </Chip>
                    )}
                    {o.status === 'Accepted' && (
                      <Chip
                        textSize="xxs"
                        backgroundColor={colors.green[500]}
                      >
                        Accepted
                      </Chip>
                    )}
                    {o.status === 'Declined' && (
                      <Chip
                        textSize="xxs"
                        backgroundColor={colors.gray[500]}
                      >
                        Declined
                      </Chip>
                    )}
                    {o.status === 'Cancelled' && (
                      <Chip
                        textSize="xxs"
                        backgroundColor={colors.gray[500]}
                      >
                        Cancelled
                      </Chip>
                    )}
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      size={15}
                      color={colors.gray[500]}
                    />
                  </HStack>
                </HStack>
              </TouchableOpacity>
            ))}
          </VStack>
        </VStack>
      )}
    </>
  );
};
