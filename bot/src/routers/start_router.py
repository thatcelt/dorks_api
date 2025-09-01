from os import environ
from aiogram.filters.command import Command

from aiogram.types import (
    Message,
    ChatMemberUpdated
)
from aiogram import (
    Router,
    Bot
)
from aiogram.filters import (
    ChatMemberUpdatedFilter,
    JOIN_TRANSITION,
    LEAVE_TRANSITION
)

from src.constants import ALLOWED_ROLES, ALLOWED_USERS
from src.resources.keyboards import SUBSCRIBE_LINK_MARKUP

from src.utils.api import (
    get_user,
    add_user,
    set_is_active
)
from src.resources.locales import (
    SUBSCRIBE_WARNING,
    PROFILE_TEXT
)


start_router = Router()


async def is_subscribed(bot: Bot, user_id: int) -> bool:
    if (await bot.get_chat_member(
        chat_id=str(environ.get("CHANNEL_ID")),
        user_id=user_id
    )).status not in ALLOWED_ROLES:
        return False
    return True


@start_router.message(Command("start"))
async def on_start_callback(message: Message):
    if not message.from_user or not message.bot:
        return

    if not await is_subscribed(message.bot, message.from_user.id):
        await message.answer(
            text=str(SUBSCRIBE_WARNING),
            reply_markup=SUBSCRIBE_LINK_MARKUP
        )
        return

    if message.from_user.id not in ALLOWED_USERS:
        return

    user_data = get_user(message.from_user.id)
    if not user_data:
        user_data = add_user(message.from_user.id, True)

    await message.answer(text=PROFILE_TEXT.format(api_key=user_data.api_key))


@start_router.chat_member(ChatMemberUpdatedFilter(JOIN_TRANSITION))
async def on_join_callback(chat_member_updated: ChatMemberUpdated):
    if chat_member_updated.from_user.id not in ALLOWED_USERS or \
            not chat_member_updated.bot:
        return
    try:
        user_data = set_is_active(chat_member_updated.from_user.id, 'true')
    except Exception as e:
        print(e)
        return
    if not user_data:
        user_data = add_user(chat_member_updated.from_user.id, True)

    await chat_member_updated.bot.send_message(
        text=PROFILE_TEXT.format(api_key=user_data.api_key),
        chat_id=chat_member_updated.from_user.id

    )


@start_router.chat_member(ChatMemberUpdatedFilter(LEAVE_TRANSITION))
async def on_left_callback(chat_member_updated: ChatMemberUpdated):
    if chat_member_updated.from_user.id not in ALLOWED_USERS or \
            not chat_member_updated.bot:
        return
    user_data = set_is_active(chat_member_updated.from_user.id, 'false')
    if not user_data:
        user_data = add_user(chat_member_updated.from_user.id, False)

    await chat_member_updated.bot.send_message(
        text=str(SUBSCRIBE_WARNING),
        reply_markup=SUBSCRIBE_LINK_MARKUP,
        chat_id=chat_member_updated.from_user.id
    )


__all__ = ["start_router"]
