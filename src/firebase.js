import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyAZdHMD3J986GNN9vfoOEqIqsA1io3FMNQ",
  authDomain: "album-d6269.firebaseapp.com",
  databaseURL: "https://album-d6269.firebaseio.com",
  projectId: "album-d6269",
  storageBucket: "album-d6269.appspot.com",
  messagingSenderId: "236625179128",
  appId: "1:236625179128:web:8f3b1750adc8f6c745e60d"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const storage = firebase.storage();

export const db = firebase.firestore();

export function snapshotToArray(snapshot) {
  const updated_array = [];
  snapshot.forEach(s => {
    const data = s.data();
    data.id = s.id;
    updated_array.push(data);
  });
  return updated_array;
}
