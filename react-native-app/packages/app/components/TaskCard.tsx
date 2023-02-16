import { Card, YStack, Stack, Heading, Text, XStack, Paragraph, SizableText } from '@my/ui'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHouseHeart } from '@fortawesome/pro-solid-svg-icons/faHouseHeart'
import { faPeopleGroup } from '@fortawesome/pro-solid-svg-icons/faPeopleGroup'
import { faHandWave } from '@fortawesome/pro-light-svg-icons/faHandWave'
import { faHandshake } from '@fortawesome/pro-solid-svg-icons/faHandshake'
import { faHandHoldingDollar } from '@fortawesome/pro-solid-svg-icons/faHandHoldingDollar'

import { TaskReason } from 'app/types'

interface TaskIconProps {
  reason: string
}

const getIcon = ({ reason }: TaskIconProps) => {
  switch (reason) {
    case 'Charity':
      return faHouseHeart
    case 'Community':
      return faPeopleGroup
    case 'In Need':
      return faHandWave
    case 'Mutual Benefit':
      return faHandshake
    case 'Return For Pledge':
      return faHandHoldingDollar
    default:
      return faHandWave
  }
}

const TaskIcon = ({ reason }: TaskIconProps) => {
  const icon = getIcon({ reason })
  return <FontAwesomeIcon icon={icon} size={30} />
}
interface Props {
  title: string
  description: string
  reason: string
}

export const TaskCard = ({ title, description, reason }: Props) => {
  return (
    <Stack
      borderRadius="$5"
      backgroundColor="white"
      borderColor="$gray6"
      shadowColor="$shadowColor"
      p="$5"
    >
      <XStack justifyContent="space-between">
        <YStack flex={1}>
          <SizableText color="black" fontWeight="$6" fontSize="$5">
            {title}
          </SizableText>
          <SizableText color="black" fontWeight="$5" fontSize="$4">
            5km
          </SizableText>
        </YStack>
        <TaskIcon reason={reason} />
      </XStack>
      <Stack alignItems="flex-end">
        <SizableText color="black" fontWeight="$6" fontSize="$5">
          Hello
        </SizableText>
      </Stack>
    </Stack>
  )
}
