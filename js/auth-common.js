window.CRM_DEMO = {
  account: "18981739366",
  password: "Admin@2026",
  authKey: "crm-demo-auth",
  failKey: "crm-demo-fail"
};

window.crm$ = (id) => document.getElementById(id);

window.crmToast = (text, ok) => {
  const el = crm$("toast");
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("ok", !!ok);
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 1600);
};

window.crmMaskPhone = (phone) => phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");

window.crmCurrentUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem(CRM_DEMO.authKey) || "null");
  } catch {
    return null;
  }
};

window.crmFailCount = () => Number(sessionStorage.getItem(CRM_DEMO.failKey) || 0);
window.crmSetFailCount = (n) => sessionStorage.setItem(CRM_DEMO.failKey, String(n));

window.crmBindLogin = ({ onSuccess }) => {
  const state = { captcha: "" };

  const drawCaptcha = () => {
    const canvas = crm$("captchaCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 6; i += 1) {
      ctx.strokeStyle = `rgba(59,130,246,${Math.random() * 0.35})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * w, Math.random() * h);
      ctx.lineTo(Math.random() * w, Math.random() * h);
      ctx.stroke();
    }
    ctx.font = "bold 22px Menlo, monospace";
    ctx.fillStyle = "#1e3a8a";
    ctx.textBaseline = "middle";
    ctx.fillText(state.captcha, 14, h / 2 + 1);
  };

  const randomCaptcha = () => {
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let out = "";
    for (let i = 0; i < 4; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
    state.captcha = out;
    drawCaptcha();
  };

  const setLoginError = (msg) => {
    const el = crm$("loginError");
    if (el) el.textContent = msg || "";
  };

  const shakeLogin = () => {
    const btn = crm$("loginBtn");
    if (!btn) return;
    btn.classList.remove("shake");
    void btn.offsetWidth;
    btn.classList.add("shake");
  };

  const showLogin = () => {
    crm$("view-login").classList.remove("hidden");
    crm$("view-app").classList.add("hidden");
    randomCaptcha();
  };

  const showApp = () => {
    crm$("view-login").classList.add("hidden");
    crm$("view-app").classList.remove("hidden");
    const user = crmCurrentUser();
    const top = crm$("topPhone");
    if (top) top.textContent = user ? crmMaskPhone(user.account) : "";
    onSuccess();
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const account = crm$("account").value.trim();
    const password = crm$("password").value;
    const captcha = crm$("captcha").value.trim().toUpperCase();

    if (crmFailCount() >= 5) {
      setLoginError("账号已禁用，请联系管理员");
      shakeLogin();
      randomCaptcha();
      return;
    }
    if (!account) {
      setLoginError("账号不能为空");
      shakeLogin();
      return;
    }
    if (!password) {
      setLoginError("密码不能为空");
      shakeLogin();
      return;
    }
    if (!captcha) {
      setLoginError("请输入验证码");
      shakeLogin();
      return;
    }
    if (captcha !== state.captcha) {
      setLoginError("验证码输入错误");
      shakeLogin();
      randomCaptcha();
      crm$("captcha").value = "";
      return;
    }
    if (account !== CRM_DEMO.account || password !== CRM_DEMO.password) {
      const n = crmFailCount() + 1;
      crmSetFailCount(n);
      setLoginError(n >= 5 ? "账号已禁用，请联系管理员" : `账号或密码错误(${n}/5)，请重新输入`);
      shakeLogin();
      randomCaptcha();
      crm$("captcha").value = "";
      return;
    }

    crmSetFailCount(0);
    sessionStorage.setItem(CRM_DEMO.authKey, JSON.stringify({ account }));
    crmToast("登录成功", true);
    setTimeout(showApp, 400);
  };

  crm$("loginForm").addEventListener("submit", handleLogin);
  ["account", "password", "captcha"].forEach((id) => {
    crm$(id).addEventListener("focus", () => setLoginError(""));
  });
  crm$("captchaCanvas").addEventListener("click", () => {
    randomCaptcha();
    crm$("captcha").value = "";
  });
  crm$("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem(CRM_DEMO.authKey);
    crm$("loginForm").reset();
    setLoginError("");
    showLogin();
  });

  return { showLogin, showApp, randomCaptcha };
};
