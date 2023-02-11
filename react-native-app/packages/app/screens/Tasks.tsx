import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Circle, SizableText, Stack } from '@my/ui'
import { TouchableOpacity } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faLocationDot } from '@fortawesome/pro-light-svg-icons/faLocationDot'
import { faList } from '@fortawesome/pro-light-svg-icons/faList'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TasksList } from 'app/components'
import { TasksMap } from 'app/components'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useState } from 'react'

enum MapOrListEnum {
  Map,
  List,
}

interface MapOrListToggleButtonProps {
  mapOrList: MapOrListEnum
  onChange: (mapOrList: MapOrListEnum) => void
}

const MapOrListToggleButton = ({ mapOrList, onChange }: MapOrListToggleButtonProps) => {
  return (
    <TouchableOpacity
      onPress={() =>
        onChange(mapOrList === MapOrListEnum.List ? MapOrListEnum.Map : MapOrListEnum.List)
      }
    >
      <Circle
        borderColor="black"
        borderWidth={2}
        backgroundColor="white"
        shadowColor="black"
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.6}
        shadowRadius={2}
        alignItems="center"
        size={40}
        p={6}
      >
        <FontAwesomeIcon
          icon={mapOrList === MapOrListEnum.List ? faLocationDot : faList}
          size={mapOrList === MapOrListEnum.List ? 30 : 23}
        />
      </Circle>
    </TouchableOpacity>
  )
}

export const Tasks = () => {
  const insets = useSafeAreaInsets()

  const [mapOrList, setMapOrList] = useState<MapOrListEnum>(MapOrListEnum.List)

  return (
    <>
      {mapOrList === MapOrListEnum.Map ? <TasksList /> : <TasksMap />}
      <Stack position="absolute" top={insets.top + 5} right={insets.right + 10}>
        <MapOrListToggleButton mapOrList={mapOrList} onChange={setMapOrList} />
      </Stack>
    </>
  )
}
