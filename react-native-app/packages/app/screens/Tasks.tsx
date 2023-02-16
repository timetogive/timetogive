import { Circle, Text, Stack, useSelectContext } from '@my/ui'
import { TouchableOpacity } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faLocationDot } from '@fortawesome/pro-light-svg-icons/faLocationDot'
import { faList } from '@fortawesome/pro-light-svg-icons/faList'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TasksList } from 'app/components'
import { TasksMap } from 'app/components'
import { useEffect, useState } from 'react'
import { supabase } from 'app/lib/supabase'
import { useInfiniteQuery } from 'react-query'
import * as Location from 'expo-location'
import { defaultLongLat, LongLat, useSelectedLocation } from 'app/providers/selectedLocation'

const RESULTS_PER_PAGE = 500

export const supabaseCall = (
  pageParam: number,
  longitude: number,
  latitude: number,
  distance: number // distance in m
) => {
  const startRange = pageParam * RESULTS_PER_PAGE
  const endRange = startRange + (RESULTS_PER_PAGE - 1)

  const query = supabase
    .rpc(
      'search_tasks',
      { p_longitude: longitude, p_latitude: latitude, p_distance: distance },
      { count: 'exact' }
    )
    .select('*')
    .range(startRange, endRange)

  return query
}

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
        shadowColor="$shadowColor"
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
  const [mapOrList, setMapOrList] = useState<MapOrListEnum>(MapOrListEnum.List)
  const [longLat, setLongLat] = useState<LongLat>(defaultLongLat)
  const location = useSelectedLocation()

  const SearchTasksQuery = useInfiniteQuery(
    ['SearchTasks'],
    async ({ pageParam = 0 }) => {
      const ll = await location.getLongLat()
      console.log('In Tasks calling getLongLat')
      setLongLat(ll)
      console.log(ll)
      const query = supabaseCall(
        pageParam,
        ll.longitude,
        ll.latitude,
        location.selectedLocation.distance
      )
      const { data, count } = await query

      return {
        data: data || [],
        count: count || 0,
        currentPage: pageParam,
      }
    },
    {
      refetchOnMount: false,
      getNextPageParam(result) {
        return result.currentPage + 1
      },
    }
  )

  useEffect(() => {
    console.log('In Tasks, selected location has changed')
    SearchTasksQuery.refetch()
  }, [location.selectedLocation])

  const tasks = SearchTasksQuery.data?.pages.flatMap(({ data }) => data) || []

  if (SearchTasksQuery.isLoading || SearchTasksQuery.isIdle) {
    return <Text>Loading...</Text>
  }

  return (
    <>
      {mapOrList === MapOrListEnum.List ? (
        <TasksList tasks={tasks} />
      ) : (
        <TasksMap tasks={tasks} longLat={longLat} distance={location.selectedLocation.distance} />
      )}
      <Stack position="absolute" top={10} right={10}>
        <MapOrListToggleButton mapOrList={mapOrList} onChange={setMapOrList} />
      </Stack>
    </>
  )
}
