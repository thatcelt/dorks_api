from os import environ

from aiogram.types import (
    InlineKeyboardButton,
    InlineKeyboardMarkup
)

SUBSCRIBE_LINK_MARKUP = InlineKeyboardMarkup(
    inline_keyboard=[
        [
            InlineKeyboardButton(
                text="🔗 Ссылка/Link",
                url=environ.get("CHANNEL_URL")
            )
        ]
    ]
)


__all__ = ["SUBSCRIBE_LINK_MARKUP"]
