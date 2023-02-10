import { MainBottomNav, Map, ScreenWrapper, SearchTasks } from 'app/components'
import { Stack } from '@my/ui'
import React from 'react'
import { StyleSheet } from 'react-native'

export const MainScreen = () => {
  return (
    <Stack flex={1}>
      <SearchTasks />
      <MainBottomNav />
    </Stack>
  )
}
