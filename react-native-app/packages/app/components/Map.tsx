import { Stack } from '@my/ui'
import React from 'react'
import MapView from 'react-native-maps'

export const Map = () => {
  return (
    <Stack flex={1}>
      <MapView style={{ width: '100%', height: '100%' }} />
    </Stack>
  )
}