import firebase from 'firebase/app';

const firebaseConfig={
    apiKey: "AIzaSyCudcXjaa83xyaZDxR0DOWz1hA-fqzCUF4",
    authDomain: "mine-4ad6c.firebaseapp.com",
    projectId: "mine-4ad6c",
    storageBucket: "mine-4ad6c.appspot.com",
    messagingSenderId: "272274821544",
    appId: "1:272274821544:web:e23bb9f53d8e5187d1cd9d",
    measurementId: "G-RL23D423DE"
}

export const firebaseApp= firebase.initializeApp(firebaseConfig);