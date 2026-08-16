# JWT review

- Target: `jwt`
- Generated: 2026-08-16 08:19 UTC
- Findings: high=1, medium=1, low=0, info=1

This report is a configuration review, not a penetration-test exploit log.

## [HIGH] JWT algorithm is none or missing

- Check: `jwt.alg-none`
- Evidence: alg='none'
- Remediation: Reject tokens with alg=none. Allowlist HS256/RS256 (or better) and verify the signature.

## [MEDIUM] JWT has no exp claim

- Check: `jwt.missing-exp`
- Evidence: payload has no exp
- Remediation: Put a short exp on access tokens and reject missing/expired exp.

## [INFO] JWT decoded (signature not verified)

- Check: `jwt.decoded`
- Evidence: {"header": {"alg": "none", "typ": "JWT"}, "payload": {"sub": "1", "name": "lab-user"}}
- Remediation: Verify signatures on the server with an allowlisted algorithm and key.
