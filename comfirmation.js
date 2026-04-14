// ============ CONFIRMATION + FIREBASE ============
async function buildConfirmation() {
  const isReserve = state.bookingType === "reserve";
  const isOnsite  = state.paymentMethod === "onsite";
  const t  = state.trip;
  const ag = state.agency;
  const p  = state.passenger;
  let icon, title, note;
  if (isReserve) {
    icon  = " ";
    title = "Réservation confirmée !";
    note  = `Présentez ce code à l'agence <strong>${ag.name}</strong> le jour du départ. Place maintenue 1h avant le départ.`;
  } else if (isOnsite) {
    icon  = " ";
    title = "Réservation reçue !";
    note  = `Rendez-vous à l'agence <strong>${ag.name}</strong> avant le départ pour payer <strong>${t.prix.toLocaleString("fr-FR")} FCFA</strong>.`;
  } else {
    icon  = " ";
    title = "Paiement réussi !";
    note  = "Un SMS de confirmation vous a été envoyé. Montrez ce code à l'entrée du bus. Bon voyage !"
  }
  document.getElementById("conf-icon").textContent  = icon;
  document.getElementById("conf-title").textContent = title;
  document.getElementById("conf-ref").textContent   = CONF_REF;
  document.getElementById("conf-note").innerHTML    = note;
  const statusColor = (isReserve || isOnsite) ? "var(--gold)" : "var(--green)";
  const statusText  = isReserve ? " Réservé — À payer sur place"
                    : isOnsite  ? " En attente de paiement"
                    : "Payé   Confirmé";
 
  document.getElementById("conf-summary").innerHTML = `
    <div class="sum-row"><span class="sum-label">Référence</span><span class="sum-value" style="color:var(--gold-light);letter-spacing:2px;">${CONF_REF}</span></div>
    <div class="sum-row"><span class="sum-label">Agence</span><span class="sum-value">${ag.name}</span></div>
    <div class="sum-row"><span class="sum-label">Trajet</span><span class="sum-value">${state.from||"—"} 
    <div class="sum-row"><span class="sum-label">Départ</span><span class="sum-value">${t.depart} — ${state.date||"—"}</span></div>
    <div class="sum-row"><span class="sum-label">Classe</span><span class="sum-value">${t.classe}</span></div>
    <div class="sum-row"><span class="sum-label">Passager</span><span class="sum-value">${p.prenom} ${p.nom}</span></div>
    <div class="sum-row"><span class="sum-label">Statut</span><span class="sum-value" style="color:${statusColor}">${statusText}</span></div>
    <div class="sum-row sum-total"><span class="sum-label">Total</span><span class="sum-value">${t.prix.toLocaleString("fr-FR")} FCFA</span></div>
  `;
  //  ENREGISTREMENT FIREBASE
  showLoader("Enregistrement de votre réservation...");
  await saveReservation({
    reference:       CONF_REF,
    agence:          ag.name,
    depart:          state.from,
    destination:     state.to,
    date:            state.date,
    heure:           t.depart,
    arrivee:         t.arrivee,
    classe:          t.classe,
    prix:            t.prix,
    typeReservation: state.bookingType,
    paiement:        state.paymentMethod,
    nom:             p.nom,
    prenom:          p.prenom,
    cni:             p.cni
  });
  hideLoader();
}
