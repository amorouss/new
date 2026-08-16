from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Literal

Severity = Literal["high", "medium", "low", "info"]

SEVERITY_ORDER = {"high": 0, "medium": 1, "low": 2, "info": 3}


@dataclass
class Finding:
    check_id: str
    title: str
    severity: Severity
    evidence: str
    remediation: str
    details: dict[str, Any] = field(default_factory=dict)

    def as_dict(self) -> dict[str, Any]:
        return {
            "check_id": self.check_id,
            "title": self.title,
            "severity": self.severity,
            "evidence": self.evidence,
            "remediation": self.remediation,
            "details": self.details,
        }


def sort_findings(findings: list[Finding]) -> list[Finding]:
    return sorted(findings, key=lambda item: (SEVERITY_ORDER[item.severity], item.check_id))
