import React, { useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { getFilteredExercises, getUserSurveyResults } from "../Utils/firebase";
import auth from '@react-native-firebase/auth';
import { FlatList } from "react-native-gesture-handler";
import { Exercise } from "../interfaces/Props/Exercise";
import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";
import { Image } from "react-native-reanimated/lib/typescript/Animated";


export const Home = () => {
  const [exercises,setExercises]=React.useState<Exercise[]>([]);

  useEffect(() => {
    const userEmail=auth().currentUser?.email
    getFilteredExercises(userEmail || '').then((results) => {
      console.log('trigger Results:', results);
      setExercises(results);
    })
  }, [])

  const workoutCategories = ["Strength", "Cardio", "Flexibility", "HIIT", "Yoga", "Pilates",];

  return (
    <ScrollView>
    <View style={styles.container}>
      {/* Üst Bölüm */}
      <LinearGradient colors={["#2E7D32", "#4CAF50"]} style={styles.header}>
        <Text style={styles.headerText}>Welcome Back!</Text>
        <Text style={styles.dateText}>Thu Jan 16 2025</Text>
      </LinearGradient>

      {/* Günlük İlerleme */}
      <View style={styles.progressSection}>
        <View style={styles.progressBox}>
          <Text style={styles.progressNumber}>3/5</Text>
          <Text style={styles.progressLabel}>Workouts</Text>
        </View>
        <View style={styles.progressBox}>
          <Text style={styles.progressNumber}>320</Text>
          <Text style={styles.progressLabel}>Calories</Text>
        </View>
        <View style={styles.progressBox}>
          <Text style={styles.progressNumber}>45</Text>
          <Text style={styles.progressLabel}>Minutes</Text>
        </View>
      </View>

      {/* Antrenman Türleri */}
      <View style={styles.workoutSection}>
        <Text style={styles.workoutTitle}>Workouts</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
          {workoutCategories.map((item) => (
            <View key={item} style={styles.workoutTag}>
              <Text style={styles.workoutTagText}>{item}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>

          <FlatList
          data={exercises}
          keyExtractor={(item)=> item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity style={flatListStyle.exerciseCard}>
              <LinearGradient colors= {['#4CAF50','#2E7D32']} style={flatListStyle.packageBadge}>
                <Text style={flatListStyle.packageText}>{item.package}</Text>
              </LinearGradient>
              {
              item.imageUrl && (
                <Image ></Image>
              )
              }
              

            </TouchableOpacity>
  )} >

          </FlatList>

  </ScrollView>
  );
};

// Stil Dosyası
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  dateText: {
    fontSize: 14,
    color: "white",
  },
  progressSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  progressBox: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  progressNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  progressLabel: {
    fontSize: 14,
    color: "#666",
  },
  workoutSection: {
    marginTop: 20,
    padding: 10,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollViewContent: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  workoutTag: {
    backgroundColor: "#2e7d32",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  workoutTagText: {
    color: "white",
    fontWeight: "bold",
  },
});

const flatListStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  exerciseCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
    overflow: 'visible', // overflow'u visible yapıyoruz
  },
  packageBadge: {
    position: 'absolute',
    right: 16,
    top: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1, // Z-index eklendi
    elevation: 5, // Android için elevation eklendi
  },
  packageText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  exerciseImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    zIndex: 0, // Resmin z-index'ini düşük tutuyoruz
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  exerciseDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default Home;
