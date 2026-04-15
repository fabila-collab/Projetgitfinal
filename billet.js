// ============ PAGE MES BILLETS ============
async function loadMesBillets() {
  if (!currentUser) {
    showPage("login"); return;
  }
  showLoader("Chargement de vos billets...");
  const reservations = await getUserReservations();
  hideLoader();
  const container = document.getElementById("billets-container");
  if (!container) return;
  if (reservations.length === 0) {
    container.innerHTML = `
      <p style="color:var(--muted);text-align:center;padding:60px 0;font-size:1rem;">
        Aucun billet trouvé. Faites votre première réservation ! 
      </p>`;
    return;
  }
  container.innerHTML = reservations.map(r => `
    <div class="summary-box" style="margin-bottom:16px;">
      <div class="sum-row">
        <span class="sum-label">Référence</span>
        <span class="sum-value" style="color:var(--gold-light);letter-spacing:2px;">
              </div>
      <div class="sum-row"><span class="sum-label">Agence</span><span class="sum-value">${r.agence}</span></div>
      <div class="sum-row"><span class="sum-label">Trajet</span><span class="sum-value">${r.depart} 
      <div class="sum-row"><span class="sum-label">Date</span><span class="sum-value">${r.date} à ${r.heure}</span></div>
      <div class="sum-row"><span class="sum-label">Classe</span><span class="sum-value">${r.classe}</span></div>
      <div class="sum-row"><span class="sum-label">Passager</span><span class="sum-value">${r.passager?.prenom} ${r.passager?.nom}</span></div>
      <div class="sum-row"><span class="sum-label">Prix</span><span class="sum-value">${r.prix?.toLocaleString("fr-FR")} FCFA</span></div>
      <div class="sum-row">
        <span class="sum-label">Statut</span>
        <span class="sum-value" style="color:${r.statut === 'payé' ? 'var(--green)' : 'var(--gold)'}">
          ${r.statut === 'payé' ? ' Payé' : ' Réservé'}
        </span>
      </div>
    </div>
  `).join("");
  }