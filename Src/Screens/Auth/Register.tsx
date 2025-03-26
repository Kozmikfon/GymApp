import React, { useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import auth from '@react-native-firebase/auth';
import { createUserInFirestore } from '../../Utils/firebase';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../interfaces/Naw/RootStackParamList';
import LinearGradient from 'react-native-linear-gradient';


interface RegisterProps {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;

}

export const Register = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [formData,setFormData] = useState<RegisterProps>({
        username:'',
        email:'',
        password:'',
        confirmPassword:'',
    });
    const [error,setError] = useState<string | null>(null);

    const validateForm = () => {  
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
          setError('Please fill in all fields');
          return false;
        }

        if(!formData.email.includes('@')){
            setError('Please enter a valid email');
            return false;
        }
    
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
    
        return true;
    }

    const handleSubmit = async () => {
        if (validateForm()) {
          setError(null);
          const userCredentials = await auth().createUserWithEmailAndPassword(formData.email,formData.password);
          await createUserInFirestore(userCredentials.user.uid,formData.email,formData.username);
          navigation.navigate('Login');
        }

     
      };





  return (
    <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
        style={styles.container}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>HESAP OLUŞTUR</Text>
              <Text style={styles.subHeaderText}>Fit bir yaşam için ilk adım</Text>
            </View>

            <View style={styles.formContainer}>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Kullanıcı Adı"
                  placeholderTextColor="#999"
                  value={formData.username}
                  onChangeText={(text) => setFormData({...formData, username: text})}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="E-posta"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Şifre"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(text) => setFormData({...formData, password: text})}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Şifre Tekrar"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                />
              </View>

              <TouchableOpacity 
                style={styles.button}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FF6B6B', '#FF8E53']}
                  style={styles.gradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  <Text style={styles.buttonText}>KAYIT OL</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Zaten hesabın var mı? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.linkText}>Giriş Yap</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
  )
}


const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
    },
    container: {
      flex: 1,
    },
    scrollView: {
      flexGrow: 1,
      paddingBottom: 30,
    },
    headerContainer: {
      alignItems: 'center',
      marginTop: 60,
      marginBottom: 40,
    },
    headerText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
      letterSpacing: 2,
    },
    subHeaderText: {
      fontSize: 16,
      color: '#ddd',
      marginTop: 10,
    },
    formContainer: {
      padding: 20,
      width: '100%',
    },
    inputContainer: {
      marginBottom: 20,
      borderRadius: 25,
      backgroundColor: 'rgba(255,255,255,0.1)',
      paddingHorizontal: 15,
    },
    input: {
      height: 55,
      color: '#fff',
      fontSize: 16,
    },
    button: {
      height: 55,
      marginTop: 20,
      borderRadius: 25,
      overflow: 'hidden',
    },
    gradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      letterSpacing: 1,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    footerText: {
      color: '#fff',
      fontSize: 16,
    },
    linkText: {
      color: '#FF6B6B',
      fontSize: 16,
      fontWeight: 'bold',
    },
    errorText: {
      color: '#FF6B6B',
      textAlign: 'center',
      marginBottom: 15,
    },
  });
  