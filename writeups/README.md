# Write-ups

Public lab reports, written like pentest findings. Use [`TEMPLATE.md`](TEMPLATE.md) for every report.

Do not publish client work, real production bugs, or out-of-scope targets.

## Planned series

| # | Folder | Topic | Write on |
| --- | --- | --- | --- |
| 1 | [`01-broken-access-control/`](01-broken-access-control/) | IDOR / privilege escalation | Day 6 |
| 2 | [`02-xss/`](02-xss/) | Reflected, stored, or DOM XSS | Day 13 |
| 3 | [`03-jwt-or-ssrf/`](03-jwt-or-ssrf/) | JWT misconfig or SSRF | Day 20 |
| 4 | [`04-api-or-logic/`](04-api-or-logic/) | BOLA or business logic | Day 25 |
| 5 | [`05-elective/`](05-elective/) | OAuth, upload, or CORS | Day 26 |

## Quality bar

A report is ready when all of these are true:

- The title names the bug and the object/endpoint
- Summary works without reading the rest
- Reproduction includes a real request
- Root cause is not "the lab is vulnerable"
- Remediation is implementable
- Secrets are redacted

## Suggested lab sources

- [PortSwigger Academy](https://portswigger.net/web-security)
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)
- [OWASP crAPI](https://github.com/OWASP/crAPI)
