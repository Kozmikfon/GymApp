import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {createContext, useState, useContext, useEffect} from 'react';

interface AuthContextData {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });
    return subscriber;
  }, []);

  const logout = async () => {
    await auth().signOut();
    const currentUser = auth().currentUser;
    if (!currentUser) {
      return;
    }
    await auth().signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{user, loading, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
