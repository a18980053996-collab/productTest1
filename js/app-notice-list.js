(() => {
const el = (id) => document.getElementById(id);
const toast = (text, ok) => (window.showToast ? window.showToast(text, ok) : alert(text));

const NOTICES = [
  { id: "NT001", title: "2025年度四川省省直机关公开遴选和公开选调公务员公告…", type: "省考", status: "报名中", recruit: 100, subscribe: 190, views: 1200, time: "2026/12/23 14:00" },
  { id: "NT002", title: "中共四川省委组织部关于2025年度四川省司法行政系统公告…", type: "省考", status: "已结束", recruit: 50, subscribe: 120, views: 1200, time: "2026/12/23 14:00" },
  { id: "NT003", title: "2025年度军队文职人员公开招考公告", type: "军队文职", status: "报名中", recruit: 5, subscribe: 80, views: 800, time: "2026/12/20 10:00" },
  { id: "NT004", title: "某央国企春季校园招聘公告", type: "央国企", status: "未开始", recruit: "若干", subscribe: 0, views: 0, time: "2026/12/18 09:00" }
];

const noticeState = { menu: "list", sub: "normal", currentId: null };

function setNoticeMenu(menu) {
  noticeState.menu = menu;
  const crumb = el("crumb");
  if (crumb) {
    const labels = { list: "信息列表 v1.1", form: "信息/修改发布", detail: "查看详情", progress: "考试进度" };
    crumb.innerHTML = `当前位置 / 公告管理 / <b>${labels[menu] || "信息列表 v1.1"}</b>`;
  }
  document.querySelectorAll("[data-notice-menu]").forEach((btn) => btn.classList.toggle("active", btn.dataset.noticeMenu === menu));
  const listPanel = el("noticeListPanel");
  const formPanel = el("noticeFormPanel");
  const detailPanel = el("noticeDetailPanel");
  const progressPanel = el("noticeProgressPanel");
  if (listPanel) listPanel.classList.toggle("hidden", menu !== "list");
  if (formPanel) formPanel.classList.toggle("hidden", menu !== "form");
  if (detailPanel) detailPanel.classList.toggle("hidden", menu !== "detail");
  if (progressPanel) progressPanel.classList.toggle("hidden", menu !== "progress");
  if (menu === "list") renderNoticeTable();
  if (menu === "detail") renderNoticeDetail();
  if (menu === "form") renderNoticeForm();
}

function setNoticeSub(sub) {
  noticeState.sub = sub;
  document.querySelectorAll("[data-notice-sub]").forEach((btn) => btn.classList.toggle("active", btn.dataset.noticeSub === sub));
  const subHint = el("subHint");
  if (subHint) subHint.textContent = {
    normal: "普通公告-原有功能",
    jobtable: "职位表公告-信息/修改发布",
    jobimg: "职位图-信息/修改发布",
    progress: "考试进度管理",
    feedback: "考试进度反馈"
  }[sub];
  if (sub === "progress" || sub === "feedback") {
    const hint = el("progressHint");
    if (hint) {
      hint.textContent = sub === "progress"
        ? "考试进度管理：添加/修改考试进度、查看（Axure 对齐 Demo）。"
        : "考试进度反馈：用户反馈明细列表（Axure 对齐 Demo）。";
    }
    setNoticeMenu("progress");
  } else setNoticeMenu("list");
}

function applyNoticeFilter() {
  renderNoticeTable();
}

function renderNoticeTable() {
  const type = el("filterExamType").value;
  const status = el("filterNoticeStatus").value;
  const rows = NOTICES.filter((n) => {
    if (type && n.type !== type) return false;
    if (status && n.status !== status) return false;
    return true;
  });
  const tbody = el("noticeTableBody");
  if (!tbody) return;
  tbody.innerHTML = rows
    .map(
      (n) => `<tr>
      <td>${n.title}</td><td>${n.type}</td><td><span class="status-pill ${n.status === "报名中" ? "on" : "off"}">${n.status}</span></td>
      <td>${n.recruit}</td><td>${n.subscribe}</td><td>${n.views}</td><td>${n.time}</td>
      <td><a href="#" class="link" data-action="detail" data-id="${n.id}">详情</a>
      <a href="#" class="link" data-action="edit" data-id="${n.id}">修改</a></td></tr>`
    )
    .join("");
}

function currentNotice() {
  return NOTICES.find((n) => n.id === noticeState.currentId) || NOTICES[0];
}

function renderNoticeDetail() {
  const n = currentNotice();
  el("noticeDetailKv").innerHTML = `
    <div class="kv-grid">
      <div class="kv"><dt>标题</dt><dd>${n.title}</dd></div>
      <div class="kv"><dt>招考类型</dt><dd>${n.type}</dd></div>
      <div class="kv"><dt>公告状态</dt><dd>${n.status}（按发布起止时间动态计算）</dd></div>
      <div class="kv"><dt>招考人数</dt><dd>${n.recruit}</dd></div>
      <div class="kv"><dt>订阅通知(人)</dt><dd>${n.subscribe}</dd></div>
      <div class="kv"><dt>浏览量</dt><dd>${n.views}</dd></div>
      <div class="kv" style="grid-column:1/-1"><dt>正文</dt><dd>根据公务员法…（普通公告正文 Demo，对齐 Axure 查看详情）</dd></div>
    </div>`;
}

function renderNoticeForm() {
  const n = noticeState.currentId ? currentNotice() : null;
  el("formExamType").value = n ? n.type : "省考";
  el("formTitle").value = n ? n.title : "";
  el("formSource").value = n ? "中共四川省委组织部" : "";
  el("formOrigin").value = n ? "四川省司法厅" : "";
  el("formUrl").value = n ? "https://sft.sc.gov.cn/sfxzyw/2025/2/28/example.shtml" : "";
  el("formRecruit").value = n ? n.recruit : "";
  el("formRegion").value = "全国/四川省/地市名称";
  el("formBody").value = "根据公务员法和《公务员转任规定》…（富文本 Demo）";
}

function bindNoticeEvents() {
  document.querySelectorAll("[data-notice-sub]").forEach((btn) => btn.addEventListener("click", () => setNoticeSub(btn.dataset.noticeSub)));
  const createBtn = el("createNoticeBtn");
  if (!createBtn) return;
  createBtn.addEventListener("click", () => {
    noticeState.currentId = null;
    setNoticeMenu("form");
  });
  el("noticeSearchBtn")?.addEventListener("click", applyNoticeFilter);
  el("noticeTableBody")?.addEventListener("click", (e) => {
    const link = e.target.closest("[data-action]");
    if (!link) return;
    e.preventDefault();
    noticeState.currentId = link.dataset.id;
    setNoticeMenu(link.dataset.action === "edit" ? "form" : "detail");
  });
  const back = () => setNoticeMenu("list");
  el("backNoticeListBtn")?.addEventListener("click", back);
  document.querySelectorAll(".back-notice-list").forEach((node) => node.addEventListener("click", back));
  el("saveDraftBtn")?.addEventListener("click", () => { toast("已存草稿", true); setNoticeMenu("list"); });
  el("publishNoticeBtn")?.addEventListener("click", () => { toast("发布成功", true); setNoticeMenu("list"); });
}

let noticeEventsBound = false;

window.NoticeModule = {
  open(options = {}) {
    if (!noticeEventsBound) {
      bindNoticeEvents();
      noticeEventsBound = true;
    }
    if (options.sub) setNoticeSub(options.sub);
    else setNoticeSub("normal");
    setNoticeMenu(options.menu || "list");
  }
};
})();
