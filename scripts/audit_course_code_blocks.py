from __future__ import annotations

import json
import re
import sys
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
HIGH_CONFIDENCE_CONTINUATION_RE = re.compile(r"^\s*(return\b|raise\b|assert\b|else:|elif\b|except\b|finally:)")


def clean_text(value: str) -> str:
    return value.replace("\u00a0", " ").replace("\ufeff", "").strip()


def is_code_like_paragraph(block: dict[str, Any]) -> bool:
    if block.get("kind") != "paragraph":
        return False
    text = clean_text(block.get("text", ""))
    if not text:
        return False
    lines = [line for line in text.splitlines() if line.strip()]
    return bool(lines) and all(CODE_LINE_RE.match(line) for line in lines)


def block_label(module: dict[str, Any], section: dict[str, Any], topic: dict[str, Any], index: int) -> str:
    return (
        f"{module.get('id')}/{section.get('id')}/{topic.get('id')}#{index} "
        f"{module.get('title')} / {section.get('title')} / {topic.get('title')}"
    )


def audit(course: list[dict[str, Any]]) -> list[str]:
    issues: list[str] = []

    for module in course:
        for section in module.get("sections", []):
            for topic in section.get("topics", []):
                blocks = topic.get("contentBlocks", [])
                for index, block in enumerate(blocks):
                    prev_kind = blocks[index - 1].get("kind") if index > 0 else None
                    next_kind = blocks[index + 1].get("kind") if index + 1 < len(blocks) else None

                    if is_code_like_paragraph(block) and (prev_kind == "code" or next_kind == "code"):
                        issues.append(
                            f"code-like paragraph next to code: {block_label(module, section, topic, index)}"
                        )

                    if block.get("kind") == "code" and next_kind == "paragraph":
                        next_text = clean_text(blocks[index + 1].get("text", ""))
                        if HIGH_CONFIDENCE_CONTINUATION_RE.match(next_text):
                            issues.append(
                                f"code block followed by Python continuation: "
                                f"{block_label(module, section, topic, index + 1)}"
                            )

                    if block.get("kind") == "code" and next_kind == "code":
                        issues.append(
                            f"adjacent code blocks should be merged: {block_label(module, section, topic, index)}"
                        )

    return issues


def main() -> int:
    course = json.loads(COURSE_PATH.read_text(encoding="utf-8-sig"))
    issues = audit(course)

    if issues:
        print(f"Found {len(issues)} possible split code block issue(s):")
        for issue in issues:
            print(f"- {issue}")
        return 1

    print("No high-confidence split code block issues found.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
