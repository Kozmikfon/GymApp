import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


export interface Exercise{
    id:string;
    name:string;
    description:string;
    imageUrl:string;
    videoUrl:string;
    fitnessLevel:string;
    exerciseGoal:string;
    timeRequired:string;
    package:string;
    createdAt:any;
    updateAt:any;
}

interface userSurveyAnswers{
  fitnesLevel:string;
  exerciseGoal:string;
  timeRequired:string;

}

export const getUserRoles = async ():Promise<string[]> => {
  try {
      const currentUser = auth().currentUser;
      if (!currentUser) {return []}
      const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
      if (!userDoc.exists) {return []}
      const userData = userDoc.data();
      if (!userData) {return []}
      const roles = userData.role;
      return roles;
  
  } catch (error) {
      console.error("Error while getting user roles",error)
      return [];
      
  }
}

export const checkUserSurveyExists = async (userEmail:string): Promise<boolean> => {
  try {

      var exists = false; 

      const querySnapshot = await firestore().collection('answers').get();
      querySnapshot.docs.map((answer,index) =>{
       
          if (answer.data().answers.email === userEmail) {
      // If the user has not filled the survey, return false
              exists = true;
              
          }
      } );
      return exists;
  } catch (error) {
      console.error("Error while checking user survey exists",error);
      return false;
  }


}
  
export const createUserInFirestore = async (
  uid: string,
  email: string,
  username: string,
) => {
  try {
    await firestore()
      .collection('users')
      .doc(uid)
      .set({
        uid,
        email,
        username: username || '',
        role: 'user',
        createdAt: firestore.FieldValue.serverTimestamp(),
        updateAt: firestore.FieldValue.serverTimestamp(),
      });
    console.log('user created firestore');
    return true;
  } catch (error) {
    console.log('error creating user in firestore');
    return false;
  }
}

export const getUserSurveyResults = async (userEmail:string) => {
  try {
    const surveySnapshoot= await firestore().collection('answers').where('answers.email','==',userEmail).get();
    console.log('trigger survey snapshot',surveySnapshoot);
    if(surveySnapshoot.empty){
      return null;
    }
    const surveyData = surveySnapshoot.docs[0].data().answers;
    return {
      ...surveyData,
      answers:surveyData.answers || []
    }

  } catch (error) {
    console.error("Error while getting user survey results",error);
    return null;
  }
}

export const getFilteredExercises=async (userEmail: string):Promise<Exercise[]> => {
  try {
    // kullanıcının yapmış odluğu seçimlerdir
    const surveyResults = await getUserSurveyResults(userEmail);

    if(!surveyResults){
      return [];}
      const userAnswers=surveyResults.answers.reduce((acc:userSurveyAnswers,curr:any) => {

        if(curr.question.includes('seviye')){
          acc.fitnesLevel=curr.answer;
        }
        else if(curr.question.includes('hedef')){
          acc.exerciseGoal=curr.answer;
        } 
        else if(curr.question.includes('zaman')){
          acc.timeRequired=curr.answer;
        }
        return acc;
      },{fitnesLevel:'',exerciseGoal:'',timeRequired:''});

      
        // bütün egzersizleri getirir
        const exerciseSnapshot=await firestore().collection('exercises').get();
        const exercises=exerciseSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Exercise[];

        return exercises.filter((exercise) => {
          const LevelMatch = exercise.fitnessLevel === userAnswers.fitnessLevel;
          console.log('trigger LevelMatch',LevelMatch);
          const GoalMatch = exercise.exerciseGoal === userAnswers.exerciseGoal ;
          console.log('trigger GoalMatch',GoalMatch);
          const timeMatch = exercise.timeRequired.includes(userAnswers.timeRequired);
          console.log('trigger timeMatch',timeMatch);
          const matchCount=[LevelMatch,GoalMatch,timeMatch].filter(Boolean).length;
          return matchCount >=2;
        });
         
    
  } catch (error) {
    console.error("Error while getting filtered exercises",error);
    return [];
  }
}