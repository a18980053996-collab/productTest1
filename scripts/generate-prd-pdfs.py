#!/usr/bin/env python3
"""Generate PRD PDFs for new requirements (requires fpdf2 in .pdf-build)."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".pdf-build"))

from fpdf import FPDF

FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    "/Library/Fonts/Arial Unicode.ttf",
    "/System/Library/Fonts/PingFang.ttc",
]

SPECS = [
    {
        "path": ROOT / "prd-user-detail" / "RP-3847-需求说明书.pdf",
        "title": "RP-3847 用户管理 · 详情查看",
        "version": "12.1",
        "sections": [
            ("背景", "在管理端用户列表基础上，提供用户详情只读页，供运营/教务查看登录与档案信息。"),
            ("功能范围", "列表进入详情；展示基本信息、登录信息、档案信息；无编辑能力。"),
            ("字段规则", "档案未填写显示「-」；登录信息取最后一次成功登录记录。"),
            ("非功能", "需登录后访问；详情接口需校验数据权限。"),
        ],
    },
    {
        "path": ROOT / "prd-class-student" / "RP-5621-需求说明书.pdf",
        "title": "RP-5621 班级管理 · 学员管理",
        "version": "12.1",
        "sections": [
            ("背景", "管理端维护线下/线上学员与班级关系，支持导入与 H5 邀请填档。"),
            ("功能范围", "学员列表查询、详情、修改、Excel 导入；校区、班级类别、班级管理；H5 邀请码。"),
            ("业务规则", "导入校验手机号唯一与班级容量；学籍状态：在读/休学/结业。"),
            ("非功能", "批量导入异步任务；操作留痕。"),
        ],
    },
    {
        "path": ROOT / "prd-notice-list" / "RP-7193-需求说明书.pdf",
        "title": "RP-7193 公告管理 · 信息列表 v1.1",
        "version": "12.1",
        "sections": [
            ("背景", "管理端维护小程序公告，v1.1 统一信息列表入口。"),
            ("功能范围", "列表、发布/修改、详情；类型含普通/职位表/职位图；草稿与上下线、置顶。"),
            ("业务规则", "已发布可下线；置顶数量上限待配置；草稿仅创建人可见。"),
            ("非功能", "富文本 XSS 过滤；发布同步 CDN 缓存刷新。"),
        ],
    },
]


def pick_font():
    for p in FONT_CANDIDATES:
        if Path(p).exists():
            return p
    return None


def build_pdf(spec):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    font_path = pick_font()
    if font_path:
        pdf.add_font("CJK", "", font_path)
        pdf.set_font("CJK", size=14)
    else:
        pdf.set_font("Helvetica", size=14)

    def w(text, size=11):
        pdf.set_font("CJK" if font_path else "Helvetica", size=size)
        pdf.multi_cell(0, 8, text)
        pdf.ln(2)

    w(spec["title"], 16)
    w(f"需求版本 {spec['version']}")
    w(f"文档路径 {spec['path'].parent.name}/")
    pdf.ln(4)
    for heading, body in spec["sections"]:
        w(heading, 13)
        w(body, 11)
        pdf.ln(2)
    spec["path"].parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(spec["path"]))
    print("Wrote", spec["path"])


def main():
    for spec in SPECS:
        build_pdf(spec)


if __name__ == "__main__":
    main()
