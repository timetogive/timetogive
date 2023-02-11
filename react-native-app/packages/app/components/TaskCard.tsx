import { Card, YStack, Stack, Heading, Text, XStack, Paragraph, SizableText } from '@my/ui'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHouseHeart } from '@fortawesome/pro-solid-svg-icons/faHouseHeart'
import { faPeopleGroup } from '@fortawesome/pro-solid-svg-icons/faPeopleGroup'
import { faHandHeart } from '@fortawesome/pro-solid-svg-icons/faHandHeart'
import { faHandshake } from '@fortawesome/pro-solid-svg-icons/faHandshake'
import { faHandHoldingDollar } from '@fortawesome/pro-solid-svg-icons/faHandHoldingDollar'

import { TaskReason } from 'app/types'

interface TaskIconProps {
  reason: string
}

const TaskIcon = ({ reason }: TaskIconProps) => {
  switch (reason) {
    case 'Charity':
      return <FontAwesomeIcon icon={faHouseHeart} size={30} />
    case 'Community':
      return <FontAwesomeIcon icon={faPeopleGroup} size={30} />
    case 'In Need':
      return <FontAwesomeIcon icon={faHandHeart} size={30} />
    case 'Mutual Benefit':
      return <FontAwesomeIcon icon={faHandshake} size={30} />
    case 'Return For Pledge':
      return <FontAwesomeIcon icon={faHandHoldingDollar} size={30} />
    default:
      return <FontAwesomeIcon icon={faHandHeart} size={30} />
  }
}
interface Props {
  title: string
  description: string
  reason: string
}

export const TaskCard = ({ title, description, reason }: Props) => {
  return (
    <XStack
      borderRadius={5}
      elevation={3}
      shadowColor="gray"
      shadowOpacity={0.2}
      shadowRadius={8}
      backgroundColor="white"
      overflow="hidden"
      h={100}
    >
      <YStack w={100} maw={100} alignItems="center" jc="center" p={0} m={0} shadowRadius={0}>
        <TaskIcon reason={reason} />
      </YStack>
      <YStack space={5} flex={1} pl={5} pr={10} py={10} overflow="hidden">
        <SizableText fontSize="$4" fontWeight="$6" numberOfLines={2}>
          {title}
        </SizableText>
      </YStack>
    </XStack>
  )
}
