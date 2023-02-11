import { useInfiniteQuery } from 'react-query'
import { supabase } from 'app/lib/supabase'
import { Stack, Text } from '@my/ui'
import { TaskCard } from './TaskCard'
import { FlatList } from 'react-native'

const RESULTS_PER_PAGE = 500

export const supabaseCall = (pageParam: number) => {
  const startRange = pageParam * RESULTS_PER_PAGE
  const endRange = startRange + (RESULTS_PER_PAGE - 1)

  const query = supabase
    .rpc('search_tasks', {}, { count: 'exact' })
    .select('*')
    .range(startRange, endRange)

  return query
}

const renderItem = ({ item }) => (
  <Stack pb={10}>
    <TaskCard title={item.title} description={item.description} reason={item.reason} />
  </Stack>
)

export const TasksList = () => {
  const TasksListQuery = useInfiniteQuery(
    ['TasksList'],
    async ({ pageParam = 0 }) => {
      const query = supabaseCall(pageParam)
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

  const data = TasksListQuery.data?.pages.flatMap(({ data }) => data)

  if (TasksListQuery.isLoading || TasksListQuery.isIdle) {
    return <Text>Loading...</Text>
  }

  const duplicatedData = data ? [...Array(60)].map((_, i) => ({ ...data[0], id: i })) : []

  return (
    <Stack flex={1}>
      <FlatList data={duplicatedData} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </Stack>
  )
}
