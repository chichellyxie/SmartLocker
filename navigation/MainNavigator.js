import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabs from './BottomTabs';

import SubjectDetailsScreen from '../screens/subjects/SubjectDetailsScreen';

import SubjectTasksScreen from '../screens/subjects/SubjectTasksScreen';

import SubjectFilesScreen from '../screens/subjects/SubjectFilesScreen';

import SubjectNotesScreen from '../screens/subjects/SubjectNotesScreen';

import SubjectFlashcardsScreen from '../screens/subjects/SubjectFlashcardsScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
      >
        {/* MAIN APP */}

        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{
            headerShown: false,
          }}
        />

        {/* SUBJECT DETAILS */}

        <Stack.Screen
          name="SubjectDetails"
          component={SubjectDetailsScreen}
          options={{
            headerShown: false,
          }}
        />

        {/* TASKS */}

        <Stack.Screen
          name="SubjectTasks"
          component={SubjectTasksScreen}
          options={{
            headerShown: false,
          }}
        />

        {/* FILES */}

        <Stack.Screen
          name="SubjectFiles"
          component={SubjectFilesScreen}
          options={{
            headerShown: false,
          }}
        />

        {/* NOTES */}

        <Stack.Screen
          name="SubjectNotes"
          component={SubjectNotesScreen}
          options={{
            headerShown: false,
          }}
        />

        {/* FLASHCARDS */}

        <Stack.Screen
          name="SubjectFlashcards"
          component={
            SubjectFlashcardsScreen
          }
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}