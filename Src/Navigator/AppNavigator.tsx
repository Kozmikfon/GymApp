import React, { useEffect, useState } from 'react';
import {NavigationContainer, NavigationProp, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList, ScreenNames} from '../interfaces/Naw/RootStackParamList';
import {ScreenIndex} from '../Screens/ScreenIndex';
import {Login} from '../Screens/Auth/Login';
import {Register} from '../Screens/Auth/Register';
import  Home  from '../Screens/Home';
import { AdminDashboard } from '../Screens/Admin/AdminDashboard';
import auth from '@react-native-firebase/auth';
import { getUserRoles } from '../Utils/firebase';
import { Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { DrawerParamList } from '../interfaces/Naw/DrawerParamList';
import { useAuth } from '../Context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer=createDrawerNavigator<DrawerParamList>();


const CustomDrawerContent = (props:any) => {
  const {logout}=useAuth();
  const navigation=useNavigation<NavigationProp<RootStackParamList>>();


  const handleLogout=async()=>{
    await logout();
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    })
  }
  return(
    <View style={{flex:1}}> 
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        </DrawerContentScrollView>

    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View> 
    </View>
  )
}


const AdminStack = () => {
  return(
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name='AdminDashboard' component={AdminDashboard}></Stack.Screen>
    </Stack.Navigator>

  )

};

const MainStack=()=>{
  return(
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name='Home' component={Home}></Stack.Screen>
      <Stack.Screen name='InitialQuestions' component={ScreenIndex}></Stack.Screen>
    </Stack.Navigator>
  )
};

export const HomeDrawer = () => {
  return(
    
      <Drawer.Navigator 
        drawerContent={(props)=> <CustomDrawerContent {...props} />}     
        screenOptions={{headerShown:true,drawerPosition:'left',drawerType:'front',drawerStyle:{width:300},swipeEnabled:true}}> 
        <Drawer.Screen name="MainStack" component={MainStack}></Drawer.Screen>
      </Drawer.Navigator>
  )
}


export const RootNavigator = () => {


  const [initialRoute, setInitialRoute] = useState<ScreenNames>('Login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeRoute = async () => {
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
    initializeRoute();
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
        {/* <Stack.Screen name="InitialQuestions" component={ScreenIndex} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} /> */}
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="HomeDrawer" component={HomeDrawer} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />


      </Stack.Navigator>
    </NavigationContainer>
  );
};


export const AuthStack=()=>{
  return(
    <NavigationContainer>
    <Stack.Navigator
    initialRouteName='Login'
    screenOptions={{headerShown: false}}>
      <Stack.Screen name='Login' component={Login}/>
      <Stack.Screen name='Register' component={Register}/>
    </Stack.Navigator>
    </NavigationContainer>
  )
}