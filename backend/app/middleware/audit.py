import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from app.services.audit_service import AuditService

SENSITIVE_PREFIXES = [
    "/api/admin",
    "/api/ingest",
    "/api/syndicate",
    "/api/v1/graph",
    "/api/v1/path",
    "/api/path",
    "/api/investigations",
    "/api/v1/audit",
]


class AuditLoggerMiddleware(BaseHTTPMiddleware):
    """
    Automatic audit/telemetry interceptor for sensitive API calls.
    Captures: user_id, role, HTTP method, endpoint, action, timestamp, client IP, status.
    Never logs passwords, tokens, Authorization headers, or raw PII.
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        path = request.url.path

        # Check if path is in sensitive list or is a state mutation
        is_sensitive = any(
            path.startswith(prefix) for prefix in SENSITIVE_PREFIXES
        ) or request.method in ("POST", "PUT", "DELETE", "PATCH")

        start_time = time.time()
        response = await call_next(request)
        duration_ms = round((time.time() - start_time) * 1000, 2)

        if (
            is_sensitive
            and not path.startswith("/api/admin/audit-logs")
            and not path.startswith("/api/v1/audit")
        ):
            # Extract user info if resolved by auth middleware
            user = getattr(request.state, "user", None)
            user_id = user.user_id if user else "ANONYMOUS"
            role = user.role.value if user else "UNAUTHENTICATED"

            client_ip = request.client.host if request.client else "127.0.0.1"
            # Forwarded headers if present
            forwarded = request.headers.get("X-Forwarded-For")
            if forwarded:
                client_ip = forwarded.split(",")[0].strip()

            action = f"{request.method} {path}"
            severity = (
                "SENSITIVE"
                if path.startswith("/api/admin") or "ingest" in path
                else "INFO"
            )

            # Record asynchronously
            try:
                await AuditService.record_log(
                    user_id=user_id,
                    role=role,
                    action=action,
                    endpoint=path,
                    client_ip=client_ip,
                    method=request.method,
                    status_code=response.status_code,
                    severity=severity,
                    module=f"HTTP Interceptor ({request.method})",
                    details=f"Processed in {duration_ms}ms",
                )
            except Exception:
                pass

        return response
