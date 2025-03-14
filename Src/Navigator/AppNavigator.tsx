import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../interfaces/Naw/RootStackParamList';
import {ScreenIndex} from '../Screens/ScreenIndex';
import {Login} from '../Screens/Auth/Login';
import {Register} from '../Screens/Auth/Register';
import  Home  from '../Screens/Home';
import { AdminDashboard } from '../Screens/Admin/AdminDashboard';




const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
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
