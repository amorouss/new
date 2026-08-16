from __future__ import annotations

from appsec_review.models import Finding

RECOMMENDED_HEADERS = {
    "strict-transport-security": (
        "medium",
        "Missing Strict-Transport-Security",
        "Send HSTS on HTTPS responses, e.g. max-age=31536000; includeSubDomains.",
    ),
    "content-security-policy": (
        "medium",
        "Missing Content-Security-Policy",
        "Add a CSP that avoids default-src * and unnecessary unsafe-inline.",
    ),
    "x-content-type-options": (
        "low",
        "Missing X-Content-Type-Options",
        "Set X-Content-Type-Options: nosniff.",
    ),
    "referrer-policy": (
        "low",
        "Missing Referrer-Policy",
        "Set a policy such as strict-origin-when-cross-origin.",
    ),
    "permissions-policy": (
        "low",
        "Missing Permissions-Policy",
        "Restrict powerful browser features the app does not need.",
    ),
}

INFO_HEADERS = ("server", "x-powered-by", "x-aspnet-version")


def review_headers(headers: dict[str, str], *, final_url: str = "") -> list[Finding]:
    findings: list[Finding] = []
    lowered = {key.lower(): value for key, value in headers.items()}

    for name, (severity, title, remediation) in RECOMMENDED_HEADERS.items():
        if name not in lowered or not lowered[name].strip():
            findings.append(
                Finding(
                    check_id=f"header.{name}",
                    title=title,
                    severity=severity,  # type: ignore[arg-type]
                    evidence=f"Response did not include {name}.",
                    remediation=remediation,
                )
            )

    has_clickjacking_control = bool(lowered.get("x-frame-options")) or (
        "frame-ancestors" in lowered.get("content-security-policy", "").lower()
    )
    if not has_clickjacking_control:
        findings.append(
            Finding(
                check_id="header.frame-protection",
                title="No clickjacking protection header",
                severity="low",
                evidence="Neither X-Frame-Options nor CSP frame-ancestors is present.",
                remediation="Set CSP frame-ancestors 'none' or 'self', or X-Frame-Options: DENY.",
            )
        )

    csp = lowered.get("content-security-policy", "")
    if csp and "unsafe-inline" in csp.lower():
        findings.append(
            Finding(
                check_id="header.csp-unsafe-inline",
                title="CSP allows unsafe-inline",
                severity="low",
                evidence=csp,
                remediation="Prefer nonces or hashes instead of unsafe-inline for scripts.",
            )
        )

    if final_url.startswith("http://"):
        findings.append(
            Finding(
                check_id="header.https",
                title="Final URL is not HTTPS",
                severity="medium",
                evidence=final_url,
                remediation="Redirect HTTP to HTTPS and enable HSTS after HTTPS works.",
            )
        )

    for name in INFO_HEADERS:
        value = lowered.get(name)
        if value:
            findings.append(
                Finding(
                    check_id=f"header.info.{name}",
                    title=f"Information disclosure via {name}",
                    severity="info",
                    evidence=f"{name}: {value}",
                    remediation="Remove or genericize stack/version headers in production.",
                    details={"header": name, "value": value},
                )
            )

    return findings
