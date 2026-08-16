from __future__ import annotations

import argparse
import sys
from pathlib import Path

from appsec_review import __version__
from appsec_review.checks.cookies import review_cookies
from appsec_review.checks.headers import review_headers
from appsec_review.checks.jwt_analyze import analyze_jwt
from appsec_review.checks.well_known import review_well_known
from appsec_review.http_client import fetch
from appsec_review.models import Finding
from appsec_review.report import render_json, render_markdown, render_text

CHECKLIST_HINT = Path(__file__).resolve().parents[3] / "checklists" / "web-appsec-review.md"


def _write_output(text: str, output: str | None) -> None:
    if output:
        path = Path(output)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        print(f"Wrote {path}", file=sys.stderr)
    else:
        sys.stdout.write(text)


def cmd_scan(args: argparse.Namespace) -> int:
    response = fetch(args.url, timeout=args.timeout, insecure=args.insecure)
    findings: list[Finding] = []
    findings.extend(review_headers(response.headers, final_url=response.final_url))
    findings.extend(review_cookies(response.headers))
    if not args.skip_well_known:
        findings.extend(review_well_known(args.url, insecure=args.insecure))

    title = "AppSec review scan"
    if args.format == "json":
        text = render_json(title, args.url, findings)
    elif args.format == "md":
        text = render_markdown(title, args.url, findings)
    else:
        header = f"scan {args.url} -> HTTP {response.status} ({response.final_url})\n"
        text = header + render_text(findings)
    _write_output(text, args.output)
    return 0


def cmd_jwt(args: argparse.Namespace) -> int:
    token = args.token
    if args.file:
        token = Path(args.file).read_text(encoding="utf-8").strip()
    if not token:
        print("Provide a token or --file", file=sys.stderr)
        return 2
    findings = analyze_jwt(token)
    title = "JWT review"
    target = "jwt"
    if args.format == "json":
        text = render_json(title, target, findings)
    elif args.format == "md":
        text = render_markdown(title, target, findings)
    else:
        text = render_text(findings)
    _write_output(text, args.output)
    return 0


def cmd_checklist(_: argparse.Namespace) -> int:
    if CHECKLIST_HINT.exists():
        print(f"Manual checklist: {CHECKLIST_HINT}")
        print("This tool does not test IDOR, business logic, or XSS. Use the checklist for those.")
        return 0
    print("Open checklists/web-appsec-review.md in the repo root.")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="appsec-review",
        description="Authorized AppSec review helper for headers, cookies, and JWTs.",
    )
    parser.add_argument("--version", action="version", version=__version__)
    sub = parser.add_subparsers(dest="command", required=True)

    scan = sub.add_parser("scan", help="GET a URL and review response headers/cookies")
    scan.add_argument("url", help="Target URL you are allowed to test")
    scan.add_argument("--insecure", action="store_true", help="Skip TLS verification (labs only)")
    scan.add_argument("--timeout", type=float, default=10.0)
    scan.add_argument("--skip-well-known", action="store_true")
    scan.add_argument("--format", choices=("text", "md", "json"), default="text")
    scan.add_argument("--output", help="Write report to this file")
    scan.set_defaults(func=cmd_scan)

    jwt_cmd = sub.add_parser("jwt", help="Decode a JWT and flag configuration issues")
    jwt_cmd.add_argument("token", nargs="?", help="Compact JWT, or use --file")
    jwt_cmd.add_argument("--file", help="Read token from a file")
    jwt_cmd.add_argument("--format", choices=("text", "md", "json"), default="text")
    jwt_cmd.add_argument("--output", help="Write report to this file")
    jwt_cmd.set_defaults(func=cmd_jwt)

    checklist = sub.add_parser("checklist", help="Point to the manual review checklist")
    checklist.set_defaults(func=cmd_checklist)
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return int(args.func(args))
