from __future__ import annotations

import base64
import json
from datetime import datetime, timezone
from typing import Any

from appsec_review.models import Finding


def _b64url_decode(part: str) -> bytes:
    padding = "=" * (-len(part) % 4)
    return base64.urlsafe_b64decode(part + padding)


def _load_json_part(part: str) -> dict[str, Any]:
    data = json.loads(_b64url_decode(part).decode("utf-8"))
    if not isinstance(data, dict):
        raise ValueError("JWT part is not a JSON object")
    return data


def analyze_jwt(token: str) -> list[Finding]:
    """Decode a JWT and flag structural / configuration issues. Does not crack secrets."""
    token = token.strip()
    if token.lower().startswith("bearer "):
        token = token[7:].strip()

    findings: list[Finding] = []
    parts = token.split(".")
    if len(parts) < 2:
        return [
            Finding(
                check_id="jwt.format",
                title="Value is not a JWT",
                severity="info",
                evidence="Expected at least header.payload",
                remediation="Pass a compact JWT (header.payload.signature).",
            )
        ]

    try:
        header = _load_json_part(parts[0])
    except Exception as error:
        return [
            Finding(
                check_id="jwt.header",
                title="JWT header is not decodable JSON",
                severity="low",
                evidence=str(error),
                remediation="Inspect the token; header must be base64url JSON.",
            )
        ]

    try:
        payload = _load_json_part(parts[1])
    except Exception as error:
        return [
            Finding(
                check_id="jwt.payload",
                title="JWT payload is not decodable JSON",
                severity="low",
                evidence=str(error),
                remediation="Inspect the token; payload must be base64url JSON.",
            )
        ]

    alg = str(header.get("alg", "")).lower()
    kid = str(header.get("kid", ""))
    signature = parts[2] if len(parts) > 2 else ""

    findings.append(
        Finding(
            check_id="jwt.decoded",
            title="JWT decoded (signature not verified)",
            severity="info",
            evidence=json.dumps({"header": header, "payload": payload}, default=str),
            remediation="Verify signatures on the server with an allowlisted algorithm and key.",
            details={"header": header, "payload": payload},
        )
    )

    if alg in {"", "none"}:
        findings.append(
            Finding(
                check_id="jwt.alg-none",
                title="JWT algorithm is none or missing",
                severity="high",
                evidence=f"alg={header.get('alg')!r}",
                remediation="Reject tokens with alg=none. Allowlist HS256/RS256 (or better) and verify the signature.",
            )
        )

    if not signature and alg not in {"", "none"}:
        findings.append(
            Finding(
                check_id="jwt.empty-signature",
                title="JWT has an empty signature",
                severity="high",
                evidence="Third segment is empty.",
                remediation="Reject unsigned tokens. Verification must fail closed.",
            )
        )

    if kid and any(marker in kid for marker in ("../", "..\\", "/", "\\")):
        findings.append(
            Finding(
                check_id="jwt.kid-path",
                title="JWT kid looks like a path",
                severity="medium",
                evidence=f"kid={kid}",
                remediation="Treat kid as an opaque key id. Do not map it to filesystem paths.",
            )
        )

    if "exp" not in payload:
        findings.append(
            Finding(
                check_id="jwt.missing-exp",
                title="JWT has no exp claim",
                severity="medium",
                evidence="payload has no exp",
                remediation="Put a short exp on access tokens and reject missing/expired exp.",
            )
        )
    else:
        try:
            exp = int(payload["exp"])
            now = int(datetime.now(timezone.utc).timestamp())
            if exp < now:
                findings.append(
                    Finding(
                        check_id="jwt.expired",
                        title="JWT exp is in the past",
                        severity="low",
                        evidence=f"exp={exp}, now={now}",
                        remediation="Reject expired tokens. If this is a captured token, rotate it.",
                    )
                )
        except (TypeError, ValueError):
            findings.append(
                Finding(
                    check_id="jwt.exp-invalid",
                    title="JWT exp is not an integer timestamp",
                    severity="low",
                    evidence=repr(payload.get("exp")),
                    remediation="Use a NumericDate exp claim.",
                )
            )

    if alg == "hs256":
        findings.append(
            Finding(
                check_id="jwt.hs256-note",
                title="JWT uses HS256",
                severity="info",
                evidence="alg=HS256",
                remediation="Use a long random secret and never confuse this with an RS256 public key.",
            )
        )

    return findings
