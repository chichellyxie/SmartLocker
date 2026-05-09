import { useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';

export default function FlashcardScreen() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [cards, setCards] = useState([]);

  const [selectedCard, setSelectedCard] =
    useState(null);

  const [showAnswer, setShowAnswer] =
    useState(false);

  // LOAD FLASHCARDS

  useEffect(() => {
    loadCards();
  }, []);

  // SAVE FLASHCARDS

  useEffect(() => {
    saveCards();
  }, [cards]);

  const saveCards = async () => {
    try {
      await AsyncStorage.setItem(
        'smartlocker_flashcards',
        JSON.stringify(cards)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const loadCards = async () => {
    try {
      const storedCards =
        await AsyncStorage.getItem(
          'smartlocker_flashcards'
        );

      if (storedCards !== null) {
        setCards(JSON.parse(storedCards));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ADD CARD

  const addCard = () => {
    if (
      question.trim() === '' ||
      answer.trim() === ''
    )
      return;

    const newCard = {
      id: Date.now().toString(),
      question,
      answer,
    };

    setCards([...cards, newCard]);

    setQuestion('');
    setAnswer('');
  };

  // OPEN CARD

  const openCard = (card) => {
    setSelectedCard(card);
    setShowAnswer(false);
  };

  // CLOSE CARD

  const closeCard = () => {
    setSelectedCard(null);
  };

  // DELETE CARD

  const deleteCard = (id) => {
    const filteredCards = cards.filter(
      (item) => item.id !== id
    );

    setCards(filteredCards);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F5F7FB',
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          marginBottom: 10,
        }}
      >
        Flashcards
      </Text>

      <Text
        style={{
          color: '#666',
          marginBottom: 25,
        }}
      >
        Create study flashcards for review.
      </Text>

      {/* INPUTS */}

      <TextInput
        placeholder="Question"
        value={question}
        onChangeText={setQuestion}
        style={{
          backgroundColor: '#fff',
          padding: 15,
          borderRadius: 14,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Answer"
        value={answer}
        onChangeText={setAnswer}
        style={{
          backgroundColor: '#fff',
          padding: 15,
          borderRadius: 14,
          marginBottom: 15,
        }}
      />

      {/* BUTTON */}

      <TouchableOpacity
        onPress={addCard}
        style={{
          backgroundColor: '#8B5CF6',
          padding: 16,
          borderRadius: 14,
          marginBottom: 25,
        }}
      >
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          Add Flashcard
        </Text>
      </TouchableOpacity>

      {/* EMPTY */}

      {cards.length === 0 ? (
        <View
          style={{
            backgroundColor: '#fff',
            padding: 30,
            borderRadius: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 8,
            }}
          >
            No Flashcards Yet
          </Text>

          <Text
            style={{
              color: '#777',
            }}
          >
            Create your first study card.
          </Text>
        </View>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: '#fff',
                padding: 20,
                borderRadius: 16,
                marginBottom: 14,
              }}
            >
              <TouchableOpacity
                onPress={() => openCard(item)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                >
                  {item.question}
                </Text>

                <Text
                  style={{
                    color: '#777',
                    marginTop: 5,
                  }}
                >
                  Tap to study
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  deleteCard(item.id)
                }
                style={{
                  marginTop: 15,
                }}
              >
                <Text
                  style={{
                    color: '#EF4444',
                    fontWeight: 'bold',
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* MODAL */}

      {selectedCard && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor:
              'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              width: '100%',
              borderRadius: 20,
              padding: 25,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                marginBottom: 20,
              }}
            >
              {selectedCard.question}
            </Text>

            {showAnswer ? (
              <Text
                style={{
                  fontSize: 18,
                  color: '#444',
                  marginBottom: 25,
                }}
              >
                {selectedCard.answer}
              </Text>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  setShowAnswer(true)
                }
                style={{
                  backgroundColor: '#8B5CF6',
                  padding: 15,
                  borderRadius: 14,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  Show Answer
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={closeCard}
              style={{
                backgroundColor: '#EF4444',
                padding: 15,
                borderRadius: 14,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}