
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNH85SgaxJgDwx-qFfpNK5mZixAB1k7Mw",
  authDomain: "moneytrack-71036.firebaseapp.com",
  databaseURL: "https://moneytrack-71036-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "moneytrack-71036",
  storageBucket: "moneytrack-71036.appspot.com",
  messagingSenderId: "416414391714",
  appId: "1:416414391714:web:8a63d5a0e57f7b9b32e6fb",
  measurementId: "G-PLGDC2D1Y5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {app, db}
