(() => {
const el = (id) => document.getElementById(id);
const toast = (text, ok) => (window.showToast ? window.showToast(text, ok) : alert(text));

const CLASS_STUDENTS = [
  { id: "UX202607001", name: "张三", phone: "18981739366", wxNick: "闲云野鹤", year: "2027级", category: "长效班", className: "泰山班", campus: "金华校区", region: "浙江省", archive: "待填写", account: "已启用", last: "2026/12/23 14:00", channel: "微信" },
  { id: "UX202607002", name: "李四", phone: "13681739366", wxNick: "亮晶晶", year: "2027级", category: "长效班", className: "泰山班", campus: "金华校区", region: "浙江省", archive: "已填写", account: "已启用", last: "2026/12/23 14:00", channel: "微信" },
  { id: "UX202607003", name: "王五", phone: "13481739366", wxNick: "-", year: "2027级", category: "冲刺班", className: "华山班", campus: "成都高新校区", region: "四川省", archive: "待填写", account: "已启用", last: "-", channel: "占位" },
  { id: "UX202607004", name: "赵六", phone: "13281739366", wxNick: "青云直上", year: "2026级", category: "基础班", className: "衡山班", campus: "绵阳涪城校区", region: "四川省", archive: "已完成", account: "已禁用", last: "2026/08/01 18:00", channel: "微信" }
];

const classState = { tab: "students", filtered: CLASS_STUDENTS.slice(), currentId: null };

function setClassTab(tab) {
  classState.tab = tab;
  document.querySelectorAll("[data-class-tab]").forEach((btn) => btn.classList.toggle("active", btn.dataset.classTab === tab));
  ["students", "detail", "edit", "import", "campus", "category", "manage", "h5"].forEach((key) => {
    const panel = el(`view-class-${key}`);
    if (panel) panel.classList.toggle("hidden", tab !== key);
  });
  const labels = {
    students: "班级管理 / <b>学员管理</b>",
    detail: "班级管理 / 学员管理 / <b>学员详情</b>",
    edit: "班级管理 / 学员管理 / <b>学员修改</b>",
    import: "班级管理 / <b>学员导入</b>",
    campus: "班级管理 / <b>校区管理</b>",
    category: "班级管理 / <b>班级类别</b>",
    manage: "班级管理 / <b>班级管理</b>",
    h5: "班级管理 / <b>H5邀请码 · 填录信息</b>"
  };
  el("crumb").innerHTML = `当前位置 / ${labels[tab] || "班级管理"}`;
  if (tab === "students") renderStudentCards();
  if (tab === "detail") renderStudentDetail();
  if (tab === "edit") renderStudentEdit();
}

function applyStudentFilter() {
  const year = el("filterYear").value;
  const region = el("filterRegion").value;
  const campus = el("filterCampus").value;
  const category = el("filterCategory").value;
  const cls = el("filterClass").value;
  const archive = el("filterArchive").value;
  const account = el("filterAccount").value;
  const kw = el("filterKeyword").value.trim();
  classState.filtered = CLASS_STUDENTS.filter((s) => {
    if (year && s.year !== year) return false;
    if (region && s.region !== region) return false;
    if (campus && s.campus !== campus) return false;
    if (category && s.category !== category) return false;
    if (cls && s.className !== cls) return false;
    if (archive && s.archive !== archive) return false;
    if (account && s.account !== account) return false;
    if (kw && !(`${s.name}${s.phone}${s.id}`.includes(kw))) return false;
    return true;
  });
  renderStudentCards();
}

function renderStudentCards() {
  const list = classState.filtered;
  el("studentGrid").innerHTML = list.length
    ? list
        .map(
          (s) => `<article class="stu-card">
        <div class="avatar-sm">${s.channel === "占位" ? "占位" : s.name.slice(0, 1)}</div>
        <div>
          <div><strong>${s.phone}</strong> ${s.name}</div>
          <div class="lines">学号：${s.id}</div>
          <div class="lines">${s.category} · ${s.className} · ${s.campus}</div>
          <div class="lines">${s.region} · ${s.year} · 档案：${s.archive} · 账号：${s.account}</div>
          <div class="lines">最后登录：${s.last}</div>
        </div>
        <div class="actions">
          <a href="#" class="link" data-action="edit" data-id="${s.id}">修改</a> |
          <a href="#" class="link" data-action="disable" data-id="${s.id}">禁用</a> |
          <a href="#" class="link" data-action="detail" data-id="${s.id}">详情</a>
        </div>
      </article>`
        )
        .join("")
    : `<p class="placeholder" style="padding:40px">暂无学员数据（查询无内容时空页展示）</p>`;
  el("studentTotal").textContent = `共计 ${list.length} 条`;
}

function currentStudent() {
  return CLASS_STUDENTS.find((s) => s.id === classState.currentId) || CLASS_STUDENTS[0];
}

function renderStudentDetail() {
  const s = currentStudent();
  const u = (window.ALL_DEMO_USERS || []).find((x) => x.id === s.id) || {};
  el("detailStudentKv").innerHTML = `
    <div class="user-card" style="margin-bottom:12px">
      <div class="avatar">${s.name.slice(0, 1)}</div>
      <div><div style="font-weight:650">微信昵称：${s.wxNick}</div><div class="meta">登录账号：${s.phone}</div></div>
    </div>
    <div class="section-title">登录信息</div>
    <div class="kv-grid">
      <div class="kv"><dt>最后登录时间</dt><dd>${u.lastLoginFull || s.last}</dd></div>
      <div class="kv"><dt>最后登录IP</dt><dd>${u.ip || "-"}</dd></div>
      <div class="kv"><dt>登录地区</dt><dd>${u.region || "-"}</dd></div>
      <div class="kv"><dt>登录系统</dt><dd>${u.system || "-"}</dd></div>
      <div class="kv"><dt>注册时间</dt><dd>${u.reg || "-"}</dd></div>
    </div>
    <div class="detail-section"><div class="section-title">基本信息 / 档案</div>
    <div class="kv-grid">
      <div class="kv"><dt>姓名</dt><dd>${u.name || s.name}</dd></div>
      <div class="kv"><dt>民族</dt><dd>${u.nation || "-"}</dd></div>
      <div class="kv"><dt>最高学历</dt><dd>${u.education || "-"}</dd></div>
      <div class="kv"><dt>所学专业</dt><dd>${u.major || "-"}</dd></div>
    </div></div>
    <div class="detail-section"><div class="section-title">班级信息（${s.year}）</div>
    <div class="kv-grid">
      <div class="kv"><dt>学号</dt><dd>${u.studentNo || s.id}</dd></div>
      <div class="kv"><dt>所属班级</dt><dd>${s.campus}/${s.className}/${s.category}</dd></div>
      <div class="kv"><dt>招生老师</dt><dd>${u.teacher || "张老师"}</dd></div>
    </div></div>`;
}

function renderStudentEdit() {
  const s = currentStudent();
  el("editName").value = s.name;
  el("editPhone").value = s.phone;
  el("editClassName").value = s.className;
  el("editCategorySel").value = s.category;
  el("editYear").value = s.year;
  el("editRegion").value = s.region;
  el("editCampusSel").value = s.campus;
  el("editStudentNo").value = s.id;
}

function openDisableModal(id) {
  classState.currentId = id;
  el("disableModal").classList.remove("hidden");
  el("disableReason").value = "";
}

function closeDisableModal() {
  el("disableModal").classList.add("hidden");
}

function bindClassEvents() {
  document.querySelectorAll("[data-class-tab]").forEach((btn) => btn.addEventListener("click", () => setClassTab(btn.dataset.classTab)));
  el("studentSearchBtn").addEventListener("click", applyStudentFilter);
  el("studentResetBtn").addEventListener("click", () => {
    ["filterYear", "filterRegion", "filterCampus", "filterCategory", "filterClass", "filterArchive", "filterAccount", "filterKeyword"].forEach((id) => {
      el(id).value = "";
    });
    classState.filtered = CLASS_STUDENTS.slice();
    renderStudentCards();
  });
  el("studentGrid").addEventListener("click", (e) => {
    const link = e.target.closest("[data-action]");
    if (!link) return;
    e.preventDefault();
    classState.currentId = link.dataset.id;
    const act = link.dataset.action;
    if (act === "disable") openDisableModal(link.dataset.id);
    else setClassTab(act === "edit" ? "edit" : "detail");
  });
  el("confirmDisableBtn").addEventListener("click", () => {
    const text = el("disableReason").value.trim();
    if (!text) {
      toast("请填写禁用说明（限200字）", false);
      return;
    }
    closeDisableModal();
    toast("账号已禁用（Demo）", true);
    setClassTab("students");
  });
  el("cancelDisableBtn").addEventListener("click", closeDisableModal);
  el("backStudentsBtn").addEventListener("click", () => setClassTab("students"));
  el("saveStudentBtn").addEventListener("click", () => {
    toast("学员信息修改成功", true);
    setClassTab("students");
  });
  el("importDemoBtn").addEventListener("click", () => toast("操作失败：校区/班级类别/班级须创建后导入", false));
  el("downloadTplBtn").addEventListener("click", () => toast("已下载导入模板（Demo）", true));
  el("openH5Btn").addEventListener("click", () => setClassTab("h5"));
}

let classEventsBound = false;

window.ClassModule = {
  open(tab) {
    if (!classEventsBound) {
      bindClassEvents();
      classEventsBound = true;
    }
    setClassTab(tab || "students");
  }
};
})();
