import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  loadActivities,
} from '../../services/activityService';

import {
  useFocusEffect,
} from '@react-navigation/native';

export default function SubjectDetailsScreen({
  route,
  navigation,
}) {
  const { subject } = route.params;

  const [activities,
    setActivities] =
    useState([]);

  useFocusEffect(
  useCallback(() => {
    fetchActivities();
  }, [])
);

  const fetchActivities =
    async () => {
      const loadedActivities =
        await loadActivities(
          subject.id
        );

      setActivities(
        loadedActivities.slice(
          0,
          5
        )
      );
    };

  const getIcon = (type) => {
    switch (type) {
      case 'task':
        return 'checkmark-done-outline';

      case 'note':
        return 'document-text-outline';

      case 'file':
        return 'folder-open-outline';

      case 'flashcard':
        return 'albums-outline';

      default:
        return 'ellipse-outline';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 120,
      }}
      showsVerticalScrollIndicator={
        false
      }
    >
      {/* HERO */}

      <View
        style={[
          styles.heroCard,
          {
            backgroundColor:
              subject.color,
          },
        ]}
      >
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

        <View style={styles.heroIcon}>
          <Ionicons
            name="book-outline"
            size={34}
            color="#0F172A"
          />
        </View>

        <Text style={styles.heroTitle}>
          {subject.name}
        </Text>

        <Text
          style={styles.heroSubtitle}
        >
          Academic Workspace
        </Text>
      </View>

      {/* QUICK ACCESS */}

      <Text style={styles.sectionTitle}>
        Quick Access
      </Text>

      <View style={styles.quickGrid}>
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() =>
            navigation.navigate(
              'SubjectTasks',
              { subject }
            )
          }
        >
          <View
            style={styles.quickIconBox}
          >
            <Ionicons
              name="checkmark-done-outline"
              size={28}
              color="#2563EB"
            />
          </View>

          <Text
            style={styles.quickTitle}
          >
            Tasks
          </Text>

          <Text
            style={
              styles.quickSubtitle
            }
          >
            Manage activities
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() =>
            navigation.navigate(
              'SubjectNotes',
              { subject }
            )
          }
        >
          <View
            style={styles.quickIconBox}
          >
            <Ionicons
              name="document-text-outline"
              size={28}
              color="#8B5CF6"
            />
          </View>

          <Text
            style={styles.quickTitle}
          >
            Notes
          </Text>

          <Text
            style={
              styles.quickSubtitle
            }
          >
            Study materials
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() =>
            navigation.navigate(
              'SubjectFiles',
              { subject }
            )
          }
        >
          <View
            style={styles.quickIconBox}
          >
            <Ionicons
              name="folder-open-outline"
              size={28}
              color="#F97316"
            />
          </View>

          <Text
            style={styles.quickTitle}
          >
            Files
          </Text>

          <Text
            style={
              styles.quickSubtitle
            }
          >
            Organized resources
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() =>
            navigation.navigate(
              'SubjectFlashcards',
              { subject }
            )
          }
        >
          <View
            style={styles.quickIconBox}
          >
            <Ionicons
              name="albums-outline"
              size={28}
              color="#7C3AED"
            />
          </View>

          <Text
            style={styles.quickTitle}
          >
            Flashcards
          </Text>

          <Text
            style={
              styles.quickSubtitle
            }
          >
            Memory practice
          </Text>
        </TouchableOpacity>
      </View>

      {/* RECENT ACTIVITY */}

      <Text style={styles.sectionTitle}>
        Recent Activity
      </Text>

      {activities.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons
            name="time-outline"
            size={55}
            color="#CBD5E1"
          />

          <Text
            style={styles.emptyTitle}
          >
            No Recent Activity
          </Text>

          <Text
            style={styles.emptyText}
          >
            Your recent actions
            will appear here.
          </Text>
        </View>
      ) : (
        activities.map(
          (activity) => (
            <View
              key={activity.id}
              style={
                styles.activityCard
              }
            >
              <View
                style={
                  styles.activityIcon
                }
              >
                <Ionicons
                  name={getIcon(
                    activity.type
                  )}
                  size={24}
                  color="#2563EB"
                />
              </View>

              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={
                    styles.activityTitle
                  }
                >
                  {activity.title}
                </Text>

                <Text
                  style={
                    styles.activityType
                  }
                >
                  {activity.type}
                </Text>

                <Text
                  style={
                    styles.activityTime
                  }
                >
                  {
                    activity.createdAt
                  }
                </Text>
              </View>
            </View>
          )
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  heroCard: {
    borderRadius: 34,
    padding: 28,
    marginBottom: 28,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 16,

    backgroundColor:
      'rgba(255,255,255,0.35)',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 24,
  },

  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,

    backgroundColor:
      'rgba(255,255,255,0.35)',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 24,
  },

  heroTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  heroSubtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#334155',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 18,
  },

  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:
      'space-between',

    marginBottom: 30,
  },

  quickCard: {
    width: '48%',

    backgroundColor: '#FFFFFF',

    borderRadius: 28,

    padding: 22,

    marginBottom: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 4,
  },

  quickIconBox: {
    width: 58,
    height: 58,
    borderRadius: 20,

    backgroundColor: '#F1F5F9',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 18,
  },

  quickTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  quickSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 35,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 18,
  },

  emptyText: {
    marginTop: 8,
    color: '#64748B',
    textAlign: 'center',
  },

  activityCard: {
    backgroundColor: '#FFFFFF',

    borderRadius: 24,

    padding: 18,

    flexDirection: 'row',

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

  activityIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,

    backgroundColor: '#EFF6FF',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 16,
  },

  activityTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  activityType: {
    marginTop: 4,
    color: '#2563EB',
    textTransform: 'capitalize',
  },

  activityTime: {
    marginTop: 8,
    color: '#94A3B8',
    fontSize: 13,
  },
});