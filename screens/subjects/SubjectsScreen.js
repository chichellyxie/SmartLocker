import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ionicons } from '@expo/vector-icons';

const COLORS = [
  '#C4B5FD',
  '#93C5FD',
  '#86EFAC',
  '#FDE68A',
  '#FCA5A5',
  '#FDBA74',
];

export default function SubjectsScreen({
  navigation,
}) {
  const [subjects, setSubjects] =
    useState([]);

  const [modalVisible, setModalVisible] =
    useState(false);

  const [subjectName, setSubjectName] =
    useState('');

  const [selectedColor, setSelectedColor] =
    useState(COLORS[0]);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const storedSubjects =
        await AsyncStorage.getItem(
          'subjects'
        );

      if (storedSubjects) {
        const parsedSubjects =
          JSON.parse(storedSubjects);

        const updatedSubjects =
          await Promise.all(
            parsedSubjects.map(
              async (subject) => {
                const storedTasks =
                  await AsyncStorage.getItem(
                    `tasks_${subject.id}`
                  );

                const storedNotes =
                  await AsyncStorage.getItem(
                    `notes_${subject.id}`
                  );

                const storedFiles =
                  await AsyncStorage.getItem(
                    `files_${subject.id}`
                  );

                return {
                  ...subject,

                  taskCount:
                    storedTasks
                      ? JSON.parse(
                          storedTasks
                        ).length
                      : 0,

                  noteCount:
                    storedNotes
                      ? JSON.parse(
                          storedNotes
                        ).length
                      : 0,

                  fileCount:
                    storedFiles
                      ? JSON.parse(
                          storedFiles
                        ).length
                      : 0,
                };
              }
            )
          );

        setSubjects(updatedSubjects);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveSubjects = async (
    updatedSubjects
  ) => {
    try {
      await AsyncStorage.setItem(
        'subjects',
        JSON.stringify(updatedSubjects)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const createSubject = async () => {
    if (!subjectName.trim()) {
      Alert.alert(
        'Missing Subject',
        'Please enter subject name.'
      );

      return;
    }

    const newSubject = {
      id: Date.now().toString(),
      name: subjectName,
      color: selectedColor,
    };

    const updatedSubjects = [
      ...subjects,
      newSubject,
    ];

    setSubjects(updatedSubjects);

    await saveSubjects(updatedSubjects);

    setSubjectName('');
    setSelectedColor(COLORS[0]);

    setModalVisible(false);
  };

  const deleteSubject = async (id) => {
  try {
    const updatedSubjects =
      subjects.filter(
        (subject) =>
          subject.id !== id
      );

    setSubjects(updatedSubjects);

    await AsyncStorage.setItem(
      'subjects',
      JSON.stringify(updatedSubjects)
    );

    Alert.alert(
      'Deleted',
      'Subject deleted successfully.'
    );
  } catch (error) {
    console.log(error);
  }
};

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <Text style={styles.title}>
        Subjects
      </Text>

      <Text style={styles.subtitle}>
        Organize your academic
        workspace.
      </Text>

      {/* SUBJECT LIST */}

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        {subjects.length === 0 ? (
  <View style={styles.emptyCard}>
    <Ionicons
      name="folder-open-outline"
      size={70}
      color="#CBD5E1"
    />

    <Text style={styles.emptyTitle}>
      No Subjects Yet
    </Text>

    <Text style={styles.emptyText}>
      Create your first academic subject.
    </Text>
  </View>
) : (
  subjects.map((subject) => (
    <View
      key={subject.id}
      style={[
        styles.subjectCard,
        {
          backgroundColor:
            subject.color,
        },
      ]}
    >
      {/* DELETE BUTTON */}

      <View
        style={{
          flexDirection: 'row',
          justifyContent:
            'space-between',
          alignItems: 'center',
        }}
      >
        <View style={styles.folderIcon}>
          <Ionicons
            name="folder"
            size={28}
            color="#0F172A"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            deleteSubject(subject.id)
          }
          style={{
            padding: 10,
            zIndex: 999,
          }}
        >
          <Ionicons
            name="trash-outline"
            size={24}
            color="#334155"
          />
        </TouchableOpacity>
      </View>

      {/* OPEN SUBJECT */}

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate(
            'SubjectDetails',
            {
              subject,
            }
          )
        }
      >
        <Text style={styles.subjectName}>
          {subject.name}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statBadge}>
            <Text style={styles.statText}>
              {subject.taskCount} Tasks
            </Text>
          </View>

          <View style={styles.statBadge}>
            <Text style={styles.statText}>
              {subject.noteCount} Notes
            </Text>
          </View>

          <View style={styles.statBadge}>
            <Text style={styles.statText}>
              {subject.fileCount} Files
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  ))
)}
      </ScrollView>

      {/* FLOATING BUTTON */}

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          setModalVisible(true)
        }
      >
        <Ionicons
          name="add"
          size={32}
          color="#fff"
        />
      </TouchableOpacity>

      {/* MODAL */}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
      >
        <View
          style={styles.modalOverlay}
        >
          <View
            style={
              styles.modalContainer
            }
          >
            <Text
              style={styles.modalTitle}
            >
              Create Subject
            </Text>

            <TextInput
              placeholder="Subject Name"
              value={subjectName}
              onChangeText={
                setSubjectName
              }
              style={styles.input}
            />

            <Text
              style={styles.colorLabel}
            >
              Choose Color
            </Text>

            <View
              style={
                styles.colorRow
              }
            >
              {COLORS.map(
                (color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorCircle,
                      {
                        backgroundColor:
                          color,

                        borderWidth:
                          selectedColor ===
                          color
                            ? 3
                            : 0,
                      },
                    ]}
                    onPress={() =>
                      setSelectedColor(
                        color
                      )
                    }
                  />
                )
              )}
            </View>

            <TouchableOpacity
              style={
                styles.createButton
              }
              onPress={
                createSubject
              }
            >
              <Text
                style={
                  styles.createButtonText
                }
              >
                Create Subject
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setModalVisible(false)
              }
            >
              <Text
                style={
                  styles.cancelText
                }
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 30,
  },

  subjectCard: {
    borderRadius: 30,
    padding: 24,
    marginBottom: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 5,
  },

  subjectTop: {
    flexDirection: 'row',
    justifyContent:
      'space-between',

    alignItems: 'center',
    marginBottom: 40,
  },

  folderIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,

    backgroundColor:
      'rgba(255,255,255,0.35)',

    justifyContent: 'center',
    alignItems: 'center',
  },

  subjectName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 18,
  },

  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  statBadge: {
    backgroundColor:
      'rgba(255,255,255,0.45)',

    borderRadius: 16,

    paddingVertical: 8,
    paddingHorizontal: 14,

    marginRight: 10,
    marginBottom: 10,
  },

  statText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 13,
  },

  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 40,
    alignItems: 'center',
    marginTop: 60,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 20,
  },

  emptyText: {
    marginTop: 10,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },

  fab: {
    position: 'absolute',

    right: 25,
    bottom: 35,

    width: 70,
    height: 70,
    borderRadius: 35,

    backgroundColor: '#2563EB',

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.2,
    shadowRadius: 8,

    elevation: 8,
  },

  modalOverlay: {
    flex: 1,

    backgroundColor:
      'rgba(0,0,0,0.4)',

    justifyContent: 'center',
    padding: 20,
  },

  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 25,
  },

  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#0F172A',
  },

  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 18,
    padding: 18,
    fontSize: 16,
    marginBottom: 20,
  },

  colorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16,
  },

  colorRow: {
    flexDirection: 'row',
    marginBottom: 30,
  },

  colorCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
    borderColor: '#0F172A',
  },

  createButton: {
    backgroundColor: '#2563EB',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
  },

  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  cancelText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 16,
  },
});