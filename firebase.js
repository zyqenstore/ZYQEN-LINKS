import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { 
  getAuth, 
  GoogleAuthProvider 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyDB3ASQ43YEhMUzw-f-gL8hSxb10Ybxhn8",
  authDomain: "zyqen-links.firebaseapp.com",
  projectId: "zyqen-links",
  storageBucket: "zyqen-links.appspot.com",
  messagingSenderId: "535436335319",
  appId: "1:535436335319:web:a385f91ad7e13fbc683892"
};


const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);


export const auth = getAuth(app);


export const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"
});



export const ADMIN_EMAIL = "kaiccarvalhosouzaa@gmail.com";