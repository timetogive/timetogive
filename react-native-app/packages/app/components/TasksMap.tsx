import { Stack, Text } from '@my/ui'
import { TaskCard } from './TaskCard'
import { FlatList } from 'react-native'
import { SearchTasksResult } from 'app/types'
import MapView, { PROVIDER_GOOGLE, Region, Marker, LatLng } from 'react-native-maps'
import { useEffect, useState } from 'react'
import { LongLat } from 'app/providers/selectedLocation'

interface Props {
  tasks: SearchTasksResult
  longLat: LongLat
  distance: number
}

const MapMarker = ({ longitude, latitude }: { longitude: number; latitude: number }) => {
  const googleLatLng: LatLng = { latitude: latitude, longitude: longitude }
  return <Marker coordinate={googleLatLng} title={'Hey'} description={'Stuff here'} />
}

export const TasksMap = ({ tasks, longLat, distance }: Props) => {
  console.log(`TasksMap | Longitude : ${longLat.longitude} | Latitude : ${longLat.latitude} `)

  // Map state
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: longLat.latitude,
    longitude: longLat.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  useEffect(() => {
    ;(async () => {
      console.log('longLat has changed!!!')
      setMapRegion({
        latitude: longLat.latitude,
        longitude: longLat.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
    })()
  }, [longLat])

  return (
    <Stack flex={1}>
      <MapView provider={PROVIDER_GOOGLE} style={{ flex: 1 }} region={mapRegion}>
        {tasks.map((task) => (
          <MapMarker key={task.id} longitude={task.longitude} latitude={task.latitude} />
        ))}
      </MapView>
    </Stack>
  )
}
