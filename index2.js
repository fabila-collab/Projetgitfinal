// ============ AUTH — ÉTAT UTILISATEUR ============
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  updateNavUser();
});
function updateNavUser() {
  const navUser = document.getElementById("nav-user");
  if (!navUser) return;
  if (currentUser) {
    navUser.textContent = " Mon compte";
    navUser.onclick = () => { loadMesBillets(); showPage("mes-billets"); };
  } else {
    navUser.textContent = "Connexion";
    navUser.onclick = () => showPage("login");
  }
}
// ============ AUTH — INSCRIPTION ============
async function registerUser(email, password, nom, prenom) {
  try {
    showLoader("Création du compte...");
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await addDoc(collection(db, "utilisateurs"), {
      uid:       credential.user.uid,
      email:     email,
      nom:       nom,
      prenom:    prenom,
      createdAt: new Date().toISOString()
    });
    hideLoader();
    alert(" Compte créé ! Bienvenue " + prenom + " !");
    goHome();
  } catch (e) {
    hideLoader();
    if (e.code === "auth/email-already-in-use") {
      alert(" Cet email est déjà utilisé.");
    } else if (e.code === "auth/weak-password") {
      alert(" Mot de passe trop court (minimum 6 caractères).");
    } else {
      alert(" Erreur : " + e.message);
    }
  }
}
// ============ AUTH — CONNEXION ============
async function loginUser(email, password) {
  try {
    showLoader("Connexion en cours...");
    await signInWithEmailAndPassword(auth, email, password);
    hideLoader();
    goHome();
  } catch (e) {
    hideLoader();
    alert(" Email ou mot de passe incorrect.");
  }
}
// ============ AUTH — DÉCONNEXION ============
async function logoutUser() {
  await signOut(auth);
  alert("Vous êtes déconnecté.");
  goHome();
}
// ============ FIRESTORE — SAUVEGARDER RÉSERVATION ============
async function saveReservation(data) {
  try {
    const docRef = await addDoc(collection(db, "reservations"), {
      reference:       data.reference,
      agence:          data.agence,
      depart:          data.depart,
      destination:     data.destination,
      date:            data.date,
      heure:           data.heure,
      arrivee:         data.arrivee,
      classe:          data.classe,
      prix:            data.prix,
      typeReservation: data.typeReservation,
      paiement:        data.paiement || "onsite",
      passager: {
        nom:    data.nom,
        prenom: data.prenom,
        cni:    data.cni
      },
      userId:    currentUser ? currentUser.uid : "anonyme",
      statut:    data.typeReservation === "buy" ? "payé" : "réservé",
      createdAt: new Date().toISOString()
    });
    console.log(" Réservation enregistrée :", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error(" Erreur Firebase :", e);
  }
}
// ============ FIRESTORE — RÉCUPÉRER MES BILLETS ============
async function getUserReservations() {
  if (!currentUser) return [];
  try {
    const q = query(
      collection(db, "reservations"),
      where("userId", "==", currentUser.uid)
    );
    const snapshot = await getDocs(q);
    const result = [];
    snapshot.forEach(doc => result.push({ id: doc.id, ...doc.data() }));
    // Trier par date de création (plus récent en premier)
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  } catch (e) {
    console.error("Erreur récupération billets :", e);
    return [];
  }
}
// ============ INIT ============
window.onload = function() {
  document.getElementById("s-date").min = new Date().toISOString().split("T")[0];
  fillSelect("s-from", VILLES);
  fillSelect("s-to",   VILLES);
  document.getElementById("agency-count").textContent =
    AGENCIES.length + " agences disponibles sur toute l'étendue du territoire";
  renderAgenciesGrid("home-agencies", true);
  injectLoginPage();
  injectRegisterPage();
  injectMesBilletsPage();
};
// ============ UTILITAIRES ============
function fillSelect(id, options) {
  const sel = document.getElementById(id);
  sel.innerHTML = `<option value="">Choisir la ville</option>`;
  options.forEach(v => {
    const o = document.createElement("option");
    o.value = v; o.textContent = v;
    sel.appendChild(o);
  });
}
function showPage(name) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const el = document.getElementById("page-" + name);
  if (el) el.classList.add("active");
  window.scrollTo({ top:0, behavior:"smooth" });
}
function goHome() {
  state = {
    from:"", to:"", date:"",
    agency:null, trip:null,
    bookingType:null, paymentMethod:null,
    passenger:{ nom:"", prenom:"", cni:"" }
  };
  document.getElementById("s-from").value = "";
  document.getElementById("s-to").value   = "";
  document.getElementById("s-date").value = "";
  showPage("home");
}