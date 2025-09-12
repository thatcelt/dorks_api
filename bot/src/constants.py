from os import environ

ALLOWED_ROLES = ["member", "owner", "creator", "administrator"]

REQUEST_HEADERS = {
    "Authorization": str(environ.get("BOT_API_KEY")),
    "Content-Type": "application/json"
}


__all__ = ["ALLOWED_ROLES", "REQUEST_HEADERS"]
