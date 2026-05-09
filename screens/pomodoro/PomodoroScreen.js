import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  TextInput,
} from 'react-native';

import Slider from '@react-native-community/slider';

import { Ionicons } from '@expo/vector-icons';

export default function PomodoroScreen() {
  const [focusTime, setFocusTime] =
    useState(25);

  const [breakTime, setBreakTime] =
    useState(5);

  const [minutes, setMinutes] =
    useState(25);

  const [seconds, setSeconds] =
    useState(0);

  const [isRunning, setIsRunning] =
    useState(false);

  const [prepTime, setPrepTime] =
    useState(false);

  const [sessionType, setSessionType] =
    useState('focus');

  const [completedSessions,
    setCompletedSessions] =
    useState(0);

  const [sessionGoal, setSessionGoal] =
    useState('60');

  // THIS IS THE REAL FIX

  const [remainingGoalSeconds,
    setRemainingGoalSeconds] =
    useState(0);

  // PREP TIMER

  const [isPreparing, setIsPreparing] =
    useState(false);

  const [prepMinutes,
    setPrepMinutes] =
    useState(5);

  const [prepSeconds,
    setPrepSeconds] =
    useState(0);

  // MAIN TIMER

  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        // STOP EXACTLY
        // WHEN GOAL IS REACHED

        if (
          sessionType === 'focus' &&
          remainingGoalSeconds <= 0
        ) {
          setIsRunning(false);
          return;
        }

        // COUNTDOWN

        if (seconds > 0) {
          setSeconds((prev) => prev - 1);

          // DECREASE TOTAL GOAL
          // ONLY DURING FOCUS

          if (
            sessionType === 'focus'
          ) {
            setRemainingGoalSeconds(
              (prev) => prev - 1
            );
          }
        } else {
          // NEXT MINUTE

          if (minutes > 0) {
            setMinutes(
              (prev) => prev - 1
            );

            setSeconds(59);

            // DECREASE TOTAL GOAL
            // FOR 00 → 59 TRANSITION

            if (
              sessionType === 'focus'
            ) {
              setRemainingGoalSeconds(
                (prev) => prev - 1
              );
            }
          } else {
            // SESSION FINISHED

            if (
              sessionType ===
              'focus'
            ) {
              setCompletedSessions(
                (prev) => prev + 1
              );

              setSessionType('break');

              setMinutes(breakTime);

              setSeconds(0);
            } else {
              setSessionType('focus');

              setMinutes(focusTime);

              setSeconds(0);
            }
          }
        }
      }, 1000);
    }

    return () =>
      clearInterval(timer);
  }, [
    seconds,
    minutes,
    isRunning,
    sessionType,
    remainingGoalSeconds,
    focusTime,
    breakTime,
  ]);

  // PREP TIMER

  useEffect(() => {
    let prepTimer;

    if (isPreparing) {
      prepTimer = setInterval(() => {
        if (prepSeconds > 0) {
          setPrepSeconds(
            (prev) => prev - 1
          );
        } else {
          if (prepMinutes > 0) {
            setPrepMinutes(
              (prev) => prev - 1
            );

            setPrepSeconds(59);
          } else {
            setIsPreparing(false);

            beginFocusSession();
          }
        }
      }, 1000);
    }

    return () =>
      clearInterval(prepTimer);
  }, [
    isPreparing,
    prepMinutes,
    prepSeconds,
  ]);

  // START REAL SESSION

  const beginFocusSession = () => {
    setSessionType('focus');

    setMinutes(focusTime);

    setSeconds(0);

    setIsRunning(true);
  };

  // START BUTTON

  const startFocus = () => {
    // RESET GOAL TRACKER

    setRemainingGoalSeconds(
      Number(sessionGoal) * 60
    );

    if (prepTime) {
      setIsPreparing(true);

      setPrepMinutes(5);

      setPrepSeconds(0);

      return;
    }

    beginFocusSession();
  };

  // PAUSE

  const pauseFocus = () => {
    setIsRunning(false);
  };

  // RESET

  const resetFocus = () => {
    setIsRunning(false);

    setIsPreparing(false);

    setSessionType('focus');

    setMinutes(focusTime);

    setSeconds(0);

    setCompletedSessions(0);

    setPrepMinutes(5);

    setPrepSeconds(0);

    setRemainingGoalSeconds(0);
  };

  // FORMAT TIME

  const formatTime = (time) => {
    return time < 10
      ? `0${time}`
      : time;
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingBottom: 140,
      }}
      showsVerticalScrollIndicator={
        false
      }
    >
      <View style={styles.container}>
        {/* TITLE */}

        <Text style={styles.title}>
          Focus Timer
        </Text>

        <Text style={styles.subtitle}>
          Stay calm and productive.
        </Text>

        {/* TIMER */}

        <View style={styles.timerCard}>
          <Text style={styles.timerText}>
            {isPreparing
              ? `${formatTime(
                  prepMinutes
                )}:${formatTime(
                  prepSeconds
                )}`
              : `${formatTime(
                  minutes
                )}:${formatTime(
                  seconds
                )}`}
          </Text>

          <Text
            style={styles.timerLabel}
          >
            {isPreparing
              ? 'Preparation Time'
              : sessionType ===
                'focus'
              ? 'Focus Session'
              : 'Break Time'}
          </Text>
        </View>

        {/* SLIDERS */}

        <View style={styles.sliderRow}>
          {/* FOCUS */}

          <View style={styles.sliderBox}>
            <View
              style={styles.sliderHeader}
            >
              <Ionicons
                name="time-outline"
                size={20}
                color="#7C8F6A"
              />

              <Text
                style={
                  styles.sliderTitle
                }
              >
                Focus
              </Text>

              <Text
                style={
                  styles.sliderValue
                }
              >
                {focusTime}m
              </Text>
            </View>

            <Slider
              minimumValue={5}
              maximumValue={60}
              step={5}
              value={focusTime}
              onValueChange={
                setFocusTime
              }
              minimumTrackTintColor="#8DA27F"
              maximumTrackTintColor="#DDD6CE"
              thumbTintColor="#8DA27F"
              disabled={
                isRunning ||
                isPreparing
              }
            />
          </View>

          {/* BREAK */}

          <View style={styles.sliderBox}>
            <View
              style={styles.sliderHeader}
            >
              <Ionicons
                name="leaf-outline"
                size={20}
                color="#7C8F6A"
              />

              <Text
                style={
                  styles.sliderTitle
                }
              >
                Break
              </Text>

              <Text
                style={
                  styles.sliderValue
                }
              >
                {breakTime}m
              </Text>
            </View>

            <Slider
              minimumValue={1}
              maximumValue={20}
              step={1}
              value={breakTime}
              onValueChange={
                setBreakTime
              }
              minimumTrackTintColor="#8DA27F"
              maximumTrackTintColor="#DDD6CE"
              thumbTintColor="#8DA27F"
              disabled={
                isRunning ||
                isPreparing
              }
            />
          </View>
        </View>

        {/* SESSION GOAL */}

        <Text style={styles.sectionLabel}>
          TOTAL SESSION GOAL
        </Text>

        <View style={styles.goalInputBox}>
          <TextInput
            value={sessionGoal}
            onChangeText={
              setSessionGoal
            }
            keyboardType="numeric"
            style={styles.goalInput}
            editable={
              !isRunning &&
              !isPreparing
            }
          />

          <Text
            style={styles.goalMinutes}
          >
            minutes
          </Text>
        </View>

        {/* COMPLETED */}

        <View style={styles.goalInfoCard}>
          <Text
            style={styles.goalInfoText}
          >
            Completed Sessions
          </Text>

          <Text
            style={
              styles.goalInfoNumber
            }
          >
            {completedSessions}
          </Text>
        </View>

        {/* PREP TIME */}

        <View style={styles.toggleRow}>
          <View>
            <Text
              style={
                styles.toggleTitle
              }
            >
              Prep Time
            </Text>

            <Text
              style={
                styles.toggleSubtitle
              }
            >
              5-minute preparation before
              focus session
            </Text>
          </View>

          <Switch
            value={prepTime}
            onValueChange={
              setPrepTime
            }
            trackColor={{
              false: '#DDD6CE',
              true: '#B7C7A6',
            }}
            thumbColor="#fff"
          />
        </View>

        {/* START / PAUSE */}

        {!isRunning &&
        !isPreparing ? (
          <TouchableOpacity
            style={styles.focusButton}
            onPress={startFocus}
            activeOpacity={0.9}
          >
            <Ionicons
              name="cafe-outline"
              size={22}
              color="#5B5147"
            />

            <Text
              style={
                styles.focusButtonText
              }
            >
              Let's Focus
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.pauseButton}
            onPress={pauseFocus}
            activeOpacity={0.9}
          >
            <Ionicons
              name="pause-outline"
              size={22}
              color="#fff"
            />

            <Text
              style={
                styles.pauseButtonText
              }
            >
              Pause Session
            </Text>
          </TouchableOpacity>
        )}

        {/* RESET */}

        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetFocus}
        >
          <Ionicons
            name="refresh-outline"
            size={20}
            color="#5B5147"
          />

          <Text style={styles.resetText}>
            Reset Timer
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4EE',
    padding: 24,
    paddingTop: 70,
  },

  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#5B5147',
  },

  subtitle: {
    fontSize: 16,
    color: '#A79B8F',
    marginTop: 6,
    marginBottom: 30,
  },

  timerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    paddingVertical: 45,
    alignItems: 'center',
    marginBottom: 35,
  },

  timerText: {
    fontSize: 58,
    fontWeight: 'bold',
    color: '#5B5147',
  },

  timerLabel: {
    marginTop: 10,
    color: '#A79B8F',
    fontSize: 18,
  },

  sliderRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginBottom: 25,
  },

  sliderBox: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
  },

  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  sliderTitle: {
    marginLeft: 8,
    fontSize: 16,
    color: '#5B5147',
    fontWeight: '600',
  },

  sliderValue: {
    marginLeft: 'auto',
    color: '#7C8F6A',
    fontWeight: '600',
  },

  sectionLabel: {
    fontSize: 13,
    letterSpacing: 2,
    color: '#A79B8F',
    marginBottom: 14,
    marginTop: 10,
  },

  goalInputBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,

    paddingHorizontal: 20,
    paddingVertical: 18,

    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 28,
  },

  goalInput: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#5B5147',
    minWidth: 100,
  },

  goalMinutes: {
    fontSize: 18,
    color: '#A79B8F',
    marginLeft: 10,
  },

  goalInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,

    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',

    marginBottom: 28,
  },

  goalInfoText: {
    fontSize: 18,
    color: '#5B5147',
    fontWeight: '600',
  },

  goalInfoNumber: {
    fontSize: 28,
    color: '#8DA27F',
    fontWeight: 'bold',
  },

  toggleRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,

    flexDirection: 'row',
    justifyContent:
      'space-between',

    alignItems: 'center',

    marginBottom: 18,
  },

  toggleTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#5B5147',
  },

  toggleSubtitle: {
    color: '#A79B8F',
    marginTop: 4,
    width: 220,
  },

  focusButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,

    paddingVertical: 22,

    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',

    marginTop: 25,
  },

  focusButtonText: {
    marginLeft: 12,
    fontSize: 22,
    fontWeight: '600',
    color: '#5B5147',
  },

  pauseButton: {
    backgroundColor: '#8DA27F',
    borderRadius: 28,

    paddingVertical: 22,

    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',

    marginTop: 25,
  },

  pauseButtonText: {
    marginLeft: 12,
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  resetButton: {
    backgroundColor: '#EFE9E1',
    borderRadius: 24,

    paddingVertical: 18,

    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',

    marginTop: 18,
  },

  resetText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#5B5147',
    fontWeight: '600',
  },
});