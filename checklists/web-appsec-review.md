# Web AppSec review checklist

Use this during a manual review or a pentest kickoff.  
Check items only when you actually tested them. Add notes in the last column.

This file should grow during the 30 days. Week 1–3 each add items you learned the hard way.

## 1. Recon and mapping

| Done | Check | Notes |
| --- | --- | --- |
| [ ] | Roles and privilege levels are listed | |
| [ ] | Core objects are listed (user, order, invoice, document, admin action) | |
| [ ] | Authn vs authz boundaries are drawn | |
| [ ] | Hidden or alternate routes exist (`/api`, `/internal`, `/v2`, `/admin`) | |
| [ ] | Verbs beyond GET/POST are in use (PUT/PATCH/DELETE) | |

## 2. Broken access control / IDOR

| Done | Check | Notes |
| --- | --- | --- |
| [ ] | Object ids in URL, body, and headers were swapped to another user | |
| [ ] | Horizontal access was tested with two normal users | |
| [ ] | Vertical access was tested from user to admin function | |
| [ ] | UI-hidden actions were still called directly | |
| [ ] | A denied GET was retried as POST/PUT/JSON | |
| [ ] | Multi-step flows were tested on the last step only | |
| [ ] | Batch or export endpoints were tested with foreign ids | |

## 3. Session and cookies

| Done | Check | Notes |
| --- | --- | --- |
| [ ] | Session cookie has `Secure` | |
| [ ] | Session cookie has `HttpOnly` | |
| [ ] | Session cookie has `SameSite` appropriate to the app | |
| [ ] | Logout invalidates the server session, not only the cookie | |
| [ ] | Session expires and is rotated after login | |
| [ ] | Cookie `Domain` / `Path` are not overly broad | |

## 4. JWT / OAuth

| Done | Check | Notes |
| --- | --- | --- |
| [ ] | JWT signature is verified on the server | |
| [ ] | `alg=none` and algorithm confusion are rejected | |
| [ ] | `exp` / `nbf` are enforced | |
| [ ] | `kid` or header values cannot select attacker-controlled keys | |
| [ ] | OAuth `redirect_uri` is exact-match allowlisted | |
| [ ] | OAuth `state` (or PKCE) is validated | |
| [ ] | Tokens are not leaked in query strings, logs, or Referer | |

## 5. XSS and client-side

| Done | Check | Notes |
| --- | --- | --- |
| [ ] | Input is encoded for the output context (HTML, attr, JS, URL) | |
| [ ] | Dangerous sinks (`innerHTML`, `document.write`, `eval`) were searched | |
| [ ] | Stored XSS paths (profile, comments, filename, admin panel) were tested | |
| [ ] | CSP is present and not `unsafe-inline` everywhere | |
| [ ] | `postMessage` origin is checked if used | |

## 6. Injection

| Done | Check | Notes |
| --- | --- | --- |
| [ ] | SQL/ORM: no string concatenation into queries | |
| [ ] | Dynamic `ORDER BY` / table names are allowlisted | |
| [ ] | OS commands do not go through a shell with user input | |
| [ ] | Template engines do not render user input as templates | |

## 7. CSRF / CORS

| Done | Check | Notes |
| --- | --- | --- |
| [ ] | State-changing requests require an anti-CSRF control | |
| [ ] | Cookie session is not enough by itself for unsafe methods | |
| [ ] | CORS does not reflect arbitrary origins with credentials | |
| [ ] | `null` origin is not trusted | |

## 8. SSRF and outbound requests

| Done | Check | Notes |
| --- | --- | --- |
| [ ] | User-supplied URLs are allowlisted by scheme and host | |
| [ ] | Redirects are not followed to internal hosts | |
| [ ] | Cloud metadata addresses are blocked in the HTTP client | |
| [ ] | Response body from the internal fetch is not returned blindly | |

## 9. API-specific

| Done | Check | Notes |
| --- | --- | --- |
| [ ] | BOLA: every object endpoint re-checks ownership | |
| [ ] | Mass assignment cannot set `role`, `isAdmin`, price, or owner | |
| [ ] | Responses do not leak extra fields the UI hides | |
| [ ] | Rate limits exist on login, reset, OTP, and expensive exports | |
| [ ] | Old API versions are not weaker than current ones | |

## 10. Files and information disclosure

| Done | Check | Notes |
| --- | --- | --- |
| [ ] | Upload checks type on content, not only extension | |
| [ ] | Uploaded files are stored outside the web root and served safely | |
| [ ] | Path traversal on download/filename is blocked | |
| [ ] | `Server` / `X-Powered-By` / stack traces are minimized | |
| [ ] | `.git`, backups, `.env`, and debug endpoints are not public | |

## How to use this in an interview

Say: "I map roles and objects first, then I test authorization on every object id, then I review auth mechanism and output encoding."  
Do not recite the whole list.
