import { Card, YStack, Stack, Heading, Text, XStack, Paragraph, SizableText } from '@my/ui'

interface Props {
  title: string
  description: string
}

export const TaskCard = ({ title, description }: Props) => {
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
        <Stack h={60} w={60} backgroundColor="black" p={0} m={0}></Stack>
      </YStack>
      <YStack space={5} flex={1} pl={5} pr={10} py={10} overflow="hidden">
        <SizableText fontWeight="$7" numberOfLines={2}>
          {title}
        </SizableText>
        <Text fontWeight="light" numberOfLines={2}>
          {description}
        </Text>
      </YStack>
    </XStack>
  )
}
