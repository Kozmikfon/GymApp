import React, {useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {createUserInFirestore} from '../../Utils/firebase';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../interfaces/Naw/RootStackParamList';
import LinearGradient from 'react-native-linear-gradient';

interface RegisterProps {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Register = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [formData, setFormData] = useState<RegisterProps>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Lütfen tüm alanları doldurunuz.');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Geçerli bir e-posta adresi giriniz.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler uyuşmuyor.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    setError(null);
  
    try {
      // Firebase ile kullanıcıyı oluştur
      const userCredentials = await auth().createUserWithEmailAndPassword(
        formData.email,
        formData.password
      );
  
      console.log("Kullanıcı oluşturuldu:", userCredentials);
  
      // Firestore'a kullanıcıyı ekle
      await createUserInFirestore(
        userCredentials.user.uid,
        formData.email,
        formData.username
      );
  
      // Kullanıcıya doğrulama e-postası gönder
      await userCredentials.user.sendEmailVerification();
      console.log("Doğrulama e-postası gönderildi.");
  
      // Kullanıcıyı çıkış yapmaya zorla
      await auth().signOut();
  
      Alert.alert(
        "Kayıt başarılı!",
        "Lütfen e-postanızı kontrol edip doğrulama yapın."
      );
  
      // Login sayfasına yönlendir
      navigation.navigate("Login");
    } catch (error: unknown) {
      console.error("Kayıt hatası:", error);
  
      let errorMessage = "Bir hata oluştu, lütfen tekrar deneyin.";
  
      // error nesnesinin Error olup olmadığını kontrol et
      if (error instanceof Error) {
        switch ((error as any).code) {
          case "auth/email-already-in-use":
            errorMessage = "Bu e-posta adresi zaten kullanımda.";
            break;
          case "auth/invalid-email":
            errorMessage = "Geçersiz bir e-posta adresi girdiniz.";
            break;
          case "auth/weak-password":
            errorMessage = "Şifre çok zayıf! Lütfen daha güçlü bir şifre seçin.";
            break;
          case "auth/network-request-failed":
            errorMessage = "İnternet bağlantınızı kontrol edin ve tekrar deneyin.";
            break;
          default:
            errorMessage = error.message;
        }
      }
  
      setError(errorMessage);
    }
  };
  
  

  return (
    <LinearGradient
      colors={['rgba(51, 46, 46, 0.7)', 'rgba(22, 17, 17, 0.9)']}
      style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>HESAP OLUŞTUR</Text>
            <Text style={styles.subHeaderText}>
              Fit bir yaşam için ilk adım
            </Text>
          </View>

          <View style={styles.formContainer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Kullanıcı Adı"
                placeholderTextColor="#999"
                value={formData.username}
                onChangeText={text =>
                  setFormData({...formData, username: text})
                }
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
                onChangeText={text =>
                  setFormData({...formData, password: text})
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Şifre Tekrar"
                placeholderTextColor="#999"
                secureTextEntry
                value={formData.confirmPassword}
                onChangeText={text =>
                  setFormData({...formData, confirmPassword: text})
                }
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              activeOpacity={0.8}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E53']}
                style={styles.gradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
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
  );
};

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
function alert(arg0: string) {
  throw new Error('Function not implemented.');
}
