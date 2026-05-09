import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ionicons } from '@expo/vector-icons';

import {
  saveActivity,
} from '../../services/activityService';

export default function SubjectNotesScreen({
  route,
  navigation,
}) {
  const { subject } = route.params;

  const [notes, setNotes] =
    useState([]);

  const [modalVisible,
    setModalVisible] =
    useState(false);

  const [noteTitle,
    setNoteTitle] =
    useState('');

  const [noteContent,
    setNoteContent] =
    useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  // LOAD NOTES

  const loadNotes = async () => {
    try {
      const storedNotes =
        await AsyncStorage.getItem(
          `notes_${subject.id}`
        );

      if (storedNotes) {
        setNotes(
          JSON.parse(
            storedNotes
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // SAVE NOTES

  const saveNotes = async (
    updatedNotes
  ) => {
    try {
      await AsyncStorage.setItem(
        `notes_${subject.id}`,
        JSON.stringify(
          updatedNotes
        )
      );

      setNotes(updatedNotes);
    } catch (error) {
      console.log(error);
    }
  };

  // CREATE NOTE

  const createNote = async () => {
    if (
      noteTitle.trim() === '' ||
      noteContent.trim() === ''
    ) {
      return;
    }

    const newNote = {
      id: Date.now().toString(),

      title: noteTitle,

      content: noteContent,

      createdAt:
        new Date().toLocaleDateString(),
    };

    const updatedNotes = [
      newNote,
      ...notes,
    ];

    await saveNotes(
      updatedNotes
    );

    await saveActivity(
      subject.id,
      'note',
      noteTitle
    );

    setNoteTitle('');
    setNoteContent('');

    setModalVisible(false);
  };

  // DELETE NOTE

  const deleteNote = async (
    id
  ) => {
    const updatedNotes =
      notes.filter(
        (note) =>
          note.id !== id
      );

    await saveNotes(
      updatedNotes
    );
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* BACK */}

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
          {subject.name} Notes
        </Text>

        <Text
          style={styles.subtitle}
        >
          Save your reviewers and
          summaries.
        </Text>

        {/* CREATE BUTTON */}

        <TouchableOpacity
          style={[
            styles.createButton,
            {
              backgroundColor:
                subject.color,
            },
          ]}
          onPress={() =>
            setModalVisible(true)
          }
        >
          <Ionicons
            name="add"
            size={24}
            color="#fff"
          />

          <Text
            style={
              styles.createButtonText
            }
          >
            Create Note
          </Text>
        </TouchableOpacity>

        {/* NOTES */}

        {notes.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons
              name="document-text-outline"
              size={60}
              color="#CBD5E1"
            />

            <Text
              style={styles.emptyTitle}
            >
              No Notes Yet
            </Text>

            <Text
              style={styles.emptyText}
            >
              Create your first study
              note.
            </Text>
          </View>
        ) : (
          notes.map((note) => (
            <View
              key={note.id}
              style={styles.noteCard}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={
                    styles.noteTitle
                  }
                >
                  {note.title}
                </Text>

                <Text
                  style={
                    styles.noteContent
                  }
                  numberOfLines={3}
                >
                  {note.content}
                </Text>

                <Text
                  style={
                    styles.noteDate
                  }
                >
                  {note.createdAt}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() =>
                  deleteNote(
                    note.id
                  )
                }
              >
                <Ionicons
                  name="trash-outline"
                  size={22}
                  color="#EF4444"
                />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* MODAL */}

      <Modal
        visible={modalVisible}
        animationType="slide"
      >
        <View
          style={styles.modalContainer}
        >
          {/* TOP */}

          <View
            style={styles.modalTop}
          >
            <TouchableOpacity
              onPress={() =>
                setModalVisible(
                  false
                )
              }
            >
              <Ionicons
                name="close"
                size={28}
                color="#0F172A"
              />
            </TouchableOpacity>

            <Text
              style={
                styles.modalTitle
              }
            >
              New Note
            </Text>

            <TouchableOpacity
              onPress={
                createNote
              }
            >
              <Text
                style={
                  styles.saveText
                }
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>

          {/* INPUTS */}

          <TextInput
            placeholder="Note title"
            placeholderTextColor="#94A3B8"
            value={noteTitle}
            onChangeText={
              setNoteTitle
            }
            style={
              styles.titleInput
            }
          />

          <TextInput
            placeholder="Write your notes here..."
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            value={noteContent}
            onChangeText={
              setNoteContent
            }
            style={
              styles.contentInput
            }
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  backButton: {
    width: 52,
    height: 52,
    borderRadius: 18,

    backgroundColor: '#FFFFFF',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 26,

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
    fontSize: 40,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  subtitle: {
    marginTop: 10,
    fontSize: 17,
    color: '#64748B',
    marginBottom: 28,
  },

  createButton: {
    height: 64,
    borderRadius: 24,

    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 20,
  },

  createButtonText: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',

    borderRadius: 30,

    padding: 40,

    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  emptyText: {
    marginTop: 8,
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
  },

  noteCard: {
    backgroundColor: '#FFFFFF',

    borderRadius: 28,

    padding: 22,

    marginBottom: 16,

    flexDirection: 'row',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 4,
  },

  noteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  noteContent: {
    marginTop: 10,
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
    marginRight: 16,
  },

  noteDate: {
    marginTop: 16,
    color: '#94A3B8',
    fontSize: 13,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  modalTop: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'center',

    marginBottom: 30,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  saveText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },

  titleInput: {
    backgroundColor: '#FFFFFF',

    borderRadius: 22,

    paddingHorizontal: 20,
    paddingVertical: 18,

    fontSize: 18,

    marginBottom: 18,

    color: '#0F172A',
  },

  contentInput: {
    backgroundColor: '#FFFFFF',

    borderRadius: 22,

    paddingHorizontal: 20,
    paddingTop: 20,

    fontSize: 16,

    color: '#0F172A',

    height: 350,
  },
});