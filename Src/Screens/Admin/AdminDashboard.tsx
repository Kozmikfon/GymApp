import React from 'react'
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Firestore from '@react-native-firebase/firestore';
import { create } from 'react-test-renderer';

interface ExerciseForm {
    name: string;
    description: string;
    imageUrl: string;
    videoUrl: string;
    fitnessLevel: string;
    exerciseGoal: string;
    timeRequired: string;
    package: string;
}





export const AdminDashboard = () => {
    const [exerciseForm, setExerciseForm] = React.useState<ExerciseForm>({
      name: '',
      description: '',
      imageUrl: '',
      videoUrl: '',
      fitnessLevel: '',
      exerciseGoal: '',
      timeRequired: '',
      package: '',
    });
    



    const fitnessLevels = ['Başlangıç', 'Orta', 'İleri'];
    const exerciseGoals = ['Kilo vermek', 'Kas yapmak', 'Formda kalmak'];
    const timeOptions = ['15 dakika', '30 dakika', '45 dakika', '1 saat'];
    const packageOptions = ['Bronz', 'Gold','Premium'];


    const saveExercise = async () => {
      try {
        if (!exerciseForm.name || !exerciseForm.description || !exerciseForm.imageUrl || !exerciseForm.videoUrl || !exerciseForm.fitnessLevel || !exerciseForm.exerciseGoal || !exerciseForm.timeRequired || !exerciseForm.package) {
          Alert.alert('Please fill in all fields');
          return;
        }

        await Firestore().collection('exercises').add({
          ...exerciseForm,
          createdAt: Firestore.FieldValue.serverTimestamp(),
          updatedAt: Firestore.FieldValue.serverTimestamp()
        })
        Alert.alert('Exercise saved successfully');
        
        
      } catch (error) {
        console.log(error);
        Alert.alert('Error while saving exercise');
      }
    }





  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Admin Panel - Egzersiz Ekle</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Egzersiz Adı"
            value={exerciseForm.name}
            onChangeText={(text) => setExerciseForm({...exerciseForm, name: text})}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Egzersiz Açıklaması"
            multiline
            numberOfLines={4}
            value={exerciseForm.description}
            onChangeText={(text) => setExerciseForm({...exerciseForm, description: text})}
          />

          <TextInput
            style={styles.input}
            placeholder="Resim URL"
            value={exerciseForm.imageUrl}
            onChangeText={(text) => setExerciseForm({...exerciseForm, imageUrl: text})}
          />

          <TextInput
            style={styles.input}
            placeholder="Video URL"
            value={exerciseForm.videoUrl}
            onChangeText={(text) => setExerciseForm({...exerciseForm, videoUrl: text})}
          />

          <Text style={styles.sectionTitle}>Fitness Seviyesi</Text>
          <View style={styles.optionsContainer}>
            {fitnessLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.optionButton,
                  exerciseForm.fitnessLevel === level && styles.selectedOption
                ]}
                onPress={() => setExerciseForm({...exerciseForm, fitnessLevel: level})}
              >
                <Text style={styles.optionText}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Egzersiz Hedefi</Text>
          <View style={styles.optionsContainer}>
            {exerciseGoals.map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.optionButton,
                  exerciseForm.exerciseGoal === goal && styles.selectedOption
                ]}
                onPress={() => setExerciseForm({...exerciseForm, exerciseGoal: goal})}
              >
                <Text style={styles.optionText}>{goal}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.sectionTitle}>Paket Tipi</Text>
          <View style={styles.optionsContainer}>
            {packageOptions.map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.optionButton,
                  exerciseForm.package === goal && styles.selectedOption
                ]}
                onPress={() => setExerciseForm({...exerciseForm, package: goal})}
              >
                <Text style={styles.optionText}>{goal}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.sectionTitle}>Gereken Süre</Text>
          <View style={styles.optionsContainer}>
            {timeOptions.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.optionButton,
                  exerciseForm.timeRequired === time && styles.selectedOption
                ]}
                onPress={() => setExerciseForm({...exerciseForm, timeRequired: time})}
              >
                <Text style={styles.optionText}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={saveExercise}>
            <Text style={styles.saveButtonText}>Egzersizi Kaydet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    scrollView: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
    },
    formContainer: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      marginBottom: 15,
      fontSize: 16,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 15,
      marginBottom: 10,
    },
    optionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 20,
    },
    optionButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: '#f0f0f0',
      borderWidth: 1,
      borderColor: '#ddd',
    },
    selectedOption: {
      backgroundColor: '#007AFF',
      borderColor: '#007AFF',
    },
    optionText: {
      color: '#333',
      fontSize: 14,
    },
    saveButton: {
      backgroundColor: '#007AFF',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    saveButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });