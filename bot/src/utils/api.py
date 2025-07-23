from os import environ

from requests import (
    get,
    post
)

from msgspec.json import (
    decode,
    encode
)

from src.models.user import User
from src.constants import REQUEST_HEADERS

def add_user(user_id: int, is_active: bool) -> User | None:
    response = post(
        url=f"{environ.get('API_URL')}/users/add",
        data=encode({"userId": str(user_id), "isActive": is_active}),
        headers=REQUEST_HEADERS
    )
    if response.status_code != 200:
        return

    return decode(encode(response.json()["user"]), type=User)

def get_user(user_id: int) -> User | None:
    response = get(
        url=f"{environ.get('API_URL')}/users/get/{user_id}",
        headers=REQUEST_HEADERS
    )

    if response.status_code != 200:
        return

    return decode(encode(response.json()["user"]), type=User)

def set_is_active(user_id: int, is_active: bool) -> User | None:
    response = post(
        url=f"{environ.get('API_URL')}/users/setActivity/{str(is_active).lower()}",
        data=encode({"userId": str(user_id)}),
        headers=REQUEST_HEADERS
    )
    print(response.content)
    if response.status_code != 200:
        return

    return decode(encode(response.json()["user"]), type=User)


__all__ = ["add_user", "get_user", "set_is_active"]
