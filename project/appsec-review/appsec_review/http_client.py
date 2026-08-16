from __future__ import annotations

import ssl
import urllib.error
import urllib.request
from dataclasses import dataclass
from typing import Mapping


USER_AGENT = "appsec-review/0.1 (+local authorized review)"


@dataclass
class HttpResponse:
    url: str
    status: int
    headers: dict[str, str]
    body: bytes
    final_url: str


def _normalize_headers(headers: Mapping[str, str]) -> dict[str, str]:
    return {key.lower(): value for key, value in headers.items()}


def fetch(
    url: str,
    *,
    timeout: float = 10.0,
    insecure: bool = False,
    max_body: int = 64_000,
) -> HttpResponse:
    """GET a URL. Only for targets you are allowed to test."""
    context = ssl._create_unverified_context() if insecure else ssl.create_default_context()
    request = urllib.request.Request(
        url,
        method="GET",
        headers={"User-Agent": USER_AGENT, "Accept": "*/*"},
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout, context=context) as response:
            body = response.read(max_body)
            headers = _normalize_headers(response.headers)
            return HttpResponse(
                url=url,
                status=int(response.status),
                headers=headers,
                body=body,
                final_url=response.geturl(),
            )
    except urllib.error.HTTPError as error:
        body = error.read(max_body) if error.fp else b""
        headers = _normalize_headers(error.headers or {})
        return HttpResponse(
            url=url,
            status=int(error.code),
            headers=headers,
            body=body,
            final_url=error.geturl() if hasattr(error, "geturl") else url,
        )
