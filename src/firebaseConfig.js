import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBM02hbETb_TCE_GGWjGRet1aTFGwAsY9U",
  authDomain: "petcare-database-591f5.firebaseapp.com",
  databaseURL: "https://petcare-database-591f5-default-rtdb.firebaseio.com",
  projectId: "petcare-database-591f5",
  storageBucket: "petcare-database-591f5.firebasestorage.app",
  messagingSenderId: "1035443338815",
  appId: "1:1035443338815:web:f4e1f2b9e17f2dc8e8c28a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);