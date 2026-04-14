// ============ INJECTION PAGE REGISTER ============
function injectRegisterPage() {
  const page = document.createElement("div");
  page.id = "page-register";
  page.className = "page";
  page.innerHTML = `
    <div class="content-wrap">
      <button class="back-btn" onclick="showPage('login')">← Connexion</button>
      <p class="page-title">Créer un compte</p>
      <p class="page-sub">Inscrivez-vous pour gérer vos réservations</p>
      <div class="form-grid2">
        <div class="form-group">
          <label class="form-label">Nom</label>
          <input type="text" id="reg-nom" placeholder="MBARGA"/>
        </div>
        <div class="form-group">
          <label class="form-label">Prénom</label>
          <input type="text" id="reg-prenom" placeholder="Jean-Pierre"/>
        </div>
      </div>
      <div class="form-group" style="margin:14px 0;">
        <label class="form-label">Email</label>
        <input type="text" id="reg-email" placeholder="exemple@gmail.com"/>
      </div>
      <div class="form-group" style="margin-bottom:24px;">
        <label class="form-label">Mot de passe</label>
        <input type="password" id="reg-password" placeholder="Minimum 6 caractères"/>
      </div>
      <button class="btn btn-gold btn-full" onclick="handleRegister()">Créer mon compte →</button>
      <p style="text-align:center;margin-top:20px;color:var(--muted);font-size:.88rem;">
        Déjà un compte ?
        <span style="color:var(--gold);cursor:pointer;font-weight:700;"
          onclick="showPage('login')"> Se connecter</span>
      </p>
    </div>
  `;
  document.body.insertBefore(page, document.querySelector("footer"));
}