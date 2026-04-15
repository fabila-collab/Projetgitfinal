// =============================================
//   MOTOCAM BUS — script.js (Firebase intégré)
// =============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
// ============================================================
//   REMPLACE CES VALEURS PAR CELLES DE TA CONSOLE FIREBASE
// ============================================================
const firebaseConfig = {
  apiKey:            "VOTRE_API_KEY",
  authDomain:        "VOTRE_PROJECT.firebaseapp.com",
  projectId:         "VOTRE_PROJECT_ID",
  storageBucket:     "VOTRE_PROJECT.appspot.com",
  messagingSenderId: "VOTRE_SENDER_ID",
  appId:             "VOTRE_APP_ID"
};
const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);
// ============ DONNÉES ============
const VILLES = [
  "Yaoundé","Douala","Bafoussam","Bamenda",
  "Ngaoundéré","Garoua","Maroua","Limbe",
  "Buea","Kribi","Ébolowa","Kumba","Dschang"
];
const AGENCIES = [
  { id:1, name:"Général Express",     logo:" ", color:"#C0392B", cities:["Yaoundé","Douala","Bafoussam","Bamenda"],   rating:4.5, trips:12 },
  { id:2, name:"Buca Voyages",        logo:" ", color:"#2980B9", cities:["Douala","Yaoundé","Limbe","Buea"],          rating:4.3, trips:8  },
  { id:3, name:"Touristique Express", logo:" ", color:"#27AE60", cities:["Yaoundé","Ngaoundéré","Garoua","Maroua"],   rating:4.7, trips:6  },
  { id:4, name:"Vatican Express",     logo:" ", color:"#8E44AD", cities:["Douala","Dschang","Bafoussam","Yaoundé"],   rating:4.2, trips:10 },
  { id:5, name:"Amour Mezam",         logo:" ", color:"#E67E22", cities:["Bamenda","Douala","Yaoundé","Kumba"],       rating:4.4, trips:7  },
  { id:6, name:"Finexs Voyages",      logo:" ", color:"#16A085", cities:["Yaoundé","Kribi","Ébolowa","Sangmélima"],  rating:4.1, trips:5  },
];
const SCHEDULES = [
  { id:1, depart:"06:00", arrivee:"10:30", duree:"4h30", prix:3500, classe:"Standard", places:12 },
  { id:2, depart:"08:30", arrivee:"12:45", duree:"4h15", prix:4000, classe:"Confort",  places:6  },
  { id:3, depart:"11:00", arrivee:"15:30", duree:"4h30", prix:3500, classe:"Standard", places:18 },
  { id:4, depart:"14:00", arrivee:"18:00", duree:"4h00", prix:4500, classe:"VIP",      places:3  },
  { id:5, depart:"17:00", arrivee:"21:30", duree:"4h30", prix:3500, classe:"Standard", places:20 },
  { id:6, depart:"22:00", arrivee:"06:00", duree:"8h00", prix:5000, classe:"Nuit",     places:8  },
];
// ============ STATE ============
let state = {
  from:"", to:"", date:"",
  agency:null, trip:null,
  bookingType:null, paymentMethod:null,
  passenger:{ nom:"", prenom:"", cni:"" }
};
let currentUser = null;
const CONF_REF = "BUS" + Math.random().toString(36).substr(2,8).toUpperCase();
// ============ LOADER ============
function showLoader(message) {
  let loader = document.getElementById("global-loader");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "global-loader";
    loader.style.cssText = `
      position:fixed; inset:0;
      background:rgba(0,0,0,0.75);
      display:flex; align-items:center; justify-content:center;
      z-index:9999; flex-direction:column; gap:16px;
    `;
    loader.innerHTML = `
      <div style="
        width:48px; height:48px;
        border:4px solid #C8860A;
        border-top-color:transparent;
        border-radius:50%;
        animation:spin 0.8s linear infinite;
      "></div>
      <p id="loader-msg" style="
        color:#F5C842;
        font-family:'Lato',sans-serif;
        font-size:1rem;
        letter-spacing:1px;
      ">${message}</p>
      <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    `;
    document.body.appendChild(loader);
  } else {
    document.getElementById("loader-msg").textContent = message;
    loader.style.display = "flex";
  }
}
function hideLoader() {
  const loader = document.getElementById("global-loader");
  if (loader) loader.style.display = "none";
}
  




