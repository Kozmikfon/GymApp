import React, { useCallback, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import YoutubePlayer from 'react-native-youtube-iframe';
//import { CircleTimer } from '../../Extensions/CircleTimer';
import { CompletedExercise } from '../../Interfaces/Props/CompletedExercise';
import auth from '@react-native-firebase/auth'

export const ExerciseDetail = ({ route }: Props) => {
  const { exercise } = route.params;
  
  const [exerciseDetail,setExerciseDetail] = useState<CompletedExercise>({
    uid:'',
    currentDate:'',
    exerciseId:exercise.id,
    email:auth().currentUser?.email || '',
  });
  const onChangeState = useCallback((state:string) => {
    if (state === "ended") {
      
    }
  }, []);


  // { text: "30 dakika", icon: "clock-time-three" },
  // { text: "1 saat", icon: "clock-time-six" },
  // { text: "1.5 saat ve üzeri", icon: "clock-time-nine" }


  const findDuration = (duration: string) => {
    let minutes = 0;

    if (duration.includes('30')) {
      minutes = 30; // 30 minutes
    }
    else if (duration.includes('1 saat')) {
      minutes = 60; // 60 minutes
    }
    else if (duration.includes('1.5')) {
      minutes = 90; // 90 minutes
    }
    
    return minutes * 60; // Convert minutes to seconds for CircleTimer
  }

  const videoPlayer = ({videoUrl}:{videoUrl:string}) =>  (
      <View>
        <YoutubePlayer height={200} videoId={videoUrl.split('?v=')[1]} play={true} onChangeState={onChangeState} ></YoutubePlayer>
      </View>
    )
 




  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header Image */}
        {/* <Image
          source={{ uri: exercise.imageUrl }}
          style={styles.exerciseImage}
        /> */}

        {
          exercise.videoUrl && videoPlayer({videoUrl:exercise.videoUrl})
        }

        {/* Exercise Info Card */}
        <LinearGradient
          colors={['#4CAF50', '#2E7D32']}
          style={styles.infoCard}
        >
          <Text style={styles.title}>{exercise.name}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="clock-outline" size={24} color="#fff" />
              <Text style={styles.statText}>{exercise.timeRequired}</Text>
            </View>
          
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="weight-lifter" size={24} color="#fff" />
              <Text style={styles.statText}>{exercise.exerciseGoal}</Text>
            </View>
          </View>
        </LinearGradient>

       
      </ScrollView>
        
      {/* Start Button */}
  
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  exerciseImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  infoCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statText: {
    color: '#fff',
    marginTop: 4,
    fontSize: 16,
  },
  instructionsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 24,
    height: 24,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    color: '#fff',
    textAlign: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});