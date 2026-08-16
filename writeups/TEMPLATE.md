# [Severity] Short finding title

> Example: `[High] IDOR on invoice endpoint discloses other users' orders`

**Target:** PortSwigger lab / Juice Shop / local app (name it)  
**Date:** YYYY-MM-DD  
**Author:** Your name  
**Category:** Broken Access Control | XSS | SSRF | JWT | API | Other  
**CWE:** e.g. CWE-639, CWE-79, CWE-918  
**Auth required:** Yes / No  
**User role used:** e.g. regular user

## Summary

2–4 sentences. What is broken, who can abuse it, and what they get.
Write this as if a busy engineering manager will only read this section.

## Impact

- Confidentiality:
- Integrity:
- Availability:
- Business impact (fraud, account takeover, PII, admin action):

Be concrete. "This is dangerous" is not impact.

## Affected component

- URL / endpoint:
- Parameter / object id:
- Role boundary that failed:

## Root cause

Why the bug exists in design or code. Examples:

- Authorization is checked in the UI only
- Object id is trusted from the client
- JWT signature is not verified
- User input is written into HTML without context-aware encoding

Do not repeat the payload here.

## Reproduction

Numbered steps. Anyone with the same lab should be able to follow this.

1. Log in as user A
2. …
3. Send the following request:

```http
GET /path HTTP/1.1
Host: example
Cookie: session=...
```

4. Observe the response:

```http
HTTP/1.1 200 OK
...
```

Sanitize tokens. Keep only what proves the issue.

## Request / response evidence

Paste the minimum proof. Highlight the id, claim, or sink that matters.

## Prerequisites and constraints

- Needs an authenticated session?
- Needs a second account?
- Works only in a specific browser context?
- Blocked by CSP / WAF in some cases?

## Remediation

Write for a developer. Prefer:

1. The correct server-side control
2. A regression test idea
3. What not to do (security through obscurity, hiding the id, etc.)

Example for IDOR:

1. Authorize on the server: the current principal must be allowed to read this object
2. Do not trust client-supplied user ids for ownership
3. Add a test: user A cannot `GET /invoices/{id}` of user B
4. Opaque ids are optional hardening, not the fix

## References

- OWASP: …
- CWE: …
- PortSwigger topic: …

## What I learned

3 bullets, private-to-public tone. This section is for your growth and interviews.

- I used to think …
- The actual failure was …
- Next time I will test …
