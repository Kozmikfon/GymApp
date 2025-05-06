import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import {  getFilteredExercises, getUserSurveyResults } from '../Utils/firebase';
import { FlatList } from 'react-native-gesture-handler';
import { Exercise } from '../Interfaces/Props/Exercise';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../Interfaces/Naw/RootStackParamList';

export const Home = () => {
  const [exercises,setExercises] = React.useState<Exercise[]>([]); 
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  useEffect(()=>{
    const userEmail = auth().currentUser?.email;
    getFilteredExercises(userEmail || '').then((results) => {
      setExercises(results);
    })
  },[])




  return (
    <>
      {/* Welcome Section */}
      <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.header}>
        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.dateText}>{new Date().toDateString()}</Text>
      </LinearGradient>

      {/* Daily Progress */}
      <View style={styles.progressContainer}>
        <Text style={styles.sectionTitle}>Today's Progress</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>3/5</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>320</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
        </View>
      </View>

      {/* Workout Categories */}
      <View style={styles.workoutsContainer}>
        <Text style={styles.sectionTitle}>Workouts</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Strength', 'Cardio', 'Flexibility', 'HIIT'].map((category) => (
            <TouchableOpacity key={category} style={styles.categoryButton} onPress={()=>navigation.navigate('SubscriptionPage')} >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity style={flatListStyles.exerciseCard} 
                onPress={() => navigation.navigate('ExerciseDetail',{exercise:item})}
              
              > 
                <LinearGradient colors={['#4CAF50', '#2E7D32']} style={flatListStyles.packageBadge} >
                  <Text style={flatListStyles.packageText}>{item.package}</Text>
                </LinearGradient>
                {
                  item.imageUrl && (
                    <Image style={flatListStyles.exerciseImage} source={{uri:item.imageUrl}} />
                  )
                }
                <Text style={flatListStyles.exerciseName}>{item.name}</Text>
                <Text style={flatListStyles.exerciseDesc}>{item.description}</Text>
                <View style={flatListStyles.detailsContainer}>
                  <View style={flatListStyles.detailItem}>
                    <Text style={flatListStyles.detailLabel}>Fitness Level</Text>
                    <Text style={flatListStyles.detailValue}>{item.fitnessLevel}</Text>
                  </View>
                  <View style={flatListStyles.detailItem}>
                    <Text style={flatListStyles.detailLabel}>Exercise Goal</Text>
                    <Text style={flatListStyles.detailValue}>{item.exerciseGoal}</Text>
                  </View>
                  <View style={flatListStyles.detailItem}>
                    <Text style={flatListStyles.detailLabel}>Time</Text>
                    <Text style={flatListStyles.detailValue}>{item.timeRequired}</Text>
                  </View>
                  </View>
              </TouchableOpacity>
            )}
          >

          </FlatList>
          </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  dateText: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  progressContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  workoutsContainer: {
    padding: 20,
  },
  categoryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  recentWorkouts: {
    padding: 20,
  },
  workoutCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

const flatListStyles = StyleSheet.create({
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