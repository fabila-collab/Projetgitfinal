// ============ INJECTION PAGE MES BILLETS ============
function injectMesBilletsPage() {
  const page = document.createElement("div");
  page.id = "page-mes-billets";
  page.className = "page";
  page.innerHTML = `
    <div class="content-wrap">
      <button class="back-btn" onclick="goHome()">← Retour</button>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <p class="page-title">Mes Billets</p>
        <button class="btn btn-outline" onclick="logoutUser()"
          style="padding:8px 18px;font-size:.78rem;">
          Déconnexion
        </button>
      </div>
      <p class="page-sub">Historique de vos réservations et achats</p>
      <div id="billets-container"></div>
    </div>
  `;
  document.body.insertBefore(page, document.querySelector("footer"));
}
// ============ HANDLERS FORMULAIRES AUTH ============
function handleLogin() {
  const email    = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  if (!email || !password) { alert("Remplissez tous les champs."); return; }
  loginUser(email, password);
}
function handleRegister() {
  const nom      = document.getElementById("reg-nom").value.trim();
  const prenom   = document.getElementById("reg-prenom").value.trim();
  const email    = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value.trim();
  if (!nom || !prenom || !email || !password) { alert("Remplissez tous les champs."); return; }
  if (password.length < 6) { alert("Le mot de passe doit avoir au moins 6 caractères."); return; }
  registerUser(email, password, nom, prenom);
}