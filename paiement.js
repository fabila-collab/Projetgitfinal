// ============ PAIEMENT ============
function buildPaymentPage() {
  const t = state.trip;
  document.getElementById("pay-amount").innerHTML =
    `Montant à payer : <strong style="color:var(--gold-light)">${t.prix.toLocaleString("fr-FR")} FCFA</strong>`;
  document.getElementById("pay-orange").classList.remove("active");
  document.getElementById("pay-onsite").classList.remove("active");
  document.getElementById("om-section").style.display     = "none";
  document.getElementById("onsite-section").style.display = "none";
  state.paymentMethod = null;
}
function selectPayment(method) {
  state.paymentMethod = method;
  document.getElementById("pay-orange").classList.toggle("active", method === "orange");
  document.getElementById("pay-onsite").classList.toggle("active", method === "onsite");
  document.getElementById("om-section").style.display     = method === "orange" ? "block" : "none";
  document.getElementById("onsite-section").style.display = method === "onsite"  ? "block" : "none";
}
function proceedPayment() {
  if (!state.paymentMethod) {
    alert("Veuillez choisir un mode de paiement."); return;
  }
  if (state.paymentMethod === "orange") {
    const phone = document.getElementById("om-phone").value.trim();
    if (!phone) { alert("Veuillez entrer votre numéro Orange Money."); return; }
  }
  buildConfirmation();
  showPage("confirmation");
}