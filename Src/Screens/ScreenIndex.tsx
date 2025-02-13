import React, {useEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';

interface Option {
  text: string;
  icon: string;
}

interface Question {
  title: string;
  question: string;
  options: Option[];
}

interface Answers {
  [key: number]: string;
}

const questions: Question[] = [
  {
    title: 'spor seviyesi',
    question: 'spor konusunda kendinizi hangi seviyede görüyorsunuz?',
    options: [
      {
        text: 'Başlangıç',
        icon: 'weight-lifter',
      },
      {
        text: 'Orta',
        icon: 'arm-flex',
      },
      {
        text: 'İleri',
        icon: 'arm-flex-outline',
      },
    ],
  },
  {
    title: 'Hedef Belirleme',
    question: 'Spor yapma hedefiniz nedir?',
    options: [
      {
        text: 'Kilo vermek',
        icon: 'scale-bathroom',
      },
      {
        text: 'Kas yapmak',
        icon: 'muscle',
      },
      {
        text: 'Sağlıklı yaşam',
        icon: 'heart-pulse',
      },
    ],
  },
  {
    title: 'Zaman Planlama',
    question: 'Günlük spora ne kadar zaman ayırıyorsunuz?',
    options: [
      {
        text: '30 dakika',
        icon: 'clock-time-three',
      },
      {
        text: '1 saat',
        icon: 'clock-time-six',
      },
      {
        text: '1 saatten fazla',
        icon: 'clock-time-nine',
      },
    ],
  },
];

export const ScreenIndex = () => {
  //const navigation = useNavigation();
  const [answers, setAnswers] = useState<Answers>({});
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);

  useEffect(() => {
    //firebase entegrasyonu
  }, []);

  // firebase bağlantısı
  const saveAnswerToFirestore = async (answers: Answers) => {
    try {
      const answersCollection = Object.entries(answers).map(([key, value]) => ({
        question: questions[parseInt(key)].question,
        answer: value,
      }));

      const docRef = await firestore()
        .collection('answers')
        .add({answers: answersCollection});
      console.log('trigger docRef', docRef.id);
      return true;
    } catch (error) {
      console.log('error while saving answers', error);
      return false;
    }
  };

  const handleAnswer = async (answer: string) => {
    //soruları getirecek yapı
    const newAnswers = {...answers, [currentQuestion]: answer};
    setAnswers(newAnswers);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      //firebase entegrasyonu
      try {
        const response = await saveAnswerToFirestore(newAnswers);
        console.log('trigger response', response);
        if (response) {
          Alert.alert('Cevaplarınız kaydedildi');
        } else {
          Alert.alert('Cevaplarınız kaydedilirken hata oluştu.');
        }
      } catch (error) {
        console.log('error while saving answers', error);
        Alert.alert('Bir hata oluştu');
      }
    }
  };

  return (
    <LinearGradient colors={['#1a2a6c', '#b21f1f']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progress,
                {width: `${((currentQuestion + 1) * 100) / questions.length}%`},
              ]}
            />
          </View>
          <Text style={styles.counter}>
            {currentQuestion + 1}/{questions.length}
          </Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{questions[currentQuestion].title}</Text>
          <Text style={styles.questionText}>
            {' '}
            {questions[currentQuestion].question}{' '}
          </Text>

          <View style={styles.optionsContainer}>
            {questions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                onPress={() => handleAnswer(option.text)}
                key={index}>
                <LinearGradient
                  colors={['#FF6B6B', '#FF6B6B']}
                  style={[styles.optionGradient, styles.optionButton]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  key={index}>
                  <Text
                    style={[
                      styles.optionText,
                      answers[currentQuestion] === option.text &&
                        styles.selectedOptionText,
                    ]}>
                    {option.text}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  progressContainer: {
    padding: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
  },
  progress: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 3,
  },
  counter: {
    textAlign: 'right',
    marginTop: 8,
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 15,
  },
  optionButton: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingHorizontal: 25,
  },
  optionText: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 15,
    fontWeight: '600',
  },
  selectedOptionText: {
    color: '#fff',
  },
  selectedOption: {
    backgroundColor: 'transparent',
  },
});
