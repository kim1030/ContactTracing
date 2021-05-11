import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBgz7nrnIBeE8f2CugmwUo02eKFEclTj4w",
    authDomain: "contact-tracing-system-13d5a.firebaseapp.com",
    projectId: "contact-tracing-system-13d5a",
    storageBucket: "contact-tracing-system-13d5a.appspot.com",
    messagingSenderId: "840254269947",
    appId: "1:840254269947:web:50b626985d8045d946035e"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  
export default firebase

