import React, { createContext, useContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

interface AuthContextProps {
  user: FirebaseAuthTypes.User | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    // Configure Google Sign-In (replace with your webClientId)
    GoogleSignin.configure({
      webClientId: '743294260027-k4v00onkfbseukv7rmja4esdjb6c0nia.apps.googleusercontent.com',
    });
    // Listen for auth state changes
    const unsubscribe = auth().onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await GoogleSignin.signIn();
      console.log('Google sign-in result:', result);
      // For some versions, result may be { idToken, ... }
      // For others, result may be { type: 'success', data: { idToken, ... } }
      const idToken = result.idToken || (result.data && result.data.idToken);
      if (!idToken) {
        console.error('No idToken returned from Google Sign-In');
        return;
      }
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const signOut = async () => {
    await auth().signOut();
    await GoogleSignin.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}; 