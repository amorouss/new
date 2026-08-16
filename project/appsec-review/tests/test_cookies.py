from appsec_review.checks.cookies import review_cookies


def test_session_cookie_missing_flags():
    findings = review_cookies({"set-cookie": "session=abc; Path=/"})
    ids = {item.check_id for item in findings}
    assert "cookie.session.secure" in ids
    assert "cookie.session.httponly" in ids
    assert "cookie.session.samesite" in ids
    secure = next(item for item in findings if item.check_id == "cookie.session.secure")
    assert secure.severity == "medium"


def test_hard_cookie_is_clean():
    findings = review_cookies(
        {"set-cookie": "session=abc; Path=/; Secure; HttpOnly; SameSite=Lax"}
    )
    assert findings == []
