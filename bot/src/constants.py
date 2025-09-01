from os import environ

ALLOWED_ROLES = ["member", "owner", "creator", "administrator"]
ALLOWED_USERS = [
    5821237737,
    6994051547,
    8221056904,
    6604209847,
    6215951305,
    1219620830,
    7780755475,
    1105720238,
    7142528660,
    1954216104,
    8246723743,
    1216692526,
    7640268551,
    8174114766,
    7010869693
]

REQUEST_HEADERS = {
    "Authorization": str(environ.get("BOT_API_KEY")),
    "Content-Type": "application/json"
}


__all__ = ["ALLOWED_ROLES", "REQUEST_HEADERS"]
