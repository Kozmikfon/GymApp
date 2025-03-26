import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {RootStackParamList} from '../../interfaces/Naw/RootStackParamList';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import { checkUserSurveyExists, getUserRoles } from '../../Utils/firebase';

interface LoginProps {
  email: string;
  password: string;
}

export const Login = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [formData, setFormData] = useState<LoginProps>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Firebase kullanıcısının doğrulama durumunu dinle
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        await user.reload(); // Firebase kullanıcı verisini güncelle
        setIsEmailVerified(user.emailVerified); // E-posta doğrulama durumunu kontrol et
      }
    });

    return () => unsubscribe();
  }, []);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Lütfen tüm alanları doldurunuz.');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Geçerli bir e-posta adresi giriniz.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      if (!validateForm()) return;
  
      setError(null);
  
      // 1. Firebase ile giriş yap
      const userCredentials = await auth().signInWithEmailAndPassword(
        formData.email,
        formData.password
      );
  
      const user = userCredentials.user;
  
      // 2. E-posta doğrulaması yapılmış mı kontrol et
      if (!user.emailVerified) {
        await auth().signOut();
        Alert.alert('Hata', 'Lütfen e-postanızı doğrulayın.');
        return;
      }
  
      // 3. Token al
      const token = await user.getIdToken();
      if (!token) {
        throw new Error('Token alınamadı. Giriş başarısız.');
      }
  
      // 4. Roller al ve yönlendir
      const roles = await getUserRoles(); // Bu fonksiyon bir dizi dönmeli: ['admin', 'user', ...]
      if (roles.includes('admin')) {
        navigation.navigate('AdminDashboard');
        return;
      }
  
      // 5. Anket durumu kontrolü
      const surveyExists = await checkUserSurveyExists(formData.email);
      if (surveyExists) {
        navigation.navigate('Home');
      } else {
        navigation.navigate('InitialQuestions');
      }
  
      console.log('Giriş başarılı!');
    } catch (error: any) {
      console.error('Giriş hatası:', error);
  
      let errorMessage = 'E-posta veya şifre hatalı.';
  
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Kullanıcı bulunamadı.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Yanlış şifre.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.';
      } else if (error.message) {
        errorMessage = error.message;
      }
  
      setError(errorMessage);
    }
  };
  
  
  
  
  
  

  return (
    <LinearGradient
      colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
      style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} />
          <Text style={styles.appName}>FITNESS APP</Text>
        </View>

        <View style={styles.formContainer}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="E-posta"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={text => setFormData({...formData, email: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              placeholderTextColor="#999"
              secureTextEntry
              value={formData.password}
              onChangeText={text => setFormData({...formData, password: text})}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              style={styles.gradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <Text style={styles.buttonText}>GİRİŞ YAP</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Hesabın yok mu? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
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
function alert(arg0: string) {
  throw new Error('Function not implemented.');
}