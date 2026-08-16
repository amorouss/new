from __future__ import annotations

import json
from collections import Counter
from datetime import datetime, timezone

from appsec_review.models import Finding, sort_findings


def render_markdown(title: str, target: str, findings: list[Finding]) -> str:
    findings = sort_findings(findings)
    counts = Counter(item.severity for item in findings)
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    lines = [
        f"# {title}",
        "",
        f"- Target: `{target}`",
        f"- Generated: {now}",
        f"- Findings: high={counts.get('high', 0)}, medium={counts.get('medium', 0)}, "
        f"low={counts.get('low', 0)}, info={counts.get('info', 0)}",
        "",
        "This report is a configuration review, not a penetration-test exploit log.",
        "",
    ]
    if not findings:
        lines.append("No findings.")
        lines.append("")
        return "\n".join(lines)

    for item in findings:
        lines.extend(
            [
                f"## [{item.severity.upper()}] {item.title}",
                "",
                f"- Check: `{item.check_id}`",
                f"- Evidence: {item.evidence}",
                f"- Remediation: {item.remediation}",
                "",
            ]
        )
    return "\n".join(lines)


def render_json(title: str, target: str, findings: list[Finding]) -> str:
    payload = {
        "title": title,
        "target": target,
        "findings": [item.as_dict() for item in sort_findings(findings)],
    }
    return json.dumps(payload, indent=2, default=str) + "\n"


def render_text(findings: list[Finding]) -> str:
    findings = sort_findings(findings)
    if not findings:
        return "No findings.\n"
    lines = []
    for item in findings:
        lines.append(f"[{item.severity.upper():6}] {item.title} ({item.check_id})")
        lines.append(f"         {item.evidence}")
    return "\n".join(lines) + "\n"
