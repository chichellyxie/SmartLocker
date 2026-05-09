import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/dashboard/DashboardScreen';
import SubjectsScreen from '../screens/subjects/SubjectsScreen';
import PomodoroScreen from '../screens/pomodoro/PomodoroScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          height: 75,
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,

          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 10,
        },

        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      {/* HOME */}

      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* SUBJECTS */}

      <Tab.Screen
        name="Subjects"
        component={SubjectsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="folder"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* POMODORO */}

      <Tab.Screen
        name="Pomodoro"
        component={PomodoroScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="timer"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* PROFILE */}

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}