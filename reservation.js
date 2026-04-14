// ============ RÉSERVATION ============
function selectTrip(tripId) {
  state.trip = SCHEDULES.find(t => t.id === tripId);
  document.querySelectorAll(".trip-card").forEach(c => c.classList.remove("selected"));
  const el = document.getElementById("trip-" + tripId);
  if (el) el.classList.add("selected");
  updateBookingSummary();
  showPage("booking");
}
function updateBookingSummary() {
  const t = state.trip;
  const ag = state.agency;
  if (!t || !ag) return;
  document.getElementById("booking-summary").innerHTML = `
    <div class="sum-row"><span class="sum-label">Agence</span><span class="sum-value">${ag.name}</span></div>
    <div class="sum-row"><span class="sum-label">Trajet</span><span class="sum-value">${state.from||"—"} 
    <div class="sum-row"><span class="sum-label">Date départ</span><span class="sum-value">${t.depart} — ${state.date||"—"}</span></div>
    <div class="sum-row"><span class="sum-label">Classe</span><span class="sum-value">${t.classe}</span></div>
    <div class="sum-row sum-total"><span class="sum-label">Total</span><span class="sum-value">${t.prix.toLocaleString("fr-FR")} FCFA</span></div>
  `;
}
function selectBookingType(type) {
  state.bookingType = type;
  document.getElementById("type-buy").classList.toggle("active",     type === "buy");
  document.getElementById("type-reserve").classList.toggle("active", type === "reserve");
}
function proceedFromBooking() {
  if (!state.bookingType) {
    alert("Veuillez choisir un type de réservation."); return;
  }
  state.passenger.nom    = document.getElementById("p-nom").value.trim();
  state.passenger.prenom = document.getElementById("p-prenom").value.trim();
  state.passenger.cni    = document.getElementById("p-cni").value.trim();
  if (!state.passenger.nom || !state.passenger.prenom) {
    alert("Veuillez renseigner votre nom et prénom."); return;
  }
  if (state.bookingType === "reserve") {
    buildConfirmation();
    showPage("confirmation");
  } else {
    buildPaymentPage();
    showPage("payment");
  }
}