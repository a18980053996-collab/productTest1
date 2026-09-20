const DEMO_ACCOUNT = "18981739366";
const DEMO_PASSWORD = "Admin@2026";
const AUTH_KEY = "crm-demo-auth";
const FAIL_KEY = "crm-demo-fail";
const ENTRY_KEY = "crm-demo-entry";

const ALL_USERS = window.ALL_DEMO_USERS || [];

const state = {
  captcha: "",
  page: 1,
  pageSize: 10,
  timeType: "all",
  dateFrom: "",
  dateTo: "",
  archive: "",
  filtered: ALL_USERS.slice()
};

function $(id) {
  return document.getElementById(id);
}

function showToast(text, ok) {
  const el = $("toast");
  el.textContent = text;
  el.classList.toggle("ok", !!ok);
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 1600);
}
window.showToast = showToast;

function randomCaptcha() {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let out = "";
  for (let i = 0; i < 4; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  state.captcha = out;
  drawCaptcha();
}

function drawCaptcha() {
  const canvas = $("captchaCanvas");
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
}

function failCount() {
  return Number(sessionStorage.getItem(FAIL_KEY) || 0);
}

function setFailCount(n) {
  sessionStorage.setItem(FAIL_KEY, String(n));
}

function shakeLogin() {
  const btn = $("loginBtn");
  btn.classList.remove("shake");
  void btn.offsetWidth;
  btn.classList.add("shake");
}

function setLoginError(msg) {
  $("loginError").textContent = msg || "";
}

function currentUser() {
  try {
    return JSON.parse(sessionStorage.getItem(AUTH_KEY) || "null");
  } catch {
    return null;
  }
}

function maskPhone(phone) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

function showLogin() {
  $("view-login").classList.remove("hidden");
  $("view-app").classList.add("hidden");
  randomCaptcha();
}

function storeEntryFromUrl() {
  const params = new URLSearchParams(location.search);
  const entry = params.get("entry") || (params.get("landing") === "detail" ? "users" : "");
  if (!entry && !params.get("landing")) return;
  sessionStorage.setItem(
    ENTRY_KEY,
    JSON.stringify({
      module: entry || "users",
      landing: params.get("landing") || "",
      tab: params.get("tab") || "",
      menu: params.get("menu") || "",
      sub: params.get("sub") || "",
      id: params.get("id") || ""
    })
  );
}

function readEntry() {
  try {
    return JSON.parse(sessionStorage.getItem(ENTRY_KEY) || "null");
  } catch {
    return null;
  }
}

function applyEntryRoute() {
  const entry = readEntry();
  if (!entry) {
    goPage("users");
    return;
  }
  if (entry.landing === "detail") {
    goPage("detail", entry.id || ALL_USERS[0]?.id);
    return;
  }
  if (entry.module === "class") {
    goPage("class", { tab: entry.tab || "students" });
    return;
  }
  if (entry.module === "notice") {
    goPage("notice", { menu: entry.menu || "list", sub: entry.sub || "normal" });
    return;
  }
  goPage(entry.module === "users" ? "users" : entry.module || "users");
}

function showApp() {
  $("view-login").classList.add("hidden");
  $("view-app").classList.remove("hidden");
  const user = currentUser();
  $("topPhone").textContent = user ? maskPhone(user.account) : "";
  applyEntryRoute();
}

function goPage(name, arg) {
  const navPage = name === "detail" ? "users" : name;
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === navPage);
  });
  $("view-users").classList.toggle("hidden", name !== "users");
  $("view-detail").classList.toggle("hidden", name !== "detail");
  $("view-class-module").classList.toggle("hidden", name !== "class");
  $("view-notice-module").classList.toggle("hidden", name !== "notice");
  const isPlaceholder = !["users", "detail", "class", "notice"].includes(name);
  $("view-placeholder").classList.toggle("hidden", !isPlaceholder);

  if (name === "users") {
    $("crumb").innerHTML = "当前位置 / <b>用户管理</b>";
    renderTable();
  } else if (name === "detail") {
    $("crumb").innerHTML = "当前位置 / 用户管理 / <b>详情查看</b>";
    renderDetail(typeof arg === "string" ? arg : arg?.id);
  } else if (name === "class") {
    window.ClassModule?.open(typeof arg === "object" ? arg.tab : arg);
  } else if (name === "notice") {
    window.NoticeModule?.open(typeof arg === "object" ? arg : { menu: "list" });
  } else {
    const labels = {
      overview: "概况",
      bank: "题库",
      homework: "作业",
      tool: "工具",
      config: "配置"
    };
    $("crumb").innerHTML = `当前位置 / <b>${labels[name] || "页面"}</b>`;
    $("placeholderText").textContent = `「${labels[name] || name}」为演示占位，后续需求可在此扩展。`;
  }
}

function parseDate(str) {
  if (!str) return 0;
  return new Date(str.replace(/\//g, "-")).getTime();
}

function applyFilter() {
  const archive = $("archiveFilter").value;
  const timeType = $("timeType").value;
  const from = $("dateFrom").value;
  const to = $("dateTo").value;
  state.archive = archive;
  state.timeType = timeType;
  state.dateFrom = from;
  state.dateTo = to;
  state.filtered = ALL_USERS.filter((u) => {
    if (archive && u.archive !== archive) return false;
    if (timeType !== "all" && (from || to)) {
      const value = timeType === "reg" ? u.regDisplay || u.reg : u.last;
      const ts = parseDate(value);
      if (from && ts < new Date(from).getTime()) return false;
      if (to && ts > new Date(to).getTime() + 86400000 - 1) return false;
    }
    return true;
  });
  state.page = 1;
  renderTable();
}

function tagClass(status) {
  if (status === "已完成") return "done";
  if (status === "已填写") return "part";
  return "wait";
}

function renderTable() {
  const total = state.filtered.length;
  const pages = Math.max(1, Math.ceil(total / state.pageSize));
  if (state.page > pages) state.page = pages;
  const start = (state.page - 1) * state.pageSize;
  const rows = state.filtered.slice(start, start + state.pageSize);
  $("userTableBody").innerHTML = rows
    .map(
      (u) => `<tr class="clickable" data-id="${u.id}">
        <td>${u.id}</td>
        <td>${u.nick}</td>
        <td>${u.phone}</td>
        <td>${u.regDisplay || u.reg}</td>
        <td>${u.last}</td>
        <td><span class="tag ${tagClass(u.archive)}">${u.archive}</span></td>
        <td><a class="link" href="#" data-id="${u.id}">详情</a></td>
      </tr>`
    )
    .join("");
  $("totalCount").textContent = `共计${total}条数据`;
  const buttons = [];
  for (let i = 1; i <= pages; i += 1) {
    buttons.push(`<button class="page-btn${i === state.page ? " active" : ""}" data-page="${i}">${i}</button>`);
  }
  $("pageButtons").innerHTML = buttons.join("");
}

function renderDetail(userId) {
  const u = ALL_USERS.find((item) => item.id === userId) || ALL_USERS[0];
  $("detailAvatar").textContent = u.nick.slice(0, 1);
  $("detailNick").textContent = u.nick;
  $("detailAccount").textContent = `登录账号：${u.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1 $2 $3")}`;
  $("detailId").textContent = `用户ID：${u.id}`;
  $("kvLogin").innerHTML = `
    <div class="kv"><dt>最后登录时间</dt><dd>${u.lastLoginFull}</dd></div>
    <div class="kv"><dt>最后登录IP</dt><dd>${u.ip}</dd></div>
    <div class="kv"><dt>登录地区</dt><dd>${u.region}</dd></div>
    <div class="kv"><dt>登录系统</dt><dd>${u.system}</dd></div>
    <div class="kv"><dt>注册时间</dt><dd>${u.reg}</dd></div>`;
  $("kvArchive").innerHTML = `
    <div class="kv"><dt>姓名</dt><dd>${u.name}</dd></div>
    <div class="kv"><dt>性别</dt><dd>${u.gender}</dd></div>
    <div class="kv"><dt>民族</dt><dd>${u.nation}</dd></div>
    <div class="kv"><dt>户籍</dt><dd>${u.household || "-"}</dd></div>
    <div class="kv"><dt>最高学历</dt><dd>${u.education}</dd></div>
    <div class="kv"><dt>所学专业</dt><dd>${u.major}</dd></div>
    <div class="kv"><dt>持有证书情况</dt><dd>${u.cert}</dd></div>
    <div class="kv"><dt>政治面貌</dt><dd>${u.politics}</dd></div>
    <div class="kv"><dt>备考次数</dt><dd>${u.times}</dd></div>
    <div class="kv"><dt>备考方向</dt><dd>${u.direction}</dd></div>
    <div class="kv"><dt>报考身份</dt><dd>${u.identity}</dd></div>
    <div class="kv"><dt>报考特殊条件</dt><dd>${u.special}</dd></div>
    <div class="kv"><dt>意向报考地1</dt><dd>${u.city}</dd></div>
    <div class="kv"><dt>意向报考地2</dt><dd>${u.city2 || "-"}</dd></div>
    <div class="kv"><dt>意向报考地3</dt><dd>${u.city3 || "-"}</dd></div>`;
}

function handleLogin(event) {
  event.preventDefault();
  const account = $("account").value.trim();
  const password = $("password").value;
  const captcha = $("captcha").value.trim().toUpperCase();

  if (failCount() >= 5) {
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
    $("captcha").value = "";
    return;
  }
  if (account !== DEMO_ACCOUNT || password !== DEMO_PASSWORD) {
    const n = failCount() + 1;
    setFailCount(n);
    if (n >= 5) {
      setLoginError("账号已禁用，请联系管理员");
    } else {
      setLoginError(`账号或密码错误(${n}/5)，请重新输入`);
    }
    shakeLogin();
    randomCaptcha();
    $("captcha").value = "";
    return;
  }

  setFailCount(0);
  sessionStorage.setItem(AUTH_KEY, JSON.stringify({ account }));
  showToast("登录成功", true);
  setTimeout(() => showApp(), 400);
}

function bindEvents() {
  $("loginForm").addEventListener("submit", handleLogin);
  ["account", "password", "captcha"].forEach((id) => {
    $(id).addEventListener("focus", () => setLoginError(""));
  });
  $("captchaCanvas").addEventListener("click", () => {
    randomCaptcha();
    $("captcha").value = "";
  });
  $("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem(AUTH_KEY);
    $("loginForm").reset();
    setLoginError("");
    showLogin();
  });
  $("searchBtn").addEventListener("click", applyFilter);
  $("resetBtn").addEventListener("click", () => {
    $("timeType").value = "all";
    $("dateFrom").value = "";
    $("dateTo").value = "";
    $("archiveFilter").value = "";
    applyFilter();
  });
  $("pageSize").addEventListener("change", () => {
    state.pageSize = Number($("pageSize").value);
    state.page = 1;
    renderTable();
  });
  $("jumpBtn").addEventListener("click", () => {
    const n = Number($("jumpPage").value);
    const pages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
    if (n >= 1 && n <= pages) {
      state.page = n;
      renderTable();
    }
  });
  $("pageButtons").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn) return;
    state.page = Number(btn.dataset.page);
    renderTable();
  });
  $("userTableBody").addEventListener("click", (e) => {
    const link = e.target.closest("[data-id]");
    if (!link) return;
    e.preventDefault();
    goPage("detail", link.dataset.id);
  });
  $("backBtn").addEventListener("click", () => goPage("users"));
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => goPage(btn.dataset.page));
  });
}

function init() {
  bindEvents();
  storeEntryFromUrl();
  if (currentUser()) showApp();
  else showLogin();
}

document.addEventListener("DOMContentLoaded", init);
