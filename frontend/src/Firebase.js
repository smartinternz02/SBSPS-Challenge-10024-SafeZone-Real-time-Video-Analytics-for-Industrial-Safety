import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDvEuI7-qCJ3W_9MzRDgqBIAFPXJ2OcTPI",
  authDomain: "ibm-safety-net.firebaseapp.com",
  projectId: "ibm-safety-net",
  storageBucket: "ibm-safety-net.appspot.com",
  messagingSenderId: "611621230941",
  appId: "1:611621230941:web:59df45530b74d31ff170b4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;