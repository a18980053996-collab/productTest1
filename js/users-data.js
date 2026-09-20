(function () {
  const NICKS = ["闪闪闪星星星星", "亮晶晶晶晶晶晶", "闲云野鹤闲云野", "塔马塔夫夫夫夫", "天外飞仙仙仙仙"];
  const PHONES = ["13681739366", "18981739366", "13481739366", "13281739366", "18681739366"];
  const ARCHIVES = ["待填写", "待填写", "已填写", "已完成", "待填写"];

  function pad(n) {
    return String(n).padStart(3, "0");
  }

  window.buildDemoUsers = function buildDemoUsers() {
    const users = [];
    for (let i = 1; i <= 35; i += 1) {
      const archive = ARCHIVES[(i - 1) % ARCHIVES.length];
      const filled = archive !== "待填写";
      const done = archive === "已完成";
      users.push({
        id: `UX202607${pad(i)}`,
        nick: NICKS[(i - 1) % NICKS.length],
        phone: PHONES[(i - 1) % PHONES.length],
        reg: "2020-08-05 14:25:19",
        regDisplay: i <= 5 ? "2026/02/23 14:00" : "2026/08/12 09:12",
        last: i <= 5 ? "2026/12/23 14:00" : "-",
        archive,
        accountStatus: i % 7 === 0 ? "已禁用" : "已启用",
        lastLoginFull: i % 3 === 0 ? "-" : "2026-08-05 14:25:19",
        ip: i % 3 === 0 ? "-" : "162.256.258.254",
        region: i % 3 === 0 ? "-" : "四川省/成都市/高新区",
        system: i % 2 ? "Android 5.0" : "iOS 18",
        name: filled ? "张三" : "-",
        gender: filled ? "男" : "-",
        nation: filled ? "汉族" : "-",
        education: filled ? "大学本科" : "-",
        major: filled ? "管理类/工商管理类/国际商务" : "-",
        cert: filled ? "大学英语六级证书" : "-",
        politics: filled ? "中共党员(含预备党员)" : "-",
        times: "首次备考",
        direction: "国考省考",
        identity: "应届生",
        special: done ? "大学生志愿服务西部计划" : "-",
        city: done ? "浙江省/金华市" : "-",
        city2: done ? "四川省/绵阳市" : "-",
        city3: done ? "四川省/德阳市" : "-",
        household: filled ? "浙江省/温州市/高新区" : "-",
        studentNo: `20261002062${i % 10}`,
        enrollYear: "2027级",
        teacher: "张老师",
        classInfo: "金华校区/泰山班/长效班",
        contactPhone: "13800000911",
        emergency: "刘德华",
        school: "四川大学",
        receiver: "李四",
        receiverPhone: "135282991222",
        address: "四川省成都市一环路12号…"
      });
    }
    return users;
  };

  window.ALL_DEMO_USERS = window.buildDemoUsers();
})();
