// ============ FIREBASE CONFIG ============
// Remplace par TES valeurs depuis Firebase Console

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJECT.firebaseapp.com",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_PROJECT.appspot.com",
  messagingSenderId: "VOTRE_SENDER_ID",
  appId: "VOTRE_APP_ID"
};

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

// ============ SAUVEGARDER UNE RÉSERVATION ============

export async function saveReservation(data) {
  try {
    const docRef = await addDoc(collection(db, "reservations"), {
      reference:     data.reference,
      agence:        data.agence,
      depart:        data.depart,
      destination:   data.destination,
      date:          data.date,
      heure:         data.heure,
      classe:        data.classe,
      prix:          data.prix,
      typeReservation: data.typeReservation,   // "buy" ou "reserve"
      paiement:      data.paiement,            // "orange" ou "onsite"
      passager: {
        nom:    data.nom,
        prenom: data.prenom,
        cni:    data.cni
      },
      statut:    data.typeReservation === "buy" ? "payé" : "réservé",
      createdAt: new Date().toISOString()
    });
    console.log("Réservation sauvegardée :", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Erreur sauvegarde :", e);
  }
}

// ============ CRÉER UN COMPTE UTILISATEUR ============

export async function registerUser(email, password, nom, prenom) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Sauvegarde infos utilisateur dans Firestore
    await addDoc(collection(db, "utilisateurs"), {
      uid:      userCredential.user.uid,
      email:    email,
      nom:      nom,
      prenom:   prenom,
      createdAt: new Date().toISOString()
    });
    return userCredential.user;
  } catch (e) {
    console.error("Erreur inscription :", e);
    alert("Erreur : " + e.message);
  }
}

// ============ CONNEXION UTILISATEUR ============

export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (e) {
    console.error("Erreur connexion :", e);
    alert("Email ou mot de passe incorrect.");
  }
}

// ============ VOIR TOUTES LES RÉSERVATIONS ============

export async function getAllReservations() {
  const querySnapshot = await getDocs(collection(db, "reservations"));
  const reservations = [];
  querySnapshot.forEach(doc => {
    reservations.push({ id: doc.id, ...doc.data() });
  });
  return reservations;
}
