import React, { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../interfaces/Naw/RootStackParamList';
import {ScreenIndex} from '../Screens/ScreenIndex';
import {Login} from '../Screens/Auth/Login';
import {Register} from '../Screens/Auth/Register';
import  Home  from '../Screens/Home';
import { AdminDashboard } from '../Screens/Admin/AdminDashboard';
import auth from '@react-native-firebase/auth';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { getUserRoles } from '../Utils/firebase';



const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {

  const [userRoles,setUserRole] = React.useState<string | null>(null);
  const userEmail=auth().currentUser?.email;

  useEffect(() => {

    const chechkUserRoles = async () => {
      await getUserRoles().then((roles) => {
        if(roles.includes('admin')){
          setUserRole('admin');
          console.log('admin')
        }
      })
    }
    if(userEmail){
      chechkUserRoles();
    }


  }, [userEmail]);
    
 





  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName= {userEmail ? userRoles?.includes("admin") ? "AdminDashboard" : "Home" : "Home"} 
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="InitialQuestions" component={ScreenIndex} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};
