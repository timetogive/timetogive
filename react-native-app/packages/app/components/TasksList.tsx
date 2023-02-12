import { Stack, Text } from '@my/ui'
import { TaskCard } from './TaskCard'
import { FlatList } from 'react-native'
import { SearchTasksResult } from 'app/types'

const renderItem = ({ item }) => (
  <Stack pb={10}>
    <TaskCard title={item.title} description={item.description} reason={item.reason} />
  </Stack>
)

interface Props {
  tasks: SearchTasksResult
}

export const TasksList = ({ tasks }: Props) => {
  return (
    <Stack flex={1}>
      <FlatList data={tasks} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </Stack>
  )
}
