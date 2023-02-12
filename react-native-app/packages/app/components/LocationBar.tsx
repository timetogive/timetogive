import { faLocationDot } from '@fortawesome/pro-light-svg-icons/faLocationDot'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { locationText } from 'app/lib'
import { SizableText, Stack, XStack } from '@my/ui'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export const LocationBar = () => {
  const insets = useSafeAreaInsets()
  const locText = locationText()
  return (
    <Stack
      backgroundColor="white"
      pt={insets.top + 5}
      pl={insets.left + 5}
      pr={insets.right + 5}
      pb={10}
      borderBottomWidth={0.5}
      borderColor="$gray4"
    >
      <XStack space={2} alignItems="center">
        <FontAwesomeIcon icon={faLocationDot} size={20} />
        <SizableText> {locText} </SizableText>
      </XStack>
    </Stack>
  )
}
