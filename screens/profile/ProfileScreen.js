import React, {
  useCallback,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [subjectsCount, setSubjectsCount] =
    useState(0);

  const [tasksCount, setTasksCount] =
    useState(0);

  const [notesCount, setNotesCount] =
    useState(0);

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  const loadProfileData = async () => {
    try {
      const storedSubjects =
        await AsyncStorage.getItem(
          'subjects'
        );

      const parsedSubjects =
        storedSubjects
          ? JSON.parse(storedSubjects)
          : [];

      setSubjectsCount(
        parsedSubjects.length
      );

      let totalTasks = 0;
      let totalNotes = 0;

      for (const subject of parsedSubjects) {
        const storedTasks =
          await AsyncStorage.getItem(
            `tasks_${subject.id}`
          );

        const storedNotes =
          await AsyncStorage.getItem(
            `notes_${subject.id}`
          );

        totalTasks += storedTasks
          ? JSON.parse(storedTasks)
              .length
          : 0;

        totalNotes += storedNotes
          ? JSON.parse(storedNotes)
              .length
          : 0;
      }

      setTasksCount(totalTasks);
      setNotesCount(totalNotes);
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
      {/* PROFILE HEADER */}

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons
            name="person"
            size={60}
            color="#fff"
          />
        </View>

        <Text style={styles.name}>
          Student
        </Text>

        <Text style={styles.role}>
          SmartLocker User
        </Text>
      </View>

      {/* STATS */}

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons
            name="folder"
            size={28}
            color="#2563EB"
          />

          <Text style={styles.statNumber}>
            {subjectsCount}
          </Text>

          <Text style={styles.statLabel}>
            Subjects
          </Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons
            name="checkbox"
            size={28}
            color="#8B5CF6"
          />

          <Text style={styles.statNumber}>
            {tasksCount}
          </Text>

          <Text style={styles.statLabel}>
            Tasks
          </Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons
            name="create"
            size={28}
            color="#EC4899"
          />

          <Text style={styles.statNumber}>
            {notesCount}
          </Text>

          <Text style={styles.statLabel}>
            Notes
          </Text>
        </View>
      </View>

      {/* SETTINGS */}

      <Text style={styles.sectionTitle}>
        Preferences
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="moon-outline"
              size={24}
              color="#334155"
            />

            <Text style={styles.rowText}>
              Dark Mode
            </Text>
          </View>

          <Text style={styles.badge}>
            Soon
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color="#334155"
            />

            <Text style={styles.rowText}>
              Notifications
            </Text>
          </View>

          <Text style={styles.badge}>
            Soon
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="musical-notes-outline"
              size={24}
              color="#334155"
            />

            <Text style={styles.rowText}>
              Ambiant Sounds
            </Text>
          </View>

          <Text style={styles.badge}>
            Soon
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="cloud-upload-outline"
              size={24}
              color="#334155"
            />

            <Text style={styles.rowText}>
              Cloud Sync
            </Text>
          </View>

          <Text style={styles.badge}>
            Soon
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="cloud-offline-outline"
              size={24}
              color="#334155"
            />

            <Text style={styles.rowText}>
              Offline Mode
            </Text>
          </View>

          <Text
            style={[
              styles.badge,
              {
                backgroundColor:
                  '#DCFCE7',
                color: '#166534',
              },
            ]}
          >
            Active
          </Text>
        </View>
      </View>

      {/* ABOUT */}

      <Text style={styles.sectionTitle}>
        About SmartLocker
      </Text>

      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>
          SmartLocker
        </Text>

        <Text style={styles.aboutText}>
          An all-in-one academic organizer
          designed for students to manage
          tasks, notes, flashcards, files,
          and productivity tools within a
          unified mobile workspace.
        </Text>

        <Text style={styles.version}>
          Version 1.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 20,
  },

  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,

    backgroundColor: '#2563EB',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 20,

    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.2,
    shadowRadius: 10,

    elevation: 6,
  },

  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  role: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginBottom: 40,
  },

  statCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 22,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 3,
  },

  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 12,
  },

  statLabel: {
    marginTop: 8,
    color: '#64748B',
    fontSize: 14,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 18,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 22,
    marginBottom: 35,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 3,
  },

  row: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',

    paddingVertical: 16,

    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowText: {
    fontSize: 16,
    color: '#0F172A',
    marginLeft: 14,
  },

  badge: {
    backgroundColor: '#E2E8F0',
    color: '#334155',

    paddingHorizontal: 14,
    paddingVertical: 6,

    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },

  aboutCard: {
    backgroundColor: '#0F172A',
    borderRadius: 30,
    padding: 26,
    marginBottom: 60,
  },

  aboutTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  aboutText: {
    color: '#CBD5E1',
    fontSize: 15,
    lineHeight: 24,
  },

  version: {
    color: '#94A3B8',
    marginTop: 24,
    fontSize: 14,
  },
});