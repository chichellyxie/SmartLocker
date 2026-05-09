import { useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';

export default function GoalScreen() {
  const [goal, setGoal] = useState('');
  const [goals, setGoals] = useState([]);

  // LOAD GOALS

  useEffect(() => {
    loadGoals();
  }, []);

  // SAVE GOALS

  useEffect(() => {
    saveGoals();
  }, [goals]);

  const saveGoals = async () => {
    try {
      await AsyncStorage.setItem(
        'smartlocker_goals',
        JSON.stringify(goals)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const loadGoals = async () => {
    try {
      const storedGoals =
        await AsyncStorage.getItem(
          'smartlocker_goals'
        );

      if (storedGoals !== null) {
        setGoals(JSON.parse(storedGoals));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ADD GOAL

  const addGoal = () => {
    if (goal.trim() === '') return;

    const newGoal = {
      id: Date.now().toString(),
      title: goal,
      progress: 0,
    };

    setGoals([...goals, newGoal]);
    setGoal('');
  };

  // INCREASE PROGRESS

  const increaseProgress = (id) => {
    const updatedGoals = goals.map((item) => {
      if (item.id === id) {
        const updatedProgress =
          item.progress >= 100
            ? 100
            : item.progress + 10;

        return {
          ...item,
          progress: updatedProgress,
        };
      }

      return item;
    });

    setGoals(updatedGoals);
  };

  // DELETE GOAL

  const deleteGoal = (id) => {
    const filteredGoals = goals.filter(
      (item) => item.id !== id
    );

    setGoals(filteredGoals);
  };

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
          marginBottom: 10,
        }}
      >
        Goal Tracker
      </Text>

      <Text
        style={{
          color: '#666',
          marginBottom: 25,
        }}
      >
        Track your academic progress.
      </Text>

      {/* INPUT */}

      <TextInput
        placeholder="Enter your goal..."
        value={goal}
        onChangeText={setGoal}
        style={{
          backgroundColor: '#fff',
          padding: 15,
          borderRadius: 14,
          marginBottom: 15,
        }}
      />

      {/* BUTTON */}

      <TouchableOpacity
        onPress={addGoal}
        style={{
          backgroundColor: '#F59E0B',
          padding: 16,
          borderRadius: 14,
          marginBottom: 25,
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
          Add Goal
        </Text>
      </TouchableOpacity>

      {/* EMPTY STATE */}

      {goals.length === 0 ? (
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
            No Goals Yet
          </Text>

          <Text
            style={{
              color: '#777',
            }}
          >
            Set your first academic goal.
          </Text>
        </View>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: '#fff',
                padding: 20,
                borderRadius: 16,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 12,
                }}
              >
                {item.title}
              </Text>

              {/* PROGRESS BAR */}

              <View
                style={{
                  height: 12,
                  backgroundColor: '#E5E7EB',
                  borderRadius: 10,
                  overflow: 'hidden',
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    width: `${item.progress}%`,
                    height: '100%',
                    backgroundColor: '#F59E0B',
                  }}
                />
              </View>

              <Text
                style={{
                  color: '#666',
                  marginBottom: 15,
                }}
              >
                Progress: {item.progress}%
              </Text>

              <TouchableOpacity
                onPress={() =>
                  increaseProgress(item.id)
                }
                style={{
                  backgroundColor: '#F59E0B',
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  Increase Progress
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  deleteGoal(item.id)
                }
              >
                <Text
                  style={{
                    color: '#EF4444',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  Delete Goal
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}