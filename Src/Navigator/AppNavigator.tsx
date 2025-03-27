import React, { useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList, ScreenNames} from '../interfaces/Naw/RootStackParamList';
import {ScreenIndex} from '../Screens/ScreenIndex';
import {Login} from '../Screens/Auth/Login';
import {Register} from '../Screens/Auth/Register';
import  Home  from '../Screens/Home';
import { AdminDashboard } from '../Screens/Admin/AdminDashboard';
import auth from '@react-native-firebase/auth';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { getUserRoles } from '../Utils/firebase';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';



const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {


  const [initialRoute, setInitialRoute] = useState<ScreenNames>('Login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialRoute = async () => {
    const userEmail=auth().currentUser?.email;
    if(!userEmail){
      setInitialRoute('Login');
    }
    else
    {
      const roles=await getUserRoles();
      if(roles.includes('admin')){
        setInitialRoute('AdminDashboard');
      }
      else{
        setInitialRoute('Home');
      }
      setLoading(false);
    }
  }
    initialRoute();
    },[]);

    if(loading){
      return 
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}} >
        <ActivityIndicator size='large'  color='blue '/>
      </View>
      
    }



  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName= {initialRoute} 
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
