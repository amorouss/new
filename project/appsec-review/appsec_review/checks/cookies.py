from __future__ import annotations

from http.cookies import SimpleCookie

from appsec_review.models import Finding

SESSIONISH = ("session", "sess", "sid", "token", "auth", "jwt", "id")


def _looks_like_session(name: str) -> bool:
    lowered = name.lower()
    return any(part in lowered for part in SESSIONISH)


def review_cookies(headers: dict[str, str]) -> list[Finding]:
    findings: list[Finding] = []
    raw_values: list[str] = []
    for key, value in headers.items():
        if key.lower() == "set-cookie":
            raw_values.append(value)

    if not raw_values:
        return findings

    # urllib may join multiple Set-Cookie headers. Split on newline if present.
    chunks: list[str] = []
    for raw in raw_values:
        chunks.extend(part.strip() for part in raw.split("\n") if part.strip())

    for chunk in chunks:
        cookie = SimpleCookie()
        try:
            cookie.load(chunk)
        except Exception:
            findings.append(
                Finding(
                    check_id="cookie.parse-error",
                    title="Could not parse Set-Cookie",
                    severity="info",
                    evidence=chunk[:200],
                    remediation="Inspect the cookie manually; parser failed.",
                )
            )
            continue

        for name, morsel in cookie.items():
            flags = {key.lower() for key in morsel.keys()}
            # SimpleCookie exposes some attrs via morsel; flags in the raw string are more reliable.
            raw_lower = chunk.lower()
            has_secure = "secure" in raw_lower
            has_httponly = "httponly" in raw_lower
            has_samesite = "samesite=" in raw_lower
            sessionish = _looks_like_session(name)
            severity = "medium" if sessionish else "low"

            if not has_secure:
                findings.append(
                    Finding(
                        check_id=f"cookie.{name}.secure",
                        title=f"Cookie {name} missing Secure",
                        severity=severity,  # type: ignore[arg-type]
                        evidence=chunk,
                        remediation="Add the Secure flag so the cookie is only sent over HTTPS.",
                        details={"cookie": name},
                    )
                )
            if not has_httponly:
                findings.append(
                    Finding(
                        check_id=f"cookie.{name}.httponly",
                        title=f"Cookie {name} missing HttpOnly",
                        severity=severity,  # type: ignore[arg-type]
                        evidence=chunk,
                        remediation="Add HttpOnly so JavaScript cannot read the cookie.",
                        details={"cookie": name},
                    )
                )
            if not has_samesite:
                findings.append(
                    Finding(
                        check_id=f"cookie.{name}.samesite",
                        title=f"Cookie {name} missing SameSite",
                        severity="low",
                        evidence=chunk,
                        remediation="Set SameSite=Lax or Strict unless a documented cross-site flow needs None+Secure.",
                        details={"cookie": name},
                    )
                )
            _ = flags  # reserved for later attribute checks

    return findings
