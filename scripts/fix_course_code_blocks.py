from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


COURSE_PATH = Path("src/data/python-course.json")

CODE_LINE_RE = re.compile(
    r"""^\s*(
        @\w+|
        (async\s+)?def\s+\w+|
        class\s+\w+|
        if\s+.+:|elif\s+.+:|else:|
        try:|except\b.*:|finally:|
        for\s+.+:|while\s+.+:|with\s+.+:|
        match\s+.+:|case\s+.+:|
        return\b.*|raise\b.*|assert\b.*|
        break\b|continue\b|pass\b|del\s+|
        if\s+__name__\s*==\s*["']__main__["']\s*:|
        import\s+\w|from\s+\w|
        print\s*\(|input\s*\(|help\s*\(|
        [A-Za-z_]\w*\s*\(|
        [A-Za-z_]\w*\s*=|
        [A-Za-z_]\w*(\.[A-Za-z_]\w*)+\s*\(|
        self\.|super\s*\(|
        [rubfRUBF]*(""" + '"""' + r"""|''')|
        \#\s*
    )""",
    re.VERBOSE,
)

CONTINUATION_RE = re.compile(r"""^\s*([rubfRUBF]*["']|[\]\)\}],?|\.|,|\+|-|\*|/)""")
DEDENT_RE = re.compile(r"^(elif\b.*:|else:|except\b.*:|finally:|case\b.*:)")
BLOCK_START_RE = re.compile(
    r"^((async\s+)?def\b|class\b|if\b|elif\b|else:|try:|except\b|finally:|for\b|while\b|with\b|match\b|case\b)"
)
TERMINAL_RE = re.compile(r"^(return\b|raise\b|break\b|continue\b|pass\b)")


def clean_text(value: str) -> str:
    return value.replace("\u00a0", " ").replace("\ufeff", "").rstrip()


def block_text(block: dict[str, Any]) -> str:
    if block.get("kind") == "code":
        return block.get("code", "")
    return block.get("text", "")


def has_code_line(text: str) -> bool:
    lines = [clean_text(line) for line in text.splitlines() if clean_text(line).strip()]
    return bool(lines) and all(CODE_LINE_RE.match(line) or CONTINUATION_RE.match(line) for line in lines)


def toggles_triple_string(text: str) -> bool:
    return (text.count('"""') + text.count("'''")) % 2 == 1


def is_code_fragment(block: dict[str, Any]) -> bool:
    if block.get("kind") == "code":
        return True
    if block.get("kind") != "paragraph":
        return False
    return has_code_line(block.get("text", ""))


def should_merge_run(blocks: list[dict[str, Any]], index: int) -> bool:
    block = blocks[index]
    if block.get("kind") == "code":
        return True
    if not is_code_fragment(block):
        return False
    prev_kind = blocks[index - 1].get("kind") if index > 0 else None
    next_kind = blocks[index + 1].get("kind") if index + 1 < len(blocks) else None
    return prev_kind == "code" or next_kind == "code"


def normalize_code(text: str) -> str:
    raw_lines = [clean_text(line) for line in text.splitlines()]
    lines = [line.strip() for line in raw_lines if line.strip()]
    normalized: list[str] = []
    indent = 0

    for index, line in enumerate(lines):
        if re.match(r"if\s+__name__\s*==\s*['\"]__main__['\"]\s*:", line):
            indent = 0
        elif line.startswith("@"):
            indent = 1 if any(prev.startswith("class ") for prev in lines[:index]) else 0
        elif line.startswith("def ") and index > 0:
            if normalized and normalized[-1].lstrip().startswith("@"):
                line_indent = len(normalized[-1]) - len(normalized[-1].lstrip())
                indent = line_indent // 4
            elif any(prev.startswith("class ") for prev in lines[:index]):
                indent = 1

        if DEDENT_RE.match(line):
            indent = max(indent - 1, 0)

        if line.startswith(("print(", "help(", "input(")) and index > 0:
            prev = lines[index - 1]
            if TERMINAL_RE.match(prev) or re.match(r"if\s+__name__\s*==\s*['\"]__main__['\"]\s*:", line):
                indent = 0

        normalized.append(f"{'    ' * indent}{line}")

        if line.endswith(":") and BLOCK_START_RE.match(line):
            indent += 1
        elif TERMINAL_RE.match(line):
            next_line = lines[index + 1] if index + 1 < len(lines) else ""
            if next_line and DEDENT_RE.match(next_line):
                continue
            if next_line.startswith(("print(", "help(", "input(")):
                indent = 0
            elif next_line.startswith(("@", "def ")) and any(prev.startswith("class ") for prev in lines[:index]):
                indent = 1

    return "\n".join(normalized)


def merge_code_fragments(blocks: list[dict[str, Any]]) -> list[dict[str, Any]]:
    merged: list[dict[str, Any]] = []
    index = 0

    while index < len(blocks):
        if not should_merge_run(blocks, index):
            block = blocks[index].copy()
            if block.get("kind") == "paragraph":
                block["text"] = clean_text(block.get("text", ""))
            merged.append(block)
            index += 1
            continue

        parts: list[str] = []
        in_triple_string = False
        while index < len(blocks):
            block = blocks[index]
            if block.get("kind") not in {"code", "paragraph"}:
                break
            text = block_text(block)
            if not is_code_fragment(block) and not in_triple_string:
                break
            parts.append(text)
            if toggles_triple_string(text):
                in_triple_string = not in_triple_string
            index += 1

        merged.append({"kind": "code", "code": normalize_code("\n".join(parts))})

    return merged


def merge_until_stable(blocks: list[dict[str, Any]]) -> list[dict[str, Any]]:
    current = blocks
    while True:
        merged = merge_code_fragments(current)
        if merged == current:
            return merged
        current = merged


def apply_overrides(course: list[dict[str, Any]]) -> None:
    overrides = {
        ("m11", "s03", "t01"): [
            {
                "kind": "paragraph",
                "text": "当你想要在代码中明确表示发生了错误或异常情况时，可以使用 raise 来抛出异常。这可以帮助你在满足某些条件时停止程序的正常执行，并将控制权转移到异常处理部分。",
            },
            {"kind": "heading", "level": 4, "text": "语法"},
            {"kind": "paragraph", "text": 'raise 异常类型("异常描述")'},
            {"kind": "heading", "level": 4, "text": "案例"},
            {
                "kind": "code",
                "code": 'def int_add(x, y):\n    if isinstance(x, int) and isinstance(y, int):\n        return x + y\n    else:\n        raise TypeError("参数类型错误")\n\nprint(int_add(1, 2))  # 3\nprint(int_add("1", "2"))  # TypeError: 参数类型错误',
            },
        ],
        ("m11", "s03", "t02"): [
            {"kind": "paragraph", "text": "assert用于判断一个表达式，在表达式条件为False的时候触发异常，常用于调试程序。"},
            {"kind": "heading", "level": 4, "text": "语法"},
            {"kind": "paragraph", "text": "assert 表达式 [,异常描述]"},
            {"kind": "paragraph", "text": "等价于："},
            {"kind": "code", "code": "if not 表达式:\n    raise AssertionError([异常描述])"},
            {"kind": "heading", "level": 4, "text": "案例"},
            {
                "kind": "code",
                "code": 'def int_add(x, y):\n    assert isinstance(x, int) and isinstance(y, int), "参数类型错误"\n    return x + y\n\nprint(int_add(1, 2))  # 3\nprint(int_add("1", "2"))  # AssertionError: 参数类型错误',
            },
        ],
    }

    for module in course:
        for section in module.get("sections", []):
            for topic in section.get("topics", []):
                key = (module.get("id"), section.get("id"), topic.get("id"))
                if key in overrides:
                    topic["contentBlocks"] = overrides[key]


def main() -> None:
    course = json.loads(COURSE_PATH.read_text(encoding="utf-8-sig"))

    for module in course:
        for section in module.get("sections", []):
            for topic in section.get("topics", []):
                topic["contentBlocks"] = merge_until_stable(topic.get("contentBlocks", []))

    apply_overrides(course)
    COURSE_PATH.write_text(json.dumps(course, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
