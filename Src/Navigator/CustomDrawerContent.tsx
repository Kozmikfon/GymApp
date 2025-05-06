import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAuth } from "../Context/AuthContext";
import LinearGradient from "react-native-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { RootStackParamList } from "../interfaces/Naw/RootStackParamList";
import React from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';


export const CustomDrawerContent = (props:any) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { logout } = useAuth();
    const handleLogout = () =>{
      logout();
      navigation.reset({
        index:0,
        routes:[{name:'AuthStack'}]
      })
    }

    return (
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={stylesCustomDrawer.container}
      >
        <DrawerContentScrollView {...props}>
          {/* Profile Section */}
          <View style={stylesCustomDrawer.profileSection}>
            
          <Text style={stylesCustomDrawer.profileName}>{auth().currentUser?.displayName}</Text>
          <Text style={stylesCustomDrawer.profileEmail}>{auth().currentUser?.email} </Text>
          </View>
  
          {/* Menu Items */}
          <View style={stylesCustomDrawer.menuContainer}>
            <TouchableOpacity 
              style={stylesCustomDrawer.menuItem}
              onPress={() => props.navigation.navigate('Home')}
            >
              <MaterialCommunityIcons name="home" size={24} color="#fff" />
              <Text style={stylesCustomDrawer.menuText}>Ana Sayfa</Text>
            </TouchableOpacity>
  
            <TouchableOpacity 
              style={stylesCustomDrawer.menuItem}
              onPress={() => props.navigation.navigate('Workouts')}
            >
              <MaterialCommunityIcons name="dumbbell" size={24} color="#fff" />
              <Text style={stylesCustomDrawer.menuText}>Antrenmanlar</Text>
            </TouchableOpacity>
  
            <TouchableOpacity 
              style={stylesCustomDrawer.menuItem}
              onPress={() => props.navigation.navigate('Progress')}
            >
              <MaterialCommunityIcons name="chart-line" size={24} color="#fff" />
              <Text style={stylesCustomDrawer.menuText}>İlerleme</Text>
            </TouchableOpacity>
  
            <TouchableOpacity 
              style={stylesCustomDrawer.menuItem}
              onPress={() => navigation.navigate('DrawersStack')}
            >
              <MaterialCommunityIcons name="account" size={24} color="#fff" />
              <Text style={stylesCustomDrawer.menuText}>Profil</Text>
            </TouchableOpacity>
          </View>
        </DrawerContentScrollView>
  
        {/* Logout Button */}
        <TouchableOpacity 
          style={stylesCustomDrawer.logoutButton}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons name="logout" size={24} color="#FF3B30" />
          <Text style={stylesCustomDrawer.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  };
  const stylesCustomDrawer = StyleSheet.create({
    container: {
      flex: 1,
    },
    profileSection: {
      padding: 20,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.2)',
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 10,
    },
    profileName: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    profileEmail: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 14,
    },
    menuContainer: {
      padding: 15,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 10,
    },
    menuText: {
      color: '#fff',
      fontSize: 16,
      marginLeft: 15,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.2)',
    },
    logoutText: {
      color: '#FF3B30',
      fontSize: 16,
      marginLeft: 15,
      fontWeight: 'bold',
    }
  });