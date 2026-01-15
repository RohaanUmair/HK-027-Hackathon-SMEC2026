import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAhIVPtYw4d0sp0DlK3uWVNIunh4GjCwz0",
    authDomain: "reusex-13b84.firebaseapp.com",
    projectId: "reusex-13b84",
    storageBucket: "reusex-13b84.firebasestorage.app",
    messagingSenderId: "341400096914",
    appId: "1:341400096914:web:697775530f409a19c4564b",
    measurementId: "G-PCCB2DP74M"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
