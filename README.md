# crm-login-prototype · 部署配置

> 本仓库用于打通 **Git → Gitee Pages（国内）+ Vercel（备用）** 部署链路。  
> 当前仅包含部署测试页，原型内容后续再添加。

---

## 先搞懂：我们要搭的是什么？

你可以把整个流程想象成 **「把文件放到云端，生成一个网址，发给同事就能看」**。

```
你在 Cursor 里改文件
        ↓
   Git 记录改动（像「存档」）
        ↓
   上传到云端仓库（Gitee / GitHub）
        ↓
   平台自动/手动把文件变成网页
        ↓
   同事打开链接 → 看到原型
```

### 为什么用三个东西？

| 工具 | 角色 | 类比 |
|------|------|------|
| **Git** | 版本管理，记录每次改了什么 | 游戏的「存档系统」 |
| **Gitee Pages** | 把文件变成网页，**国内访问快** | 国内 CDN 上的展示窗口 |
| **Vercel** | 把文件变成网页，**备用链接** | 海外 CDN 上的展示窗口 |

### 为什么需要 Gitee 和 GitHub 两个仓库？

- **Gitee Pages** 只认 Gitee 上的代码
- **Vercel** 目前只支持 GitHub，**不支持 Gitee**

所以：同一份代码要推到 **两个地方**，才能同时有国内链接和 Vercel 链接。  
我们用 `scripts/push-all.sh` 一条命令推两处，不用推两次。

---

## 部署后的链接（完成后填写）

| 平台 | 地址 | 给谁用 |
|------|------|--------|
| Gitee Pages | `https://<Gitee用户名>.gitee.io/crm-login-prototype/` | 国内同事（主链接） |
| Vercel | `https://crm-login-prototype.vercel.app` | 备用 / 有 VPN 时用 |

---

# 首次配置（详细步骤）

---

## 第 1 步：本地 Git 初始化

### 做什么？

把当前文件夹变成一个 **Git 仓库**，并做第一次「存档」（commit）。

### 为什么？

- Git 会记录每次改了什么，方便回溯
- 云端平台（Gitee / GitHub）需要从 Git 仓库 **拉取代码** 才能部署
- 没有 commit，就没有可推送的内容

### 怎么操作？

在终端执行（项目目录下）：

```bash
cd /Users/guochengyu/Projects/crm-login-prototype

# 1. 把所有文件加入「待存档」列表
git add .

# 2. 做第一次存档，并写一句说明
git commit -m "chore: 初始化部署配置"

# 3. 把当前分支命名为 main（业界通用主分支名）
git branch -M main

# 4. 给推送脚本加「可执行」权限（否则无法运行 ./scripts/push-all.sh）
chmod +x scripts/push-all.sh
```

### 各命令含义

| 命令 | 含义 |
|------|------|
| `git add .` | 把当前目录所有改动放进「暂存区」，准备存档 |
| `git commit -m "..."` | 正式存档，`-m` 后面是这次改动的说明 |
| `git branch -M main` | 把分支改名为 `main`（Gitee/GitHub 默认都用这个名） |
| `chmod +x` | 让脚本文件可以直接运行 |

### 成功标志

```bash
git log -1
# 应看到一条 commit，说明里有「初始化部署配置」
```

> 若提示 GPG 签名，在终端输入你的 GPG 密码即可（说明本机 Git 开启了提交签名，属正常情况）。

---

## 第 2 步：创建 Gitee 仓库并推送

### 做什么？

1. 在 Gitee 网站上建一个 **空仓库**
2. 把本地代码 **上传（push）** 到这个仓库

### 为什么？

- Gitee 是 **国内平台**，同事访问快
- 代码在 Gitee 上之后，才能开启 **Gitee Pages**，生成国内可访问的网页链接
- `origin` 是 Git 里「默认远程仓库」的惯用名字，这里指向 Gitee

### 怎么操作？

#### 2.1 在 Gitee 创建仓库（网页操作）

1. 打开 [https://gitee.com](https://gitee.com) 并登录  
   - **为什么要登录？** 仓库要挂在你账号下，你才能管理权限和 Pages  
   - **为什么要实名认证？** Gitee Pages 免费版要求账号已实名

2. 右上角 **「+」→「新建仓库」**

3. 填写：
   | 字段 | 填什么 | 为什么 |
   |------|--------|--------|
   | 仓库名称 | `crm-login-prototype` | 与本地项目一致，避免混淆 |
   | 是否开源 | **公开** | 免费版 Gitee Pages 仅支持公开仓库 |
   | 初始化 | **不要**勾选 README | 本地已有文件，避免冲突 |

4. 点 **「创建」**

#### 2.2 把本地仓库和 Gitee 关联并推送（终端）

把 `<Gitee用户名>` 换成你的 Gitee 用户名（个人主页 URL 里能看到）：

```bash
# 添加远程仓库，名字叫 origin，地址是 Gitee 上的仓库
git remote add origin https://gitee.com/<Gitee用户名>/crm-login-prototype.git

# 第一次推送：把 main 分支上传到 origin，并设为默认上游
git push -u origin main
```

| 命令 | 含义 |
|------|------|
| `git remote add origin <URL>` | 告诉 Git：「origin 这个代号 = Gitee 上那个仓库」 |
| `git push -u origin main` | 把本地 `main` 分支推送到 `origin`；`-u` 表示以后在该分支上 `git push` 默认就推这里 |

首次 push 可能要求登录 Gitee（浏览器或用户名密码）。

### 成功标志

- 打开 `https://gitee.com/<Gitee用户名>/crm-login-prototype`  
- 能看到 `index.html`、`README.md` 等文件

---

## 第 3 步：开启 Gitee Pages

### 做什么？

让 Gitee 把你仓库里的 `index.html` **发布成一个网址**，任何人打开链接就能在浏览器里看到页面。

### 为什么？

- 推代码到 Gitee **≠** 自动生成网页；还要在 Pages 里 **启动发布**
- 发布后才会得到形如 `https://xxx.gitee.io/crm-login-prototype/` 的链接
- 这是 **给国内同事的主分享链接**

### 怎么操作？

1. 打开 Gitee 上的 `crm-login-prototype` 仓库  
2. 顶部或右侧找到 **「服务」→「Gitee Pages」**  
3. 配置：
   | 选项 | 选什么 | 为什么 |
   |------|--------|--------|
   | 分支 | `main` | 代码在 main 分支上 |
   | 目录 | `/` 或「根目录」 | `index.html` 在仓库根目录 |
4. 点 **「启动」** 或 **「更新」**  
5. 等待 1～2 分钟，页面会显示访问地址

### 成功标志

浏览器打开：

```
https://<Gitee用户名>.gitee.io/crm-login-prototype/
```

应看到 **「✓ 部署成功」** 的测试页。

### 重要：免费版 Pages 的更新方式

| 情况 | 行为 |
|------|------|
| 第一次 | 点「启动」 |
| 以后每次改代码并 push | 需再到 Pages 页点 **「更新」** 才会重新发布 |

**为什么？** 免费版不会在你 push 后自动重新构建，这是 Gitee 免费版的限制。

---

## 第 4 步：创建 GitHub 仓库并推送

### 做什么？

在 GitHub 再建一个 **同名仓库**，把 **同一份代码** 再 push 上去。

### 为什么？

- **Vercel 只连接 GitHub**（以及 GitLab、Bitbucket），不能连 Gitee  
- 代码必须在 GitHub 上，Vercel 才能「监听 push → 自动部署」  
- 第二个远程用名字 `github`，和 Gitee 的 `origin` 区分

### 怎么操作？

#### 4.1 在 GitHub 创建仓库（网页）

1. 打开 [https://github.com/new](https://github.com/new) 并登录  
2. 仓库名：`crm-login-prototype`  
3. Public 或 Private 均可（**Vercel 部署出的网页链接默认仍是公开的**）  
4. **不要**勾选 「Add a README file」  
5. 点 **Create repository**

#### 4.2 添加第二个远程并推送（终端）

```bash
git remote add github https://github.com/<GitHub用户名>/crm-login-prototype.git
git push -u github main
```

| 命令 | 含义 |
|------|------|
| `git remote add github <URL>` | 第二个远程代号叫 `github`，指向 GitHub 仓库 |
| `git push -u github main` | 把同一份 main 分支也推到 GitHub |

### 成功标志

```bash
git remote -v
```

应类似：

```
origin   https://gitee.com/<用户名>/crm-login-prototype.git (fetch)
origin   https://gitee.com/<用户名>/crm-login-prototype.git (push)
github   https://github.com/<用户名>/crm-login-prototype.git (fetch)
github   https://github.com/<用户名>/crm-login-prototype.git (push)
```

在 GitHub 网页上也能看到相同文件。

---

## 第 5 步：Vercel 连接 GitHub 并部署

### 做什么？

1. 用 GitHub 账号登录 Vercel  
2. 选中 `crm-login-prototype` 仓库  
3. 让 Vercel 从 GitHub **拉代码并托管成网站**

### 为什么？

- Vercel 提供 **全球 CDN** 和 **push 后自动部署**  
- 国内访问可能不如 Gitee，适合作 **备用链接** 或给海外同事  
- 配置好后，只要 push 到 GitHub，**不用再去 Vercel 点按钮**

### 怎么操作？

1. 打开 [https://vercel.com](https://vercel.com)  
2. **Sign Up** → **Continue with GitHub**（用 GitHub 授权登录）  
   - **为什么用 GitHub 登录？** Vercel 需要读你的 GitHub 仓库列表才能导入项目  

3. 进入 Dashboard → **Add New…** → **Project**  

4. 在列表中找到 **crm-login-prototype** → **Import**  

5. 配置页（本项目是静态 HTML，无需构建）：
   | 选项 | 填什么 | 为什么 |
   |------|--------|--------|
   | Framework Preset | Other | 不是 React/Next 等框架 |
   | Root Directory | `./` | 项目在仓库根目录 |
   | Build Command | **留空** | 没有 npm build 等步骤 |
   | Output Directory | **留空** | 静态文件直接在根目录 |

6. 点 **Deploy**，等待约 30 秒～1 分钟  

7. 完成后会显示域名，例如：  
   `https://crm-login-prototype.vercel.app`

### 成功标志

- 打开 Vercel 给的链接，看到 **「✓ 部署成功」**  
- Vercel 项目页 **Deployments** 里状态为 **Ready**

### Vercel 之后怎么更新？

```bash
git push github main
# 或
./scripts/push-all.sh
```

推送到 GitHub 后，Vercel **自动**重新部署，链接不变。

---

# 日常更新流程（配置完成后）

### 做什么？

改完原型 → 存档 → 推到 Gitee + GitHub → 更新 Gitee Pages。

### 完整步骤

```bash
# 1. 在 Cursor 里修改 index.html（或其它文件）

# 2. 查看改了哪些
git status

# 3. 加入暂存区
git add .

# 4. 存档（写清楚这次改了什么）
git commit -m "更新：登录页说明文案"

# 5. 一键推到 Gitee + GitHub
./scripts/push-all.sh

# 6. Gitee Pages：到网页点「更新」（免费版必做）
#    路径：Gitee 仓库 → 服务 → Gitee Pages → 更新

# 7. Vercel：无需操作，1～2 分钟后自动生效
```

### `push-all.sh` 在做什么？

```bash
git push origin main    # 推到 Gitee → 供 Pages 使用
git push github main    # 推到 GitHub → 触发 Vercel 自动部署
```

一条命令代替两次 push，避免只推了一边而另一边没更新。

---

# 常见问题

### Q：Git / 远程 / push 分别是什么？

| 概念 | 一句话 |
|------|--------|
| **Git** | 本地版本管理，记录历史 |
| **远程仓库（remote）** | 云端代码副本（Gitee、GitHub） |
| **push** | 把本地 commit 上传到远程 |
| **Pages / Vercel** | 把仓库里的 HTML 变成可访问的网站 |

### Q：为什么 commit 和 push 是两件事？

- **commit**：在本地「存档」  
- **push**：把存档「同步到云端」  

只 commit 不 push，同事和 Gitee/Vercel 都看不到更新。

### Q：origin 和 github 两个远程会搞混吗？

不会。它们是同一套本地代码的两个 **上传目的地**：

```
本地电脑（一份代码）
    ├── push origin  → Gitee
    └── push github  → GitHub → Vercel
```

### Q：同事要看页面，要注册 Gitee/GitHub 吗？

**不用。** 公开 Pages / Vercel 链接，游客浏览器打开即可。

### Q：Gitee Pages 更新了但 Vercel 没有？

确认执行了 `./scripts/push-all.sh` 或 `git push github main`，并到 Vercel 看 Deployments 是否成功。

### Q：Vercel 更新了但 Gitee 还是旧的？

免费版 Gitee Pages 需 **手动点「更新」**；push 不会自动触发。

---

# 项目文件说明

| 文件 | 作用 |
|------|------|
| `index.html` | 网站首页（当前是部署测试页，后续换成原型） |
| `vercel.json` | 告诉 Vercel：这是公开静态项目 |
| `scripts/push-all.sh` | 一键推送到 Gitee + GitHub |
| `.gitignore` | 指定哪些文件不要纳入 Git（如 `.DS_Store`） |
| `README.md` | 本说明文档 |

---

# 快速命令备忘

```bash
# ── 首次（各做一次）──
git add .
git commit -m "chore: 初始化部署配置"
git branch -M main
git remote add origin https://gitee.com/<Gitee用户名>/crm-login-prototype.git
git remote add github https://github.com/<GitHub用户名>/crm-login-prototype.git
git push -u origin main
git push -u github main
# 然后在网页：Gitee 开 Pages + Vercel Import 项目

# ── 日常 ──
git add .
git commit -m "更新：xxx"
./scripts/push-all.sh
# Gitee Pages 网页点「更新」
```
