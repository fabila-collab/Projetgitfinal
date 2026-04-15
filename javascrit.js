

const VILLES = ["Yaoundé","Douala","Bafoussam","Bamenda","Ngaoundéré","Garoua","Maroua","Limbe","Buea","Kribi","Ébolowa","Kumba","Dschang"];

const AGENCIES = [
  { id:1, name:"Général Express",     logo:"🚌", color:"#C0392B", cities:["Yaoundé","Douala","Bafoussam","Bamenda"],   rating:4.5, trips:12 },
  { id:2, name:"Buca Voyages",        logo:"🚐", color:"#2980B9", cities:["Douala","Yaoundé","Limbe","Buea"],          rating:4.3, trips:8  },
  { id:3, name:"Touristique Express", logo:"🚍", color:"#27AE60", cities:["Yaoundé","Ngaoundéré","Garoua","Maroua"],   rating:4.7, trips:6  },
  { id:4, name:"Vatican Express",     logo:"🚎", color:"#8E44AD", cities:["Douala","Dschang","Bafoussam","Yaoundé"],   rating:4.2, trips:10 },
  { id:5, name:"Amour Mezam",         logo:"🚌", color:"#E67E22", cities:["Bamenda","Douala","Yaoundé","Kumba"],       rating:4.4, trips:7  },
  { id:6, name:"Finexs Voyages",      logo:"🚐", color:"#16A085", cities:["Yaoundé","Kribi","Ébolowa","Sangmélima"],  rating:4.1, trips:5  },
];

const SCHEDULES = [
  { id:1, depart:"06:00", arrivee:"10:30", duree:"4h30", prix:3500, classe:"Standard", places:12 },
  { id:2, depart:"08:30", arrivee:"12:45", duree:"4h15", prix:4000, classe:"Confort",  places:6  },
  { id:3, depart:"11:00", arrivee:"15:30", duree:"4h30", prix:3500, classe:"Standard", places:18 },
  { id:4, depart:"14:00", arrivee:"18:00", duree:"4h00", prix:4500, classe:"VIP",      places:3  },
  { id:5, depart:"17:00", arrivee:"21:30", duree:"4h30", prix:3500, classe:"Standard", places:20 },
  { id:6, depart:"22:00", arrivee:"06:00", duree:"8h00", prix:5000, classe:"Nuit",     places:8  },
];



let state = {
  from: "", to: "", date: "",
  agency: null, trip: null,
  bookingType: null, paymentMethod: null,
  passenger: { nom:"", prenom:"", cni:"" }
};

const CONF_REF = "BUS" + Math.random().toString(36).substr(2,8).toUpperCase();



window.onload = function() {
  document.getElementById("s-date").min = new Date().toISOString().split("T")[0];
  fillSelect("s-from", VILLES);
  fillSelect("s-to", VILLES);
  document.getElementById("agency-count").textContent = AGENCIES.length + " agences disponibles sur toute l'étendue du territoire";
  renderAgenciesGrid("home-agencies", true);
};

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
  document.getElementById("page-" + name).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goHome() {
  state = { from:"", to:"", date:"", agency:null, trip:null, bookingType:null, paymentMethod:null, passenger:{nom:"",prenom:"",cni:""} };
  document.getElementById("s-from").value = "";
  document.getElementById("s-to").value = "";
  document.getElementById("s-date").value = "";
  showPage("home");
}



function doSearch() {
  state.from = document.getElementById("s-from").value;
  state.to   = document.getElementById("s-to").value;
  state.date = document.getElementById("s-date").value;
  if (!state.from || !state.to || !state.date) { alert("Veuillez remplir tous les champs."); return; }
  if (state.from === state.to) { alert("Départ et destination doivent être différents."); return; }
  showAgenciesPage();
}



function showAgenciesPage() {
  state.agency = null;
  renderAgenciesGrid("agencies-list", false);
  showPage("agencies");
}

function renderAgenciesGrid(containerId, isHome) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  AGENCIES.forEach(ag => {
    const card = document.createElement("div");
    card.className = "agency-card";
    card.style.cssText = `--ac:${ag.color}`;
    card.innerHTML = `
      <div class="agency-logo">${ag.logo}</div>
      <div class="agency-name">${ag.name}</div>
      <div class="tags">${ag.cities.map(c => `<span class="tag">${c}</span>`).join("")}</div>
      <div class="agency-meta">
        <span class="rating">★ ${ag.rating}</span>
        <span class="trips-count">${ag.trips} départs/jour</span>
      </div>
      <button class="btn-ac" style="--ac:${ag.color}">
        ${isHome ? "Choisir cette agence →" : "Voir les horaires →"}
      </button>
    `;
    card.querySelector(".btn-ac").addEventListener("click", () => selectAgency(ag));
    container.appendChild(card);
  });
}



function selectAgency(ag) {
  state.agency = ag;
  buildResultsPage();
  showPage("results");
}

function buildResultsPage() {
  const ag = state.agency;

  document.getElementById("agency-bar-results").innerHTML = `
    <div class="agency-bar">
      <span class="agency-bar-logo">${ag.logo}</span>
      <div>
        <div class="agency-bar-name">${ag.name}</div>
        <div style="color:var(--muted);font-size:.82rem;">${ag.cities.join(" · ")}</div>
      </div>
      <span class="agency-bar-tag">★ ${ag.rating}</span>
    </div>`;

  if (state.from && state.to && state.date) {
    const d = new Date(state.date + "T12:00:00");
    const dateStr = d.toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long", year:"numeric" });
    document.getElementById("route-display").innerHTML = `
      <div class="route-row">
        <span>${state.from}</span>
        <span class="route-arrow">→</span>
        <span>${state.to}</span>
      </div>
      <div class="route-date">${dateStr}</div>`;
  } else {
    document.getElementById("route-display").innerHTML = "";
  }

  const container = document.getElementById("trips-container");
  container.innerHTML = "";
  SCHEDULES.forEach(trip => {
    const card = document.createElement("div");
    card.className = "trip-card";
    card.id = "trip-" + trip.id;
    card.innerHTML = `
      <div>
        <div class="trip-time">${trip.depart} → ${trip.arrivee}</div>
        <div class="trip-dur">Durée : ${trip.duree}</div>
      </div>
      <div>
        <span class="trip-badge badge-${trip.classe.split(" ")[0]}">${trip.classe}</span>
        <div class="trip-places">✓ ${trip.places} places disponibles</div>
      </div>
      <div class="trip-price">${trip.prix.toLocaleString("fr-FR")}<small>FCFA / pers.</small></div>
      <button class="btn-ac" style="--ac:${ag.color};width:110px;" onclick="selectTrip(${trip.id})">Choisir →</button>
    `;
    card.addEventListener("click", () => selectTrip(trip.id));
    container.appendChild(card);
  });
}



function selectTrip(tripId) {
  state.trip = SCHEDULES.find(t => t.id === tripId);
  document.querySelectorAll(".trip-card").forEach(c => c.classList.remove("selected"));
  const el = document.getElementById("trip-" + tripId);
  if (el) el.classList.add("selected");
  updateBookingSummary();
  showPage("booking");
}

function updateBookingSummary() {
  const t = state.trip; const ag = state.agency;
  if (!t || !ag) return;
  document.getElementById("booking-summary").innerHTML = `
    <div class="sum-row"><span class="sum-label">Agence</span><span class="sum-value">${ag.name}</span></div>
    <div class="sum-row"><span class="sum-label">Trajet</span><span class="sum-value">${state.from||"—"} → ${state.to||"—"}</span></div>
    <div class="sum-row"><span class="sum-label">Départ</span><span class="sum-value">${t.depart} — ${state.date||"—"}</span></div>
    <div class="sum-row"><span class="sum-label">Classe</span><span class="sum-value">${t.classe}</span></div>
    <div class="sum-row sum-total"><span class="sum-label">Total</span><span class="sum-value">${t.prix.toLocaleString("fr-FR")} FCFA</span></div>
  `;
}

function selectBookingType(type) {
  state.bookingType = type;
  document.getElementById("type-buy").classList.toggle("active", type === "buy");
  document.getElementById("type-reserve").classList.toggle("active", type === "reserve");
}

function proceedFromBooking() {
  if (!state.bookingType) { alert("Veuillez choisir un type de réservation."); return; }
  state.passenger.nom    = document.getElementById("p-nom").value.trim();
  state.passenger.prenom = document.getElementById("p-prenom").value.trim();
  state.passenger.cni    = document.getElementById("p-cni").value.trim();
  if (!state.passenger.nom || !state.passenger.prenom) { alert("Veuillez renseigner vos informations."); return; }
  if (state.bookingType === "reserve") { buildConfirmation(); showPage("confirmation"); }
  else { buildPaymentPage(); showPage("payment"); }
}



function buildPaymentPage() {
  const t = state.trip;
  document.getElementById("pay-amount").innerHTML =
    `Montant à payer : <strong style="color:var(--gold-light)">${t.prix.toLocaleString("fr-FR")} FCFA</strong>`;
  document.getElementById("pay-orange").classList.remove("active");
  document.getElementById("pay-onsite").classList.remove("active");
  document.getElementById("om-section").style.display = "none";
  document.getElementById("onsite-section").style.display = "none";
  state.paymentMethod = null;
}

function selectPayment(method) {
  state.paymentMethod = method;
  document.getElementById("pay-orange").classList.toggle("active", method === "orange");
  document.getElementById("pay-onsite").classList.toggle("active", method === "onsite");
  document.getElementById("om-section").style.display    = method === "orange" ? "block" : "none";
  document.getElementById("onsite-section").style.display = method === "onsite" ? "block" : "none";
}

function proceedPayment() {
  if (!state.paymentMethod) { alert("Veuillez choisir un mode de paiement."); return; }
  if (state.paymentMethod === "orange") {
    if (!document.getElementById("om-phone").value.trim()) { alert("Veuillez entrer votre numéro Orange Money."); return; }
  }
  buildConfirmation();
  showPage("confirmation");
}



function buildConfirmation() {
  const isReserve = state.bookingType === "reserve";
  const isOnsite  = state.paymentMethod === "onsite";
  const t = state.trip; const ag = state.agency; const p = state.passenger;

  let icon, title, note;
  if (isReserve) {
    icon = "📋"; title = "Réservation confirmée !";
    note = `Présentez ce code à l'agence <strong>${ag.name}</strong> le jour du départ. Place maintenue 1h avant le départ.`;
  } else if (isOnsite) {
    icon = "🏢"; title = "Réservation reçue !";
    note = `Rendez-vous à l'agence <strong>${ag.name}</strong> pour payer <strong>${t.prix.toLocaleString("fr-FR")} FCFA</strong> avant le départ.`;
  } else {
    icon = "✅"; title = "Paiement réussi !";
    note = "Un SMS de confirmation vous a été envoyé. Montrez ce code à l'entrée du bus. Bon voyage ! 🚌";
  }

  document.getElementById("conf-icon").textContent   = icon;
  document.getElementById("conf-title").textContent  = title;
  document.getElementById("conf-ref").textContent    = CONF_REF;
  document.getElementById("conf-note").innerHTML     = note;

  const statusColor = (isReserve || isOnsite) ? "var(--gold)" : "var(--green)";
  const statusText  = isReserve ? "⏳ Réservé — À payer sur place" : isOnsite ? "⏳ En attente de paiement" : "✅ Payé — Confirmé";

  document.getElementById("conf-summary").innerHTML = `
    <div class="sum-row"><span class="sum-label">Agence</span><span class="sum-value">${ag.name}</span></div>
    <div class="sum-row"><span class="sum-label">Trajet</span><span class="sum-value">${state.from||"—"} → ${state.to||"—"}</span></div>
    <div class="sum-row"><span class="sum-label">Départ</span><span class="sum-value">${t.depart} — ${state.date||"—"}</span></div>
    <div class="sum-row"><span class="sum-label">Classe</span><span class="sum-value">${t.classe}</span></div>
    <div class="sum-row"><span class="sum-label">Passager</span><span class="sum-value">${p.prenom} ${p.nom}</span></div>
    <div class="sum-row"><span class="sum-label">Statut</span><span class="sum-value" style="color:${statusColor}">${statusText}</span></div>
    <div class="sum-row sum-total"><span class="sum-label">Total</span><span class="sum-value">${t.prix.toLocaleString("fr-FR")} FCFA</span></div>
  `;
}