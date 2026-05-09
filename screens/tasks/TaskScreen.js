import { useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';

export default function TaskScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  // LOAD TASKS WHEN APP STARTS

  useEffect(() => {
    loadTasks();
  }, []);

  // SAVE TASKS WHENEVER TASKS CHANGE

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  // SAVE TASKS

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem(
        'tasks',
        JSON.stringify(tasks)
      );
    } catch (error) {
      console.log(error);
    }
  };

  // LOAD TASKS

  const loadTasks = async () => {
    try {
      const storedTasks =
        await AsyncStorage.getItem(
          'tasks'
        );

      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ADD TASK

  const addTask = () => {
    if (task.trim() === '') return;

    const newTask = {
      id: Date.now().toString(),
      title: task,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTask('');
  };

  // TOGGLE COMPLETE

  const toggleTask = (id) => {
    const updatedTasks = tasks.map((item) =>
      item.id === id
        ? {
            ...item,
            completed: !item.completed,
          }
        : item
    );

    setTasks(updatedTasks);
  };

  // DELETE TASK

  const deleteTask = (id) => {
    const filteredTasks = tasks.filter(
      (item) => item.id !== id
    );

    setTasks(filteredTasks);
  };

  // COMPLETED COUNT

  const completedTasks = tasks.filter(
    (item) => item.completed
  ).length;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F5F7FB',
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
        }}
      >
        Task Manager
      </Text>

      <Text
        style={{
          color: '#666',
          marginTop: 5,
          marginBottom: 20,
        }}
      >
        {completedTasks} of {tasks.length} tasks completed
      </Text>

      {/* INPUT */}

      <TextInput
        placeholder="Enter a task..."
        value={task}
        onChangeText={setTask}
        style={{
          backgroundColor: '#fff',
          padding: 15,
          borderRadius: 14,
          marginBottom: 15,
          fontSize: 16,
        }}
      />

      {/* ADD BUTTON */}

      <TouchableOpacity
        onPress={addTask}
        style={{
          backgroundColor: '#2563EB',
          padding: 16,
          borderRadius: 14,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          Add Task
        </Text>
      </TouchableOpacity>

      {/* EMPTY STATE */}

      {tasks.length === 0 ? (
        <View
          style={{
            backgroundColor: '#fff',
            padding: 30,
            borderRadius: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 8,
            }}
          >
            No Tasks Yet
          </Text>

          <Text
            style={{
              color: '#777',
            }}
          >
            Add your first academic task.
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: '#fff',
                padding: 18,
                borderRadius: 16,
                marginBottom: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* TASK */}

              <TouchableOpacity
                onPress={() => toggleTask(item.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                {/* CIRCLE */}

                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: item.completed
                      ? '#10B981'
                      : '#999',
                    backgroundColor: item.completed
                      ? '#10B981'
                      : '#fff',
                    marginRight: 14,
                  }}
                />

                {/* TITLE */}

                <Text
                  style={{
                    fontSize: 16,
                    textDecorationLine:
                      item.completed
                        ? 'line-through'
                        : 'none',
                    color: item.completed
                      ? '#999'
                      : '#000',
                  }}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>

              {/* DELETE */}

              <TouchableOpacity
                onPress={() => deleteTask(item.id)}
              >
                <Text
                  style={{
                    color: '#EF4444',
                    fontWeight: 'bold',
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}