from typing import (
    Callable,
    Dict,
    Any,
    Awaitable
)

from aiogram import BaseMiddleware
from aiogram.types import Message

from src.constants import ALLOWED_USERS


class AccessMiddleware(BaseMiddleware):
    def __init__(self):
        super().__init__()

    async def __call__(
        self,
        handler: Callable[[Message, Dict[str, Any]], Awaitable[Any]],
        event: Message,
        data: Dict[str, Any]
    ) -> Any:
        if event.from_user.id not in ALLOWED_USERS:
            return

        return await handler(event, data)
