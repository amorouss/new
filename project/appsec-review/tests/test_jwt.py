import base64
import json

from appsec_review.checks.jwt_analyze import analyze_jwt


def _b64(data: dict) -> str:
    raw = json.dumps(data, separators=(",", ":")).encode("utf-8")
    return base64.urlsafe_b64encode(raw).decode("utf-8").rstrip("=")


def test_alg_none_is_high():
    token = f"{_b64({'alg': 'none', 'typ': 'JWT'})}.{_b64({'sub': '1'})}."
    findings = analyze_jwt(token)
    none = next(item for item in findings if item.check_id == "jwt.alg-none")
    assert none.severity == "high"


def test_missing_exp_and_path_kid():
    token = (
        f"{_b64({'alg': 'RS256', 'kid': '../../dev/null'})}."
        f"{_b64({'sub': '1'})}."
        "signature"
    )
    ids = {item.check_id for item in analyze_jwt(token)}
    assert "jwt.missing-exp" in ids
    assert "jwt.kid-path" in ids


def test_expired_exp():
    token = f"{_b64({'alg': 'HS256'})}.{_b64({'exp': 1})}." + "sig"
    ids = {item.check_id for item in analyze_jwt(token)}
    assert "jwt.expired" in ids


def test_bearer_prefix_and_not_a_jwt():
    token = f"Bearer {_b64({'alg': 'HS256'})}.{_b64({'exp': 4102444800})}.sig"
    ids = {item.check_id for item in analyze_jwt(token)}
    assert "jwt.decoded" in ids
    assert analyze_jwt("not-a-token")[0].check_id == "jwt.format"
