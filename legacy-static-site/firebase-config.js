// ── AdhikarAI Firebase Configuration ──
const firebaseConfig = {
  apiKey: "AIzaSyBAyXlI1vcS58JidjJuBvn3G60qAb2brjM",
  authDomain: "adhikarai-9a254.firebaseapp.com",
  projectId: "adhikarai-9a254",
  storageBucket: "adhikarai-9a254.firebasestorage.app",
  messagingSenderId: "531023710976",
  appId: "1:531023710976:web:976cb2636d3f724603c1e5",
  measurementId: "G-XDZ62163CR"
};

// Only initialize if not already done (prevents duplicate app error)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth    = firebase.auth();
const db      = firebase.firestore();
// Storage only available on pages that load the storage SDK
const storage = (typeof firebase.storage === 'function') ? firebase.storage() : null;
