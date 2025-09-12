from aiogram import Router
from aiogram.filters.command import Command
from aiogram.types import Message
from aiogram.fsm.context import FSMContext

from src.middlewares.admin_middleware import AdminMiddleware
from src.resources.states import BlockUserForm
from src.utils.api import block_user

from src.resources.locales import (
    ENTER_USER_ID,
    ENTER_UID,
    BLOCKED_SUCCESS,
    BLOCKED_FAILED
)


admin_router = Router()
admin_router.message.middleware(AdminMiddleware())


@admin_router.message(Command('block'))
async def on_block_user_callback(message: Message, state: FSMContext):
    await message.answer(text=ENTER_USER_ID)
    await state.set_state(BlockUserForm.user_id)


@admin_router.message(BlockUserForm.user_id)
async def on_user_id_form(message: Message, state: FSMContext):
    if message.text and message.text.isdigit():
        await state.update_data(user_id=message.text)

    await message.answer(text=ENTER_UID)
    await state.set_state(BlockUserForm.uid)


@admin_router.message(BlockUserForm.uid)
async def on_uid_form(message: Message, state: FSMContext):
    if message.text and message.text != ".":
        await state.update_data(uid=message.text)

    state_data = await state.get_data()
    await state.clear()

    is_blocked = block_user(
        user_id=state_data.get("user_id"),
        uid=state_data.get("uid")
    )

    await message.answer(
        text=BLOCKED_SUCCESS if is_blocked else BLOCKED_FAILED
    )
