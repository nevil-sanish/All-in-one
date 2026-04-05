import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

// Parse IIITK email: nevilmathew25BCD11@iiitkottayam.ac.in
// → name: Nevil Mathew, rollNo: 2025BCD0011, batch: 2025
function parseIIITKEmail(email) {
  const local = email.split('@')[0];
  // Match: name part (letters) + 2-digit year + branch code + roll digits
  const match = local.match(/^([a-zA-Z]+)(\d{2})([A-Z]+)(\d+)$/i);
  if (!match) return { displayName: local, rollNo: local, batch: null };
  
  const namePart = match[1];
  const yearShort = match[2];
  const branchCode = match[3].toUpperCase();
  const rollDigits = match[4].padStart(4, '0');
  
  // Convert name: split camelCase or just capitalize
  const displayName = namePart
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, s => s.toUpperCase());
  
  const fullYear = parseInt(yearShort) > 50 ? `19${yearShort}` : `20${yearShort}`;
  const rollNo = `${fullYear}${branchCode}${rollDigits}`;
  
  return { displayName, rollNo, batch: parseInt(fullYear) };
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (e) {
          console.error('Error fetching user data:', e);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function register(email, password) {
    if (!email.endsWith('@iiitkottayam.ac.in')) {
      throw new Error('Only @iiitkottayam.ac.in emails are allowed');
    }
    const parsed = parseIIITKEmail(email);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(cred.user);
    
    const userProfile = {
      email,
      displayName: parsed.displayName,
      rollNo: parsed.rollNo,
      batch: parsed.batch,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', cred.user.uid), userProfile);
    setUserData(userProfile);
    return cred.user;
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
    if (userDoc.exists()) {
      setUserData(userDoc.data());
    }
    return cred.user;
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      hd: 'iiitkottayam.ac.in'
    });
    const cred = await signInWithPopup(auth, provider);
    
    if (!cred.user.email.endsWith('@iiitkottayam.ac.in')) {
      await signOut(auth);
      throw new Error('Only @iiitkottayam.ac.in emails are allowed');
    }

    const userDocRef = doc(db, 'users', cred.user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      const parsed = parseIIITKEmail(cred.user.email);
      const userProfile = {
        email: cred.user.email,
        displayName: cred.user.displayName || parsed.displayName,
        rollNo: parsed.rollNo,
        batch: parsed.batch,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      await setDoc(userDocRef, userProfile);
      setUserData(userProfile);
    } else {
      setUserData(userDoc.data());
    }
    return cred.user;
  }

  async function logout() {
    await signOut(auth);
    setUserData(null);
  }

  const value = {
    currentUser,
    userData,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    isAdmin: userData?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
