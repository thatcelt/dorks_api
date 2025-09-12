from aiogram.fsm.state import (
    State,
    StatesGroup
)


class BlockUserForm(StatesGroup):
    uid = State()
    user_id = State()
