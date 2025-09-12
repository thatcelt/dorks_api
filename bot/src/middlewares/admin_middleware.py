from typing import (
    Callable,
    Dict,
    Any,
    Awaitable
)

from os import environ as env
from aiogram import BaseMiddleware
from aiogram.types import Message


class AdminMiddleware(BaseMiddleware):
    def __init__(self):
        super().__init__()

    async def __call__(  # type: ignore
        self,
        handler: Callable[[Message, Dict[str, Any]], Awaitable[Any]],
        event: Message,
        data: Dict[str, Any]
    ) -> Any:
        if not event.from_user \
                or str(event.from_user.id) not in str(env.get('ADMIN_IDS')):
            return

        return await handler(event, data)
