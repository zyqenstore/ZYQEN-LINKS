// ==========================================
// FIREBASE IMPORTS
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
  databaseURL: "https://zyqen-links-default-rtdb.firebaseio.com",
  projectId: "zyqen-links",
  storageBucket: "zyqen-links.firebasestorage.app",
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
// FIREBASE AUTH
// ==========================================

export const auth = getAuth(app);


// ==========================================
// GOOGLE PROVIDER
// ==========================================

export const provider = new GoogleAuthProvider();


// ==========================================
// ADMIN EMAIL
// ==========================================

export const ADMIN_EMAIL = "kaiccarvalhosouzaa@gmail.com";