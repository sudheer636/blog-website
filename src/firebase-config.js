import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC_azu4JovLdnXhpnamtZr3SVVix9l3HWg",
  authDomain: "blog636-a3e0e.firebaseapp.com",
  projectId: "blog636-a3e0e",
  storageBucket: "blog636-a3e0e.appspot.com",
  messagingSenderId: "685509172806",
  appId: "1:685509172806:web:4edbcaf6655594a69f7447",
  measurementId: "G-HGD5PBKG6B"
};

const app = initializeApp(firebaseConfig);
console.log('configuration done=----', app);
const storage = getStorage(app);
export { storage };
