import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Box } from 'react-native-flex-layout';
import { effortText } from '../lib/tasksHelpers';
import colors from '../styles/colors';
import { SearchTasksResult } from '../types';
import { InfoPink } from './InfoPink';
import { TaskCardWithDistanceBar } from './TaskCardWithDistanceBar';

interface TasksListProps {
  tasks: SearchTasksResult;
  searching: boolean;
  onTaskPressed: (taskId: string) => void;
  onRefresh?: () => void;
}

// Tasks list component

export const TasksList = ({
  tasks,
  searching,
  onRefresh,
  onTaskPressed,
}: TasksListProps) => {
  if (tasks.length === 0) {
    return (
      <Box p={20}>
        <InfoPink message="No tasks found. Use the map view to widen your search area or create a new task to get things going." />
      </Box>
    );
  }
  return (
    <FlatList
      data={tasks}
      renderItem={(task) => (
        <TaskCardWithDistanceBar
          key={task.item.id}
          taskId={task.item.id}
          taskUserId={task.item.user_id}
          taskUserFullName={task.item.full_name}
          taskUserAvatarUrl={task.item.avatar_url}
          title={task.item.title}
          reason={task.item.reason}
          timing={task.item.timing}
          duration={effortText(
            task.item.effort_days,
            task.item.effort_hours,
            task.item.effort_minutes
          )}
          distance={task.item.distance}
          onPress={() => onTaskPressed(task.item.id)}
        />
      )}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={searching}
          onRefresh={onRefresh}
          title="Pull to refresh"
        />
      }
      style={{
        backgroundColor: colors.white,
        flex: 1,
        paddingTop: 10,
        paddingRight: 15,
      }}
    />
  );
};
