// ============ INJECTION PAGE LOGIN ============
function injectLoginPage() {
  const page = document.createElement("div");
  page.id = "page-login";
  page.className = "page";
  page.innerHTML = `
    <div class="content-wrap">
      <button class="back-btn" onclick="goHome()">← Retour</button>
      <p class="page-title">Connexion</p>
      <p class="page-sub">Connectez-vous pour accéder à vos billets</p>
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Email</label>
        <input type="text" id="login-email" placeholder="exemple@gmail.com"/>
      </div>
      <div class="form-group" style="margin-bottom:24px;">
        <label class="form-label">Mot de passe</label>
        <input type="password" id="login-password" placeholder="••••••••"/>
      </div>
      <button class="btn btn-gold btn-full" onclick="handleLogin()">Se connecter →</button>
      <p style="text-align:center;margin-top:20px;color:var(--muted);font-size:.88rem;">
        Pas encore de compte ?
        <span style="color:var(--gold);cursor:pointer;font-weight:700;"
          onclick="showPage('register')"> S'inscrire</span>
      </p>
    </div>
  `;
}
  document.body.insertBefore(page, document.querySelector("footer"));