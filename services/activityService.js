import AsyncStorage from '@react-native-async-storage/async-storage';

// SAVE ACTIVITY

export const saveActivity =
  async (
    subjectId,
    type,
    title
  ) => {
    try {
      const activityKey =
        `activity_${subjectId}`;

      const storedActivities =
        await AsyncStorage.getItem(
          activityKey
        );

      const activities =
        storedActivities
          ? JSON.parse(
              storedActivities
            )
          : [];

      const newActivity = {
        id: Date.now().toString(),
        type,
        title,
        createdAt:
          new Date().toLocaleString(),
      };

      const updatedActivities = [
        newActivity,
        ...activities,
      ];

      await AsyncStorage.setItem(
        activityKey,
        JSON.stringify(
          updatedActivities
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

// LOAD ACTIVITIES

export const loadActivities =
  async (subjectId) => {
    try {
      const activityKey =
        `activity_${subjectId}`;

      const storedActivities =
        await AsyncStorage.getItem(
          activityKey
        );

      return storedActivities
        ? JSON.parse(
            storedActivities
          )
        : [];
    } catch (error) {
      console.log(error);

      return [];
    }
  };