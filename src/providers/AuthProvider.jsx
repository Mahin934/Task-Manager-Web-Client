import { createContext, useState, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import auth from "../firebase/firebase.init";


export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // State for user
    const [loading, setLoading] = useState(true); // State for loading

    // Monitor user authentication state
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => {
            unSubscribe();
        };
    }, []);

    // Create a new user with email and password
    const createNewUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Log in an existing user with email and password
    const userLogin = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Log in using Google
    const googleSignIn = () => {
        const googleProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleProvider);
    };

    // Update user profile (name, photo, etc.)
    const updateUserProfile = (profile) => {
        return updateProfile(auth.currentUser, profile);
    };

    // Log out the user
    const logOut = () => {
        return signOut(auth);
    };

    const authInfo = {
        user,
        loading,
        setUser,
        createNewUser,
        userLogin,
        googleSignIn,
        updateUserProfile,
        logOut,
    };

    return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
