import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';



export const getUserRoles=async ():Promise<string[]>=>{
  try {
    const currentUser = auth().currentUser;
    if (!currentUser) 
      {return []}
    const userDoc=await firestore().collection('users').doc(currentUser.uid).get();
    if (!userDoc.exists) {
        return [];
      }
      const userData=userDoc.data();
      if (!userData) {
        return [];
      }
      const roles=userData.roles;
      console.log('trigger roles',roles);
      return roles;

      
  } catch (error) {
    console.error('Error while getting user roles',error);
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
