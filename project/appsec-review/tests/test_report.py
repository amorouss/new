from appsec_review.models import Finding
from appsec_review.report import render_markdown, render_text


def test_markdown_orders_high_first():
    findings = [
        Finding("b", "Low thing", "low", "e", "r"),
        Finding("a", "High thing", "high", "e", "r"),
    ]
    text = render_markdown("T", "https://app", findings)
    assert text.index("[HIGH]") < text.index("[LOW]")
    assert "high=1" in text


def test_text_empty():
    assert render_text([]) == "No findings.\n"
