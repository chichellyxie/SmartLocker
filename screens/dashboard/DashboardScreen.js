import React, {
  useCallback,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen({
  navigation,
}) {
  const [subjects, setSubjects] =
    useState([]);

  const [pendingTasks, setPendingTasks] =
    useState([]);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    try {
      // SUBJECTS

      const storedSubjects =
        await AsyncStorage.getItem(
          'subjects'
        );

      const parsedSubjects =
        storedSubjects
          ? JSON.parse(storedSubjects)
          : [];

      setSubjects(parsedSubjects);

      // TASKS

      let allTasks = [];

      for (const subject of parsedSubjects) {
        const storedTasks =
          await AsyncStorage.getItem(
            `tasks_${subject.id}`
          );

        if (storedTasks) {
          const parsedTasks =
            JSON.parse(storedTasks);

          const incompleteTasks =
            parsedTasks
              .filter(
                (task) =>
                  !task.completed
              )
              .map((task) => ({
                ...task,
                subjectName:
                  subject.name,
              }));

          allTasks = [
            ...allTasks,
            ...incompleteTasks,
          ];
        }
      }

      setPendingTasks(allTasks);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={
        false
      }
    >
      <View style={styles.content}>
        {/* HEADER */}

        <Text style={styles.greeting}>
          Good Evening 👋
        </Text>

        <Text style={styles.logo}>
          SmartLocker
        </Text>

        <Text style={styles.subtitle}>
          Your academic workspace
        </Text>

        {/* STATS */}

        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor:
                  '#2563EB',
              },
            ]}
          >
            <Ionicons
              name="checkbox"
              size={28}
              color="#fff"
            />

            <Text
              style={styles.statNumber}
            >
              {
                pendingTasks.length
              }
            </Text>

            <Text
              style={styles.statLabel}
            >
              Pending Tasks
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor:
                  '#8B5CF6',
              },
            ]}
          >
            <Ionicons
              name="folder"
              size={28}
              color="#fff"
            />

            <Text
              style={styles.statNumber}
            >
              {subjects.length}
            </Text>

            <Text
              style={styles.statLabel}
            >
              Subjects
            </Text>
          </View>
        </View>

        {/* RECENT TASKS */}

        <View style={styles.section}>
          <View
            style={
              styles.sectionHeader
            }
          >
            <Text
              style={
                styles.sectionTitle
              }
            >
              Recent Tasks
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  'Subjects'
                )
              }
            >
              <Text
                style={
                  styles.seeAll
                }
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {pendingTasks.length ===
          0 ? (
            <View
              style={
                styles.emptyCard
              }
            >
              <Ionicons
                name="checkmark-circle"
                size={40}
                color="#CBD5E1"
              />

              <Text
                style={
                  styles.emptyText
                }
              >
                No pending tasks.
              </Text>
            </View>
          ) : (
            pendingTasks
              .slice(0, 5)
              .map((task) => (
                <View
                  key={task.id}
                  style={
                    styles.taskCard
                  }
                >
                  <View
                    style={
                      styles.taskLeft
                    }
                  >
                    <View
                      style={
                        styles.circle
                      }
                    />

                    <View>
                      <Text
                        style={
                          styles.taskTitle
                        }
                      >
                        {task.title}
                      </Text>

                      <Text
                        style={
                          styles.taskSubject
                        }
                      >
                        {
                          task.subjectName
                        }
                      </Text>
                    </View>
                  </View>
                </View>
              ))
          )}
        </View>

        {/* SUBJECT OVERVIEW */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Subject Overview
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
          >
            {subjects.map(
              (subject) => (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.subjectCard,
                    {
                      backgroundColor:
                        subject.color,
                    },
                  ]}
                  onPress={() =>
                    navigation.navigate(
                      'SubjectDetails',
                      {
                        subject,
                      }
                    )
                  }
                >
                  <Ionicons
                    name="folder"
                    size={32}
                    color="#0F172A"
                  />

                  <Text
                    style={
                      styles.subjectName
                    }
                  >
                    {subject.name}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>

        {/* POMODORO */}

        <TouchableOpacity
          style={styles.pomodoroCard}
          onPress={() =>
            navigation.navigate(
              'Pomodoro'
            )
          }
        >
          <Ionicons
            name="timer-outline"
            size={38}
            color="#fff"
          />

          <View
            style={{
              marginLeft: 18,
            }}
          >
            <Text
              style={
                styles.pomodoroTitle
              }
            >
              Focus Session
            </Text>

            <Text
              style={
                styles.pomodoroSubtitle
              }
            >
              Start studying with
              Pomodoro
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },

  greeting: {
    fontSize: 18,
    color: '#64748B',
  },

  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 6,
  },

  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 6,
    marginBottom: 30,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 35,
  },

  statCard: {
    width: '48%',
    borderRadius: 26,
    padding: 24,
  },

  statNumber: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 18,
  },

  statLabel: {
    color: '#E0E7FF',
    marginTop: 8,
    fontSize: 15,
  },

  section: {
    marginBottom: 35,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  seeAll: {
    color: '#2563EB',
    fontWeight: '600',
  },

  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
  },

  emptyText: {
    marginTop: 12,
    color: '#94A3B8',
    fontSize: 15,
  },

  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
  },

  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#2563EB',
    marginRight: 16,
  },

  taskTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0F172A',
  },

  taskSubject: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 5,
  },

  subjectCard: {
    width: 160,
    height: 150,
    borderRadius: 28,
    padding: 22,
    marginRight: 18,
    justifyContent: 'space-between',
  },

  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  pomodoroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 28,
    padding: 26,
    flexDirection: 'row',
    alignItems: 'center',
  },

  pomodoroTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },

  pomodoroSubtitle: {
    color: '#CBD5E1',
    marginTop: 6,
    fontSize: 15,
  },
});