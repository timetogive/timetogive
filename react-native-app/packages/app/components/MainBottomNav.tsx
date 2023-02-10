import { Button, Stack, YStack, XStack, Text, StackPropsBase, ZStack, Circle, Card } from '@my/ui'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHeartCircleCheck } from '@fortawesome/pro-light-svg-icons/faHeartCircleCheck'
import { faMessageQuestion } from '@fortawesome/pro-light-svg-icons/faMessageQuestion'
import { faCirclePlus } from '@fortawesome/pro-solid-svg-icons/faCirclePlus'

export const MainBottomNav = () => {
  return (
    <Card
      position="absolute"
      backgroundColor="white"
      bottom={0}
      left={0}
      right={0}
      borderWidth={0}
      shadowColor="gray"
      shadowOffset={{ width: 0, height: -4 }}
      shadowOpacity={0.2}
      shadowRadius={2}
      borderRadius={0}
      overflow="visible"
    >
      <XStack
        f={1}
        ai="center"
        jc="space-evenly"
        pt={10}
        pb={20}
        overflow="visible"
        position="relative"
      >
        <YStack alignItems="center" space={3}>
          <FontAwesomeIcon icon={faHeartCircleCheck} size={25} />
          <Text>Tasks</Text>
        </YStack>
        <Stack
          shadowColor="black"
          shadowOffset={{ width: 0, height: 3 }}
          shadowOpacity={0.6}
          shadowRadius={2}
        >
          <Circle
            borderWidth={4}
            p={6}
            backgroundColor="white"
            alignItems="center"
            space={3}
            mt={-20}
          >
            <FontAwesomeIcon icon={faCirclePlus} size={50} />
          </Circle>
        </Stack>
        <YStack alignItems="center" space={3}>
          <FontAwesomeIcon icon={faMessageQuestion} size={25} />
          <Text>Advice</Text>
        </YStack>
      </XStack>
    </Card>
  )
}
