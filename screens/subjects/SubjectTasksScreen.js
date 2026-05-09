import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ionicons } from '@expo/vector-icons';

import {
  saveActivity,
} from '../../services/activityService';

export default function SubjectTasksScreen({
  route,
  navigation,
}) {
  const { subject } = route.params;

  const [task,
    setTask] =
    useState('');

  const [tasks,
    setTasks] =
    useState([]);

  // STORAGE KEY

  const storageKey =
    `tasks_${subject.id}`;

  // LOAD TASKS

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks =
    async () => {
      try {
        const storedTasks =
          await AsyncStorage.getItem(
            storageKey
          );

        if (storedTasks) {
          setTasks(
            JSON.parse(
              storedTasks
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

  // SAVE TASKS

  const saveTasks =
    async (updatedTasks) => {
      try {
        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify(
            updatedTasks
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

  // ADD TASK

  const addTask = async () => {
    if (!task.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: task,
      completed: false,
    };

    const updatedTasks = [
      ...tasks,
      newTask,
    ];

    setTasks(updatedTasks);

    saveTasks(updatedTasks);

    // SAVE RECENT ACTIVITY

    saveActivity(
      subject.id,
      'task',
      task
    );

    setTask('');
  };

  // TOGGLE TASK

  const toggleTask =
    async (id) => {
      const updatedTasks =
        tasks.map((item) =>
          item.id === id
            ? {
                ...item,
                completed:
                  !item.completed,
              }
            : item
        );

      setTasks(updatedTasks);

      saveTasks(updatedTasks);
    };

  // DELETE TASK

  const deleteTask =
    async (id) => {
      const updatedTasks =
        tasks.filter(
          (item) =>
            item.id !== id
        );

      setTasks(updatedTasks);

      saveTasks(updatedTasks);
    };

  // RENDER ITEM

  const renderTask = ({
    item,
  }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity
        style={styles.taskLeft}
        onPress={() =>
          toggleTask(item.id)
        }
      >
        <View
          style={[
            styles.circle,
            item.completed && {
              backgroundColor:
                '#2563EB',
              borderColor:
                '#2563EB',
            },
          ]}
        >
          {item.completed && (
            <Ionicons
              name="checkmark"
              size={16}
              color="#fff"
            />
          )}
        </View>

        <Text
          style={[
            styles.taskText,
            item.completed && {
              textDecorationLine:
                'line-through',

              color: '#94A3B8',
            },
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          deleteTask(item.id)
        }
      >
        <Ionicons
          name="trash-outline"
          size={22}
          color="#EF4444"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* BACK BUTTON */}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          navigation.goBack()
        }
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="#0F172A"
        />
      </TouchableOpacity>

      {/* HEADER */}

      <Text style={styles.title}>
        {subject.name} Tasks
      </Text>

      <Text style={styles.subtitle}>
        Organize subject
        activities.
      </Text>

      {/* INPUT CARD */}

      <View style={styles.inputCard}>
        <TextInput
          placeholder="Enter a task..."
          value={task}
          onChangeText={setTask}
          style={styles.input}
          placeholderTextColor="#94A3B8"
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={addTask}
        >
          <Ionicons
            name="add"
            size={22}
            color="#fff"
          />

          <Text
            style={
              styles.addButtonText
            }
          >
            Add Task
          </Text>
        </TouchableOpacity>
      </View>

      {/* TASK LIST */}

      <FlatList
        data={tasks}
        keyExtractor={(item) =>
          item.id
        }
        renderItem={renderTask}
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 140,
        }}
        ListEmptyComponent={
          <View
            style={
              styles.emptyContainer
            }
          >
            <Ionicons
              name="clipboard-outline"
              size={60}
              color="#CBD5E1"
            />

            <Text
              style={
                styles.emptyTitle
              }
            >
              No Tasks Yet
            </Text>

            <Text
              style={
                styles.emptySubtitle
              }
            >
              Add your first task
              for this subject.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  backButton: {
    width: 52,
    height: 52,
    borderRadius: 18,

    backgroundColor: '#FFFFFF',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 24,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 4,
  },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 28,

    fontSize: 16,
    color: '#64748B',
  },

  inputCard: {
    backgroundColor: '#FFFFFF',

    borderRadius: 28,

    padding: 20,

    marginBottom: 22,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 4,
  },

  input: {
    backgroundColor: '#F1F5F9',

    borderRadius: 18,

    paddingHorizontal: 18,
    paddingVertical: 16,

    fontSize: 16,
    color: '#0F172A',

    marginBottom: 16,
  },

  addButton: {
    backgroundColor: '#2563EB',

    borderRadius: 18,

    paddingVertical: 18,

    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',
  },

  addButtonText: {
    marginLeft: 10,

    color: '#FFFFFF',

    fontSize: 17,
    fontWeight: '600',
  },

  taskCard: {
    backgroundColor: '#FFFFFF',

    borderRadius: 24,

    padding: 18,

    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'center',

    marginBottom: 14,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.04,
    shadowRadius: 10,

    elevation: 4,
  },

  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',

    flex: 1,
  },

  circle: {
    width: 28,
    height: 28,

    borderRadius: 14,

    borderWidth: 2,
    borderColor: '#2563EB',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 14,
  },

  taskText: {
    fontSize: 17,
    color: '#0F172A',

    flex: 1,
  },

  emptyContainer: {
    marginTop: 80,
    alignItems: 'center',
  },

  emptyTitle: {
    marginTop: 18,

    fontSize: 22,
    fontWeight: 'bold',

    color: '#0F172A',
  },

  emptySubtitle: {
    marginTop: 8,

    fontSize: 15,

    color: '#94A3B8',

    textAlign: 'center',
  },
});