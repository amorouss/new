from __future__ import annotations

from urllib.parse import urljoin, urlparse

from appsec_review.http_client import fetch
from appsec_review.models import Finding


def review_well_known(base_url: str, *, insecure: bool = False) -> list[Finding]:
    findings: list[Finding] = []
    parsed = urlparse(base_url)
    origin = f"{parsed.scheme}://{parsed.netloc}"

    robots = fetch(urljoin(origin + "/", "robots.txt"), insecure=insecure)
    if robots.status == 200 and robots.body:
        body = robots.body.decode("utf-8", errors="replace")
        interesting = [
            line.strip()
            for line in body.splitlines()
            if line.strip()
            and not line.strip().startswith("#")
            and any(word in line.lower() for word in ("admin", "internal", "backup", "debug", "private"))
        ]
        findings.append(
            Finding(
                check_id="recon.robots",
                title="robots.txt is readable",
                severity="info",
                evidence=body[:500],
                remediation="Do not rely on robots.txt for secrecy. Confirm listed paths are authorized.",
                details={"interesting_lines": interesting},
            )
        )

    security = fetch(urljoin(origin + "/", ".well-known/security.txt"), insecure=insecure)
    if security.status == 200 and security.body:
        findings.append(
            Finding(
                check_id="recon.security-txt",
                title="security.txt is present",
                severity="info",
                evidence=security.body.decode("utf-8", errors="replace")[:500],
                remediation="Keep contact details current. This is a positive control.",
            )
        )
    else:
        findings.append(
            Finding(
                check_id="recon.security-txt-missing",
                title="security.txt not found",
                severity="info",
                evidence=f"HTTP {security.status} on /.well-known/security.txt",
                remediation="Consider publishing a security.txt contact for researchers.",
            )
        )

    return findings
