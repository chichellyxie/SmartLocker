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
  FlatList,
  Modal,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ionicons } from '@expo/vector-icons';

import {
  saveActivity,
} from '../../services/activityService';

export default function SubjectFlashcardsScreen({
  route,
  navigation,
}) {
  const { subject } = route.params;

  const [flashcards,
    setFlashcards] =
    useState([]);

  const [question,
    setQuestion] =
    useState('');

  const [answer,
    setAnswer] =
    useState('');

  const [modalVisible,
    setModalVisible] =
    useState(false);

  const [selectedCard,
    setSelectedCard] =
    useState(null);

  useEffect(() => {
    loadFlashcards();
  }, []);

  // LOAD FLASHCARDS

  const loadFlashcards =
    async () => {
      try {
        const storedFlashcards =
          await AsyncStorage.getItem(
            `flashcards_${subject.id}`
          );

        if (
          storedFlashcards
        ) {
          setFlashcards(
            JSON.parse(
              storedFlashcards
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

  // SAVE FLASHCARDS

  const saveFlashcards =
    async (updatedFlashcards) => {
      try {
        await AsyncStorage.setItem(
          `flashcards_${subject.id}`,
          JSON.stringify(
            updatedFlashcards
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

  // ADD FLASHCARD

  const addFlashcard =
    async () => {
      if (
        question.trim() === '' ||
        answer.trim() === ''
      ) {
        return;
      }

      const newFlashcard = {
        id: Date.now().toString(),
        question,
        answer,
      };

      const updatedFlashcards =
        [
          newFlashcard,
          ...flashcards,
        ];

      setFlashcards(
        updatedFlashcards
      );

      saveFlashcards(
        updatedFlashcards
      );

      // SAVE ACTIVITY

      saveActivity(
        subject.id,
        'flashcard',
        question
      );

      setQuestion('');
      setAnswer('');
    };

  // DELETE FLASHCARD

  const deleteFlashcard =
    async (id) => {
      const updatedFlashcards =
        flashcards.filter(
          (card) =>
            card.id !== id
        );

      setFlashcards(
        updatedFlashcards
      );

      saveFlashcards(
        updatedFlashcards
      );
    };

  // OPEN CARD

  const openCard = (card) => {
    setSelectedCard(card);

    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
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

      {/* TITLE */}

      <Text style={styles.title}>
        {subject.name} Flashcards
      </Text>

      <Text style={styles.subtitle}>
        Practice memory and recall.
      </Text>

      {/* INPUT AREA */}

      <View style={styles.inputCard}>
        <TextInput
          placeholder="Question"
          value={question}
          onChangeText={
            setQuestion
          }
          style={styles.input}
          placeholderTextColor="#94A3B8"
        />

        <TextInput
          placeholder="Answer"
          value={answer}
          onChangeText={
            setAnswer
          }
          style={[
            styles.input,
            {
              marginTop: 12,
            },
          ]}
          placeholderTextColor="#94A3B8"
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={
            addFlashcard
          }
        >
          <Ionicons
            name="add"
            size={24}
            color="#fff"
          />

          <Text
            style={
              styles.addButtonText
            }
          >
            Add Flashcard
          </Text>
        </TouchableOpacity>
      </View>

      {/* FLASHCARDS */}

      <FlatList
        data={flashcards}
        keyExtractor={(item) =>
          item.id
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 140,
        }}
        renderItem={({
          item,
        }) => (
          <TouchableOpacity
            style={
              styles.flashcard
            }
            activeOpacity={0.9}
            onPress={() =>
              openCard(item)
            }
          >
            <View
              style={
                styles.flashcardIcon
              }
            >
              <Ionicons
                name="albums-outline"
                size={24}
                color="#7C3AED"
              />
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={
                  styles.questionText
                }
              >
                {item.question}
              </Text>

              <Text
                style={
                  styles.answerPreview
                }
              >
                Tap to reveal
                answer
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                deleteFlashcard(
                  item.id
                )
              }
            >
              <Ionicons
                name="trash-outline"
                size={22}
                color="#EF4444"
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      {/* MODAL */}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
      >
        <View
          style={styles.modalOverlay}
        >
          <View
            style={styles.modalCard}
          >
            <Text
              style={
                styles.modalQuestion
              }
            >
              {
                selectedCard?.question
              }
            </Text>

            <View
              style={
                styles.answerBox
              }
            >
              <Text
                style={
                  styles.modalAnswer
                }
              >
                {
                  selectedCard?.answer
                }
              </Text>
            </View>

            <TouchableOpacity
              style={
                styles.closeButton
              }
              onPress={() =>
                setModalVisible(
                  false
                )
              }
            >
              <Text
                style={
                  styles.closeButtonText
                }
              >
                Close
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
    backgroundColor: '#F8FAFC',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  backButton: {
    width: 50,
    height: 50,
    borderRadius: 18,

    backgroundColor: '#FFFFFF',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 5,
  },

  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    color: '#64748B',
    fontSize: 16,
  },

  inputCard: {
    backgroundColor: '#FFFFFF',

    borderRadius: 28,

    padding: 20,

    marginBottom: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 5,
  },

  input: {
    backgroundColor: '#F1F5F9',

    borderRadius: 18,

    paddingHorizontal: 18,
    paddingVertical: 18,

    fontSize: 16,
    color: '#0F172A',
  },

  addButton: {
    backgroundColor: '#7C3AED',

    borderRadius: 22,

    marginTop: 18,

    paddingVertical: 18,

    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',
  },

  addButtonText: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  flashcard: {
    backgroundColor: '#FFFFFF',

    borderRadius: 24,

    padding: 18,

    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 14,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 4,
  },

  flashcardIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,

    backgroundColor: '#F5F3FF',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 16,
  },

  questionText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  answerPreview: {
    marginTop: 6,
    color: '#64748B',
  },

  modalOverlay: {
    flex: 1,

    backgroundColor:
      'rgba(0,0,0,0.45)',

    justifyContent: 'center',
    alignItems: 'center',

    padding: 24,
  },

  modalCard: {
    width: '100%',

    backgroundColor: '#FFFFFF',

    borderRadius: 30,

    padding: 28,
  },

  modalQuestion: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F172A',

    textAlign: 'center',
  },

  answerBox: {
    backgroundColor: '#F8FAFC',

    borderRadius: 24,

    padding: 24,

    marginTop: 24,
  },

  modalAnswer: {
    fontSize: 18,
    color: '#334155',

    textAlign: 'center',
    lineHeight: 28,
  },

  closeButton: {
    backgroundColor: '#7C3AED',

    borderRadius: 22,

    paddingVertical: 18,

    marginTop: 28,

    alignItems: 'center',
  },

  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});