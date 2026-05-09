import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as DocumentPicker from 'expo-document-picker';

import { Ionicons } from '@expo/vector-icons';

import {
  saveActivity,
} from '../../services/activityService';

export default function SubjectFilesScreen({
  route,
  navigation,
}) {
  const { subject } = route.params;

  const [files, setFiles] =
    useState([]);

  const STORAGE_KEY =
    `files_${subject.id}`;

  useEffect(() => {
    loadFiles();
  }, []);

  // LOAD FILES

  const loadFiles = async () => {
    try {
      const storedFiles =
        await AsyncStorage.getItem(
          STORAGE_KEY
        );

      if (storedFiles) {
        setFiles(
          JSON.parse(storedFiles)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // SAVE FILES

  const saveFiles = async (
    updatedFiles
  ) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          updatedFiles
        )
      );

      setFiles(updatedFiles);
    } catch (error) {
      console.log(error);
    }
  };

  // PICK FILE

  const pickFile = async () => {
    try {
      const result =
        await DocumentPicker.getDocumentAsync(
          {
            multiple: false,
            copyToCacheDirectory: true,
          }
        );

      if (
        result.canceled
      ) {
        return;
      }

      const selectedFile =
        result.assets[0];

      const newFile = {
        id: Date.now().toString(),
        name:
          selectedFile.name,
        size:
          selectedFile.size,
        uri: selectedFile.uri,
        type:
          selectedFile.mimeType,
        createdAt:
          new Date().toLocaleDateString(),
      };

      const updatedFiles = [
        newFile,
        ...files,
      ];

      saveFiles(updatedFiles);

      // SAVE RECENT ACTIVITY

      saveActivity(
        subject.id,
        'file',
        selectedFile.name
      );
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Error',
        'Failed to upload file.'
      );
    }
  };

  // DELETE FILE

  const deleteFile = (
    id
  ) => {
    const updatedFiles =
      files.filter(
        (file) =>
          file.id !== id
      );

    saveFiles(updatedFiles);
  };

  // FORMAT FILE SIZE

  const formatSize = (
    bytes
  ) => {
    if (!bytes)
      return 'Unknown Size';

    const kb =
      bytes / 1024;

    if (kb < 1024) {
      return `${kb.toFixed(
        1
      )} KB`;
    }

    return `${(
      kb / 1024
    ).toFixed(1)} MB`;
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
      {/* BACK BUTTON */}

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

      {/* HEADER */}

      <Text style={styles.title}>
        {subject.name} Files
      </Text>

      <Text style={styles.subtitle}>
        Organize study resources.
      </Text>

      {/* UPLOAD BUTTON */}

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={pickFile}
        activeOpacity={0.9}
      >
        <Ionicons
          name="cloud-upload-outline"
          size={24}
          color="#FFFFFF"
        />

        <Text
          style={
            styles.uploadButtonText
          }
        >
          Upload File
        </Text>
      </TouchableOpacity>

      {/* FILES */}

      {files.length === 0 ? (
        <View
          style={styles.emptyCard}
        >
          <Ionicons
            name="folder-open-outline"
            size={70}
            color="#CBD5E1"
          />

          <Text
            style={styles.emptyTitle}
          >
            No Files Yet
          </Text>

          <Text
            style={styles.emptyText}
          >
            Upload PDFs, reviewers,
            or study resources.
          </Text>
        </View>
      ) : (
        files.map((file) => (
          <View
            key={file.id}
            style={styles.fileCard}
          >
            {/* FILE INFO */}

            <View
              style={
                styles.fileLeft
              }
            >
              <View
                style={
                  styles.fileIcon
                }
              >
                <Ionicons
                  name="document-outline"
                  size={26}
                  color="#F97316"
                />
              </View>

              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={
                    styles.fileName
                  }
                  numberOfLines={
                    1
                  }
                >
                  {file.name}
                </Text>

                <Text
                  style={
                    styles.fileMeta
                  }
                >
                  {formatSize(
                    file.size
                  )}
                </Text>

                <Text
                  style={
                    styles.fileDate
                  }
                >
                  {
                    file.createdAt
                  }
                </Text>
              </View>
            </View>

            {/* DELETE */}

            <TouchableOpacity
              onPress={() =>
                deleteFile(
                  file.id
                )
              }
            >
              <Ionicons
                name="trash-outline"
                size={24}
                color="#EF4444"
              />
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#F8FAFC',
      paddingTop: 60,
      paddingHorizontal: 20,
    },

    backButton: {
      width: 50,
      height: 50,
      borderRadius: 18,

      backgroundColor:
        '#FFFFFF',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginBottom: 24,

      shadowColor: '#000',

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.05,

      shadowRadius: 10,

      elevation: 4,
    },

    title: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#0F172A',
    },

    subtitle: {
      marginTop: 8,
      marginBottom: 28,

      fontSize: 16,
      color: '#64748B',
    },

    uploadButton: {
      backgroundColor:
        '#2563EB',

      borderRadius: 24,

      paddingVertical: 20,

      justifyContent:
        'center',

      alignItems:
        'center',

      flexDirection:
        'row',

      marginBottom: 28,
    },

    uploadButtonText: {
      marginLeft: 12,

      color: '#FFFFFF',

      fontSize: 18,

      fontWeight: 'bold',
    },

    emptyCard: {
      backgroundColor:
        '#FFFFFF',

      borderRadius: 28,

      padding: 40,

      alignItems:
        'center',
    },

    emptyTitle: {
      marginTop: 18,

      fontSize: 22,

      fontWeight: 'bold',

      color: '#0F172A',
    },

    emptyText: {
      marginTop: 10,

      textAlign:
        'center',

      color: '#64748B',

      lineHeight: 22,
    },

    fileCard: {
      backgroundColor:
        '#FFFFFF',

      borderRadius: 24,

      padding: 18,

      marginBottom: 16,

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      shadowColor: '#000',

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.05,

      shadowRadius: 10,

      elevation: 4,
    },

    fileLeft: {
      flex: 1,

      flexDirection: 'row',

      alignItems: 'center',
    },

    fileIcon: {
      width: 58,
      height: 58,

      borderRadius: 20,

      backgroundColor:
        '#FFF7ED',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight: 16,
    },

    fileName: {
      fontSize: 17,

      fontWeight: 'bold',

      color: '#0F172A',
    },

    fileMeta: {
      marginTop: 5,

      color: '#64748B',
    },

    fileDate: {
      marginTop: 4,

      fontSize: 12,

      color: '#94A3B8',
    },
  });