import { Stack } from '@my/ui'
import React, { useRef } from 'react'
import { StyleSheet } from 'react-native'

import MapboxGL from '@rnmapbox/maps'

const mapBoxAccessToken =
  'pk.eyJ1IjoiamFtZXNhbGxjaGludHJpcGFicm9vZCIsImEiOiJjbDcxbHpsNHUwMzRqM25tdHk4MnlzZDgwIn0.0UEz7LsxsvNoeSKQuDyJNg'

export const Map = () => {
  return (
    <Stack flex={1}>
      <MapboxGL.MapView style={styles.map} />
    </Stack>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: 300,
    width: 300,
  },
  map: {
    flex: 1,
  },
})
