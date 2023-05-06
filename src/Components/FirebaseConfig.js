import { initializeApp } from 'firebase/app';
import FirebaseConfig from '../JSONConfig/FirebaseConfig.json';
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {

    apiKey: FirebaseConfig.apiKey,
    authDomain: FirebaseConfig.authDomain,
    projectId: FirebaseConfig.projectId,
    storageBucket: FirebaseConfig.storageBucket,
    messagingSenderId: FirebaseConfig.messagingSenderId,
    appId: FirebaseConfig.appId
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;