import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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
};
