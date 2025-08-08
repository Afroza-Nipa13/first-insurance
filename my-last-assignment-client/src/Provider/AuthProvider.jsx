import {  useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'


import { AuthContext } from '../Contexts/AuthContext'
import { auth } from '../Firebase/firebase.init'
import useAxiosSecure from '../Hooks/useAxiosSecure'




const googleProvider = new GoogleAuthProvider()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const axiosSecure =useAxiosSecure()

  const createUser = (email, password) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const signIn = (email, password) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = () => {
    setLoading(true)
    return signInWithPopup(auth, googleProvider)
  }

  const logOut = async () => {
    setLoading(true)
    return signOut(auth)
  }

  const updateUserProfile = profileInfo => {
        return updateProfile(auth.currentUser, profileInfo);
    }

  // onAuthStateChange
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser)

      if (currentUser) {
        
        try {
          const res = await axiosSecure.post('/jwt', { email: currentUser.email })
          console.log('JWT set in cookie:', res.data)
        } catch (err) {
          console.error('JWT error:', err)
        }
      } else {
        
        try {
          await axiosSecure.get('/logout')
          console.log('Token cleared')
        } catch (err) {
          console.error('Logout error:', err)
        }
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [axiosSecure])

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    createUser,
    signIn,
    signInWithGoogle,
    logOut,
    updateUserProfile,
  }

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  )
}