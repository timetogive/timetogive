import { Stack, Text } from '@my/ui'
import { TaskCard } from './TaskCard'
import { FlatList } from 'react-native'
import { SearchTasksResult } from 'app/types'
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { useState } from 'react'
import { LongLat } from 'app/providers/selectedLocation'

interface Props {
  tasks: SearchTasksResult
  longLat: LongLat
  distance: number
}

export const TasksMap = ({ tasks, longLat, distance }: Props) => {
  console.log(`TasksMap | Longitude : ${longLat.longitude} | Latitude : ${longLat.latitude} `)

  // initially focus the center on the best match
  const initialLat = longLat.latitude
  const initialLng = longLat.longitude

  // Map state
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: initialLat,
    longitude: initialLng,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  return (
    <Stack flex={1}>
      <MapView provider={PROVIDER_GOOGLE} style={{ flex: 1 }} region={mapRegion} />
    </Stack>
  )
}
