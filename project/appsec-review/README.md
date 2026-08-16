# appsec-review

A small **authorized** AppSec review CLI. It is not an exploit scanner and it does not test access control.

It automates the repeatable part of a web review:

- security headers
- cookie flags
- JWT structure / obvious misconfiguration
- `robots.txt` and `security.txt`

Manual work (IDOR, XSS, business logic) stays in [`../../checklists/web-appsec-review.md`](../../checklists/web-appsec-review.md).

## Why this exists

Built as the portfolio project for a 30-day Web AppSec sprint. The point is a tool you can explain in an interview: what it checks, what it refuses to check, and how the report is generated.

## Setup

```bash
cd project/appsec-review
python3 -m pip install -r requirements.txt
```

Runtime needs only Python 3.10+. `pytest` is for tests.

## Usage

Only scan hosts you own or have written permission to test (labs, local apps, your staging).

```bash
# Headers + cookies + well-known files
python3 -m appsec_review scan https://example.com --format md --output samples/scan-example.md

# Lab certs
python3 -m appsec_review scan https://127.0.0.1:8443 --insecure

# JWT review (decode + flags, no secret cracking)
python3 -m appsec_review jwt eyJhbGciOiJub25lIn0.eyJzdWIiOiIxIn0. --format text

python3 -m appsec_review checklist
```

## What it flags

| Area | Examples |
| --- | --- |
| Headers | Missing HSTS, CSP, nosniff, frame protection; `unsafe-inline`; `Server` / `X-Powered-By` |
| Cookies | Missing `Secure`, `HttpOnly`, `SameSite` |
| JWT | `alg=none`, empty signature, path-like `kid`, missing/expired `exp` |
| Recon | Readable `robots.txt`, presence/absence of `security.txt` |

## What it will not do

- Send payloads or exploit handlers
- Brute-force JWT secrets
- Discover IDOR / BOLA
- Replace a pentest

## Tests

```bash
cd project/appsec-review
PYTHONPATH=. python3 -m pytest -q
```

## Sample report

See [`samples/sample-jwt-report.md`](samples/sample-jwt-report.md).

## Roadmap (your week 4 work)

Pick one and implement it yourself so the repo is clearly yours:

- [ ] `Cache-Control` check on authenticated-looking responses
- [ ] HTML report
- [ ] Multiple `Set-Cookie` headers via a real HTTP library
- [ ] Severity scoring you can defend in an interview
