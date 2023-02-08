import { ScreenWrapper, Map } from 'app/components'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import MapboxGL from '@rnmapbox/maps'

// This is the public token not the secret token (the secret token is used by the build in EAS)
MapboxGL.setAccessToken(
  'pk.eyJ1IjoiaG9vY2hhbmkiLCJhIjoiY2xkdW53MTJvMDdxbzNwbXZpYm9lMGZjciJ9.9CGrkAowMwBEiFcPabQ_kQ'
)

export const HomeScreen = () => {
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView style={styles.map} />
      </View>
    </View>
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
