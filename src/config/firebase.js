/* eslint-disable import/no-extraneous-dependencies */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDXIwoeYIzHRemHKy1oTRXR3yIDqpOqRG0',
  authDomain: 'whatsapp-api-fd6c3.firebaseapp.com',
  projectId: 'whatsapp-api-fd6c3',
  storageBucket: 'whatsapp-api-fd6c3.appspot.com',
  messagingSenderId: '115966567362',
  appId: '1:115966567362:web:aa914b7a2edef66c606c5b',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { app, firestore };
