const ALL_USERS = window.ALL_DEMO_USERS || [];

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
  $("kvArchiveBasic").innerHTML = `
    <div class="kv"><dt>姓名</dt><dd>${u.name}</dd></div>
    <div class="kv"><dt>性别</dt><dd>${u.gender}</dd></div>
    <div class="kv"><dt>民族</dt><dd>${u.nation}</dd></div>
    <div class="kv"><dt>户籍</dt><dd>${u.household}</dd></div>
    <div class="kv"><dt>最高学历</dt><dd>${u.education}</dd></div>
    <div class="kv"><dt>所学专业</dt><dd>${u.major}</dd></div>
    <div class="kv"><dt>政治面貌</dt><dd>${u.politics}</dd></div>
    <div class="kv"><dt>持有证书情况</dt><dd>${u.cert}</dd></div>
    <div class="kv"><dt>备考次数</dt><dd>${u.times}</dd></div>
    <div class="kv"><dt>备考方向</dt><dd>${u.direction}</dd></div>
    <div class="kv"><dt>报考身份</dt><dd>${u.identity}</dd></div>
    <div class="kv"><dt>报考特殊条件</dt><dd>${u.special}</dd></div>
    <div class="kv"><dt>意向报考地1</dt><dd>${u.city}</dd></div>
    <div class="kv"><dt>意向报考地2</dt><dd>${u.city2}</dd></div>
    <div class="kv"><dt>意向报考地3</dt><dd>${u.city3}</dd></div>`;
  $("kvClassInfo").innerHTML = `
    <div class="kv"><dt>学号</dt><dd>${u.studentNo}</dd></div>
    <div class="kv"><dt>招生老师</dt><dd>${u.teacher}</dd></div>
    <div class="kv"><dt>所属班级</dt><dd>${u.classInfo}</dd></div>
    <div class="kv"><dt>联系人电话</dt><dd>${u.contactPhone}</dd></div>
    <div class="kv"><dt>紧急联系人</dt><dd>${u.emergency}</dd></div>
    <div class="kv"><dt>毕业院校</dt><dd>${u.school}</dd></div>
    <div class="kv"><dt>快递收件人</dt><dd>${u.receiver}</dd></div>
    <div class="kv"><dt>收件人电话</dt><dd>${u.receiverPhone}</dd></div>
    <div class="kv"><dt>收件地址</dt><dd>${u.address}</dd></div>`;
  $("studyInfo").innerHTML = `
    <p>对我严格管理（适合大多数学员） · 全职备考时间充足</p>
    <p>最近考试：25年四川省考和事业单位考试 · 笔试 65 分</p>
    <p>掌握较好：常识/政治/言语/判断/数量/资料</p>
    <p>掌握薄弱：小申论/大申论</p>
    <p>培训经历：行测/申论均为华图线下培训</p>`;
  $("opLogBody").innerHTML = `
    <tr><td>2027-04-05 14:25:19</td><td>账号修改</td><td>18981739366</td><td>-</td></tr>
    <tr><td>2027-04-01 09:12:00</td><td>账号禁用</td><td>18981739366</td><td>备注描述示例…</td></tr>`;
}

function goPage(name, userId) {
  $("view-users").classList.toggle("hidden", name !== "users");
  $("view-detail").classList.toggle("hidden", name !== "detail");
  if (name === "users") {
    $("crumb").innerHTML = "当前位置 / <b>用户管理</b>";
    renderUserTable();
  } else {
    $("crumb").innerHTML = "当前位置 / 用户管理 / <b>详情查看</b>";
    renderDetail(userId);
  }
}

function renderUserTable() {
  const rows = ALL_USERS.slice(0, 10);
  $("userTableBody").innerHTML = rows
    .map(
      (u) => `<tr class="clickable" data-id="${u.id}">
      <td>${u.id}</td><td>${u.nick}</td><td>${u.phone}</td><td>${u.regDisplay || u.reg}</td>
      <td>${u.last}</td><td><span class="tag">${u.archive}</span></td>
      <td><a class="link" href="#" data-id="${u.id}">详情</a></td></tr>`
    )
    .join("");
}

function bindUserDetailEvents() {
  $("backBtn").addEventListener("click", () => goPage("users"));
  $("userTableBody").addEventListener("click", (e) => {
    const link = e.target.closest("[data-id]");
    if (!link) return;
    e.preventDefault();
    goPage("detail", link.dataset.id);
  });
}

function initUserDetailModule() {
  bindUserDetailEvents();
  const params = new URLSearchParams(location.search);
  const landing = params.get("landing") || "detail";
  if (landing === "detail") goPage("detail", params.get("id"));
  else goPage("users");
}

document.addEventListener("DOMContentLoaded", () => {
  const auth = crmBindLogin({ onSuccess: initUserDetailModule });
  if (crmCurrentUser()) auth.showApp();
  else auth.showLogin();
});
