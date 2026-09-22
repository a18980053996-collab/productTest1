#!/usr/bin/env python3
"""Generate Dify 1.x importable workflow DSL files for AI PM practice."""

from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
DSL_DIR = ROOT / "dsl"

PROVIDER = "langgenius/ollama/ollama"
MODEL = "qwen3.5:2b"
PLUGIN = (
    "langgenius/ollama:1.0.2@"
    "ef203a332d1b2b8952dbaa012be70be3e0a2d576b001489fb3b070efc970ffbe"
)


def features():
    return {
        "file_upload": {"enabled": False},
        "opening_statement": "",
        "retriever_resource": {"enabled": True},
        "sensitive_word_avoidance": {"enabled": False},
        "speech_to_text": {"enabled": False},
        "suggested_questions": [],
        "suggested_questions_after_answer": {"enabled": False},
        "text_to_speech": {"enabled": False},
    }


def start_node(node_id, title, variables, x=30, y=240):
    return {
        "data": {
            "desc": "",
            "selected": False,
            "title": title,
            "type": "start",
            "variables": variables,
        },
        "height": 90,
        "id": node_id,
        "position": {"x": x, "y": y},
        "positionAbsolute": {"x": x, "y": y},
        "selected": False,
        "sourcePosition": "right",
        "targetPosition": "left",
        "type": "custom",
        "width": 244,
    }


def llm_node(node_id, title, system, user, x, y, desc=""):
    return {
        "data": {
            "context": {"enabled": False, "variable_selector": []},
            "desc": desc,
            "model": {
                "completion_params": {
                    "temperature": 0.2,
                    "num_predict": 512,
                    "think": False,
                },
                "mode": "chat",
                "name": MODEL,
                "provider": PROVIDER,
            },
            "prompt_template": [
                {"role": "system", "text": system},
                {"role": "user", "text": user},
            ],
            "selected": False,
            "title": title,
            "type": "llm",
            "variables": [],
            "vision": {"enabled": False},
        },
        "height": 90,
        "id": node_id,
        "position": {"x": x, "y": y},
        "positionAbsolute": {"x": x, "y": y},
        "selected": False,
        "sourcePosition": "right",
        "targetPosition": "left",
        "type": "custom",
        "width": 244,
    }


def end_node(node_id, title, outputs, x, y):
    return {
        "data": {
            "desc": "",
            "outputs": outputs,
            "selected": False,
            "title": title,
            "type": "end",
        },
        "height": 90,
        "id": node_id,
        "position": {"x": x, "y": y},
        "positionAbsolute": {"x": x, "y": y},
        "selected": False,
        "sourcePosition": "right",
        "targetPosition": "left",
        "type": "custom",
        "width": 244,
    }


def if_else_node(node_id, title, variable_selector, contains_value, x, y):
    return {
        "data": {
            "cases": [
                {
                    "case_id": "true",
                    "conditions": [
                        {
                            "comparison_operator": "contains",
                            "id": f"{node_id}-cond",
                            "value": contains_value,
                            "varType": "string",
                            "variable_selector": variable_selector,
                        }
                    ],
                    "id": "true",
                    "logical_operator": "and",
                }
            ],
            "desc": "",
            "selected": False,
            "title": title,
            "type": "if-else",
        },
        "height": 126,
        "id": node_id,
        "position": {"x": x, "y": y},
        "positionAbsolute": {"x": x, "y": y},
        "selected": False,
        "sourcePosition": "right",
        "targetPosition": "left",
        "type": "custom",
        "width": 244,
    }


def edge(source, target, source_type, target_type, source_handle="source"):
    return {
        "data": {
            "isInIteration": False,
            "isInLoop": False,
            "sourceType": source_type,
            "targetType": target_type,
        },
        "id": f"{source}-{source_handle}-{target}",
        "source": source,
        "sourceHandle": source_handle,
        "target": target,
        "targetHandle": "target",
        "type": "custom",
        "zIndex": 0,
    }


def text_var(label, variable, required=True, max_length=8000):
    return {
        "label": label,
        "max_length": max_length,
        "options": [],
        "required": required,
        "type": "paragraph",
        "variable": variable,
    }


def app_dsl(name, description, icon, nodes, edges):
    return {
        "app": {
            "description": description,
            "icon": icon,
            "icon_background": "#FFEAD5",
            "mode": "workflow",
            "name": name,
            "use_icon_as_answer_icon": False,
        },
        "dependencies": [
            {
                "current_identifier": None,
                "type": "marketplace",
                "value": {"marketplace_plugin_unique_identifier": PLUGIN},
            }
        ],
        "kind": "app",
        "version": "0.4.0",
        "workflow": {
            "conversation_variables": [],
            "environment_variables": [],
            "features": features(),
            "graph": {
                "edges": edges,
                "nodes": nodes,
                "viewport": {"x": 0, "y": 0, "zoom": 0.7},
            },
        },
    }


def dump(name, data):
    DSL_DIR.mkdir(parents=True, exist_ok=True)
    path = DSL_DIR / name
    path.write_text(
        yaml.dump(data, allow_unicode=True, sort_keys=False, width=120),
        encoding="utf-8",
    )
    print(f"wrote {path}")


def demo1():
    system = """你是一名 AI 产品经理。用户会丢来一句很模糊的「我们要做一个 AI 助手」。
你的任务不是写代码，而是把这句话拆成可以立项、可以编排、可以验收的规格。

硬性要求：
1. 只根据用户描述拆解，缺信息就写「待澄清：……」，禁止编造客户没有说的系统。
2. 必须区分：Agent（谁来决策）/ Skill（可复用能力）/ Workflow（固定步骤）/ 工具 / 知识依赖 / 评价指标。
3. 写操作（改数据、发消息、退款）默认要人工确认。
4. 直接输出，不要分析过程，不要 markdown 代码块。

按下面 8 段原样输出，每段一行标题：
【场景】一句话
【Agent角色】职责 + 不能做的事
【Skill】2-5 个可复用能力
【Workflow】3-6 个固定步骤，用 1. 2. 3.
【工具】每个工具写：读/写 + 要不要人工确认
【知识依赖】文档从哪来，没有就不能上线
【评价指标】至少 4 个，能量化
【待澄清】至少 2 个问题"""
    user = """业务场景：{{#start.scene#}}
模糊需求：{{#start.request#}}

请按系统要求拆解。"""
    dump(
        "01-requirement-decomposer.yml",
        app_dsl(
            name="Demo1-需求拆解器",
            description="把模糊的「要一个AI助手」拆成 Agent / Skill / Workflow / 工具 / 知识 / 评价指标。对应岗位要求第 1 条。",
            icon="🧭",
            nodes=[
                start_node(
                    "start",
                    "用户输入",
                    [
                        {
                            "label": "业务场景",
                            "options": ["客服", "销售", "研发", "运营", "风控", "知识管理"],
                            "required": True,
                            "type": "select",
                            "variable": "scene",
                        },
                        text_var("模糊需求", "request", max_length=2000),
                    ],
                ),
                llm_node(
                    "llm",
                    "拆解规格",
                    system,
                    user,
                    334,
                    240,
                    desc="Prompt 设计练习：结构化输出 + 禁止编造",
                ),
                end_node(
                    "end",
                    "输出",
                    [
                        {
                            "value_selector": ["llm", "text"],
                            "value_type": "string",
                            "variable": "spec",
                        }
                    ],
                    638,
                    240,
                ),
            ],
            edges=[
                edge("start", "llm", "start", "llm"),
                edge("llm", "end", "llm", "end"),
            ],
        ),
    )


def demo2():
    system = """你是 CRM 登录政策客服。你只能根据【知识】回答，不能使用训练记忆。

判断顺序：
1. 知识能直接支持结论 → 用知识原话回答，并写「依据：……」
2. 知识没写、或只写了相关但不够下结论 → 只输出「知识不足，不能确定。」不要猜
3. 用户要演示账号/密码、或要你改密码 → 拒绝，引导联系管理员

禁止：
- 把 5 改成 3，或把「不做找回密码」改成「可以找回」
- 补充文档没写的解禁时长、验证码是否计入错误次数

直接输出下面 3 行，不要分析过程：
结论：
依据：
不确定点："""
    user = """【知识】
{{#start.knowledge#}}

【用户问题】
{{#start.question#}}"""
    dump(
        "02-rag-grounded-qa.yml",
        app_dsl(
            name="Demo2-RAG拒答练习",
            description="只根据贴入的知识回答；知识没有就拒答。用来体会知识层 / 检索层 / Prompt 层的差别。对应岗位要求第 2、3 条。",
            icon="📚",
            nodes=[
                start_node(
                    "start",
                    "用户输入",
                    [
                        text_var("用户问题", "question", max_length=1000),
                        text_var("知识（先贴 crm-login-policy.md）", "knowledge", max_length=8000),
                    ],
                ),
                llm_node(
                    "llm",
                    "基于知识作答",
                    system,
                    user,
                    334,
                    240,
                    desc="把知识当检索结果。留空或删段落 = 模拟检索失败",
                ),
                end_node(
                    "end",
                    "输出",
                    [
                        {
                            "value_selector": ["llm", "text"],
                            "value_type": "string",
                            "variable": "answer",
                        }
                    ],
                    638,
                    240,
                ),
            ],
            edges=[
                edge("start", "llm", "start", "llm"),
                edge("llm", "end", "llm", "end"),
            ],
        ),
    )


def demo3():
    system = """你是 AI 应用值班产品经理。根据一次失败样本，判断问题出在哪一层。只能选一层作为主因。

五层定义（必须按这个标准，不要发明新层）：
1. 模型：知识正确、Prompt 也约束了，但模型把事实说错或格式崩了
2. Prompt：指令在逼模型编造、没要求引用、或角色冲突
3. 知识：该写进知识库的事实根本没有，或写错了
4. 检索：完整知识库里有答案，但这次召回的片段没有
5. 流程：不该进这个节点（该分流、该拒答、该人工确认）却走了

直接输出下面 5 行，不要分析过程：
主因层：模型 / Prompt / 知识 / 检索 / 流程  （只写一个）
证据：
为什么不是相邻层：
改哪一处：
复测题："""
    user = """用户问题：
{{#start.question#}}

模型实际回答：
{{#start.answer#}}

这次检索到的知识：
{{#start.retrieved#}}

当时的 Prompt 要点：
{{#start.prompt_notes#}}

流程备注（可空）：
{{#start.process_notes#}}"""
    dump(
        "03-failure-layer-diagnosis.yml",
        app_dsl(
            name="Demo3-失效分层诊断",
            description="把一次坏答案定位到 模型 / Prompt / 知识 / 检索 / 流程。对应岗位要求第 3 条。",
            icon="🩺",
            nodes=[
                start_node(
                    "start",
                    "失败样本",
                    [
                        text_var("用户问题", "question", max_length=1000),
                        text_var("模型实际回答", "answer", max_length=2000),
                        text_var("这次检索到的知识", "retrieved", max_length=4000),
                        text_var("当时的 Prompt 要点", "prompt_notes", max_length=2000),
                        text_var("流程备注", "process_notes", required=False, max_length=1000),
                    ],
                    y=180,
                ),
                llm_node(
                    "llm",
                    "定位失效层",
                    system,
                    user,
                    334,
                    180,
                    desc="练习：先给定义再判断，避免空泛说「模型不好」",
                ),
                end_node(
                    "end",
                    "输出",
                    [
                        {
                            "value_selector": ["llm", "text"],
                            "value_type": "string",
                            "variable": "diagnosis",
                        }
                    ],
                    638,
                    180,
                ),
            ],
            edges=[
                edge("start", "llm", "start", "llm"),
                edge("llm", "end", "llm", "end"),
            ],
        ),
    )


def demo4():
    classify_system = """你是客服分流器。根据用户问题只输出一个词。
规则：
- 登录、验证码、账号禁用、密码错误、找回密码 → 登录
- 退款、退货、发票、支付 → 退款
- 其他 → 其他
只输出：登录 或 退款 或 其他
不要标点，不要解释。"""
    classify_user = "{{#start.question#}}"
    login_system = """你是登录专项客服。只根据【知识】回答登录/验证码/禁用/找回密码。
知识没有就说「知识不足，不能确定。」
用户要演示密码时拒绝。
直接输出：
结论：
依据：
下一步："""
    login_user = """【知识】
{{#start.knowledge#}}

【用户问题】
{{#start.question#}}"""
    other_system = """你是客服。当前问题不是登录专项。
如果是退款/发票：说明本 Demo 没有退款知识库，需要转人工，不要编政策。
如果是其他：一句话说明超出范围，给出该转的角色（财务/销售/研发）。
直接输出：
分流结果：
回复用户：
该转给："""
    other_user = "{{#start.question#}}"
    dump(
        "04-cs-intent-workflow.yml",
        app_dsl(
            name="Demo4-客服分流Workflow",
            description="先分类再走不同节点：登录走知识问答，其他走转人工。练习 Workflow 编排，而不是一个 Prompt 包打天下。对应岗位要求第 2 条。",
            icon="🔀",
            nodes=[
                start_node(
                    "start",
                    "用户输入",
                    [
                        text_var("用户问题", "question", max_length=1000),
                        text_var("登录知识（可贴 crm-login-policy.md）", "knowledge", required=False, max_length=8000),
                    ],
                    y=220,
                ),
                llm_node("classify", "意图分类", classify_system, classify_user, 300, 220, desc="Skill：只做分类"),
                if_else_node("branch", "是否登录类", ["classify", "text"], "登录", 570, 220),
                llm_node("login_llm", "登录知识问答", login_system, login_user, 860, 120, desc="登录 Skill"),
                llm_node("other_llm", "转人工话术", other_system, other_user, 860, 340, desc="非登录走流程降级"),
                end_node(
                    "end_login",
                    "登录结果",
                    [
                        {
                            "value_selector": ["classify", "text"],
                            "value_type": "string",
                            "variable": "intent",
                        },
                        {
                            "value_selector": ["login_llm", "text"],
                            "value_type": "string",
                            "variable": "answer",
                        },
                    ],
                    1160,
                    120,
                ),
                end_node(
                    "end_other",
                    "其他结果",
                    [
                        {
                            "value_selector": ["classify", "text"],
                            "value_type": "string",
                            "variable": "intent",
                        },
                        {
                            "value_selector": ["other_llm", "text"],
                            "value_type": "string",
                            "variable": "answer",
                        },
                    ],
                    1160,
                    340,
                ),
            ],
            edges=[
                edge("start", "classify", "start", "llm"),
                edge("classify", "branch", "llm", "if-else"),
                edge("branch", "login_llm", "if-else", "llm", "true"),
                edge("branch", "other_llm", "if-else", "llm", "false"),
                edge("login_llm", "end_login", "llm", "end"),
                edge("other_llm", "end_other", "llm", "end"),
            ],
        ),
    )


if __name__ == "__main__":
    demo1()
    demo2()
    demo3()
    demo4()
