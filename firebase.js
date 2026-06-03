// ==========================================
// FIREBASE IMPORTS
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { 
  getAuth, 
  GoogleAuthProvider 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyDB3ASQ43YEhMUzw-f-gL8hSxb10Ybxhn8",
  authDomain: "zyqen-links.firebaseapp.com",
  projectId: "zyqen-links",
  storageBucket: "zyqen-links.appspot.com",
  messagingSenderId: "535436335319",
  appId: "1:535436335319:web:a385f91ad7e13fbc683892"
};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);


// ==========================================
// FIRESTORE DATABASE
// ==========================================

export const db = getFirestore(app);


// ==========================================
// AUTH
// ==========================================

export const auth = getAuth(app);


// ==========================================
// GOOGLE LOGIN PROVIDER
// ==========================================

export const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"
});


// ==========================================
// ADMIN CONFIG
// ==========================================

export const ADMIN_EMAIL = "kaiccarvalhosouzaa@gmail.com";