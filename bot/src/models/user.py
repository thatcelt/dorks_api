from msgspec import (
    Struct,
    field
)


class User(Struct):
    user_id: str = field(name="id")
    is_active: bool = field(name="isActive")
    is_blocked: bool = field(name="isBlocked")
    api_key: str = field(name="apiKey")


__all__ = ["User"]
