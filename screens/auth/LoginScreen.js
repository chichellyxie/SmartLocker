import React, {
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({
  navigation,
}) {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const handleLogin = () => {
    if (
      email.trim() === 'admin@gmail.com' &&
      password.trim() === '123456'
    ) {
      navigation.navigate('Main');
    } else {
      Alert.alert(
        'Login Failed',
        'Incorrect email or password.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      {/* TOP BRAND */}

      <View style={styles.topSection}>
        <View style={styles.logoCircle}>
          <Ionicons
            name="school"
            size={42}
            color="#fff"
          />
        </View>

        <Text style={styles.logo}>
          SmartLocker
        </Text>

        <Text style={styles.subtitle}>
          Your academic workspace
        </Text>
      </View>

      {/* LOGIN CARD */}

      <View style={styles.card}>
        <Text style={styles.welcome}>
          Welcome Back
        </Text>

        <Text style={styles.helper}>
          Continue organizing your
          studies.
        </Text>

        {/* EMAIL */}

        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={22}
            color="#64748B"
          />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* PASSWORD */}

        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={22}
            color="#64748B"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={
              setPassword
            }
            secureTextEntry
            style={styles.input}
          />
        </View>

        {/* LOGIN BUTTON */}

        <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={0.9}
          onPress={handleLogin}
        >
          <Text
            style={
              styles.loginButtonText
            }
          >
            Login
          </Text>
        </TouchableOpacity>

        {/* DEMO */}

        <View style={styles.demoCard}>
          <Text style={styles.demoTitle}>
            Demo Account
          </Text>

          <Text style={styles.demoText}>
            admin@gmail.com
          </Text>

          <Text style={styles.demoText}>
            123456
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    padding: 24,
  },

  topSection: {
    alignItems: 'center',
    marginBottom: 40,
  },

  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2563EB',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 20,

    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.2,
    shadowRadius: 10,

    elevation: 5,
  },

  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 34,
    padding: 28,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.06,
    shadowRadius: 10,

    elevation: 4,
  },

  welcome: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  helper: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 30,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#F8FAFC',

    borderRadius: 18,

    paddingHorizontal: 18,
    paddingVertical: 18,

    marginBottom: 18,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#0F172A',
  },

  loginButton: {
    backgroundColor: '#2563EB',

    borderRadius: 20,

    paddingVertical: 18,

    alignItems: 'center',

    marginTop: 10,
  },

  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  demoCard: {
    marginTop: 28,

    backgroundColor: '#EFF6FF',

    borderRadius: 20,

    padding: 18,
  },

  demoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 10,
  },

  demoText: {
    color: '#334155',
    marginBottom: 4,
  },
});