from appsec_review.checks.headers import review_headers


def test_flags_missing_security_headers():
    findings = review_headers({}, final_url="https://app.example")
    ids = {item.check_id for item in findings}
    assert "header.strict-transport-security" in ids
    assert "header.content-security-policy" in ids
    assert "header.frame-protection" in ids


def test_accepts_frame_ancestors_instead_of_xfo():
    findings = review_headers(
        {"content-security-policy": "default-src 'self'; frame-ancestors 'none'"},
        final_url="https://app.example",
    )
    ids = {item.check_id for item in findings}
    assert "header.frame-protection" not in ids


def test_flags_unsafe_inline_and_server_banner():
    findings = review_headers(
        {
            "content-security-policy": "default-src 'self' 'unsafe-inline'",
            "x-frame-options": "DENY",
            "strict-transport-security": "max-age=31536000",
            "x-content-type-options": "nosniff",
            "referrer-policy": "no-referrer",
            "permissions-policy": "camera=()",
            "server": "nginx/1.25.3",
        },
        final_url="https://app.example",
    )
    ids = {item.check_id for item in findings}
    assert "header.csp-unsafe-inline" in ids
    assert "header.info.server" in ids


def test_http_final_url_is_medium():
    findings = review_headers({}, final_url="http://app.example")
    https = next(item for item in findings if item.check_id == "header.https")
    assert https.severity == "medium"
