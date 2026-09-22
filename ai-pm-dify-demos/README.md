# AI 产品经理练习：4 个 Dify Workflow Demo

对应岗位要求：

1. 把「要一个 AI 助手」拆成 Agent / Skill / Workflow / 工具 / 知识 / 评价指标
2. 自己完成 Prompt 和 Workflow 编排，并对效果负责
3. 失效时能定位到 模型 / Prompt / 知识 / 检索 / 流程

本地栈：Docker + Dify + Ollama（`qwen3.5:2b`）。2B 模型会经常答偏，这是练习「定位是哪一层」的材料，不是故障。

## 启动 Dify

```bash
# 1. 先手动打开 Docker Desktop，等鲸标稳定
cd /Users/guochengyu/Documents/dify/docker
docker compose up -d
docker compose ps
```

浏览器打开 http://localhost 并登录。Ollama 需已在跑：`ollama list` 能看到 `qwen3.5:2b`。

## 导入 4 个应用

工作室 → 创建应用 → 导入 DSL，依次选：

| 文件 | 练什么 |
|------|--------|
| `dsl/01-requirement-decomposer.yml` | 需求拆解（岗位第 1 条） |
| `dsl/02-rag-grounded-qa.yml` | Prompt + 知识约束 + 拒答（第 2、3 条） |
| `dsl/03-failure-layer-diagnosis.yml` | 失效分层（第 3 条） |
| `dsl/04-cs-intent-workflow.yml` | 分类后走不同节点（第 2 条编排） |

导入后打开任意 LLM 节点，确认模型是 **Ollama / qwen3.5:2b**。不对就手动选一下再运行。

`qwen3.5:2b` 默认会先「思考」再回答。测试运行右侧先点 **结果**，不要停在 **输入**。画布上的「输出」节点只显示变量名。若结果是英文思考过程、token 顶到 4096，到 LLM 节点里关掉思考（think），并把最大 token 调到 512。

## 建议学习顺序（一次只改一层）

### Demo 1 · 需求拆解器

输入场景「客服」，需求写：`我们要做一个客服 AI 助手`。

看输出是否 8 段齐全。然后把需求改成「什么都能干」，看它会不会写出「待澄清」而不是假装全能。

**你要改的 Prompt**：`拆解规格` 节点系统提示词。缺「评价指标」就加一条硬约束，再跑同一条输入。

### Demo 2 · RAG 拒答

把 `knowledge/crm-login-policy.md` 全文贴进「知识」。按 `eval/cases.md` 的 D2-01 ~ D2-08 跑。

关键对照：

- 知识留空再问「连续输错几次禁用」→ 必须拒答。若模型仍说 5 次，是 Prompt 没把「禁止用训练记忆」卡住，或模型太弱，**不要先怪知识库**。
- 只贴「要填验证码」再问禁用次数 → 模拟检索召回失败。

### Demo 3 · 失效分层

直接用 `eval/cases.md` 里 D3-01 ~ D3-05。先自己在纸上选一层，再跑 Workflow 对答案。

### Demo 4 · 客服分流

同一条登录问题应走「登录知识问答」；「我要退款」应走「转人工」，且不能编退款政策。

若登录问题走到了转人工：先看分类节点输出是不是「登录」这两个字（流程/模型），再看 IF/ELSE 条件（流程）。

## 和岗位要求怎么对齐

跑完后你应该能口头讲这三句：

- 「要一个客服助手」我会拆成：角色只答政策、写操作人工确认、知识用登录 FAQ、指标是拒答率和转人工率。
- 两个 Skill（分类、登录问答）加一条 Workflow（先分类再分流），比一个全能 Agent 更好验收。
- D2-04 是知识层缺口；D2-06 是检索/未注入；D3-01 是模型层；D3-02 是 Prompt 在逼编造。

评测表在 `eval/cases.md`。每条只改一层再复测，这就是「对效果负责到底」。
