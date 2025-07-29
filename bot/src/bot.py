from os import environ
from aiogram.client.default import DefaultBotProperties

from aiogram import (
    Bot,
    Dispatcher
)

from src.routers.start_router import start_router


bot = Bot(
    token=environ.get("BOT_TOKEN"),
    default=DefaultBotProperties(parse_mode="HTML")
)


class TelegramBot:
    _dispatcher = Dispatcher()

    @classmethod
    def _register_routers(cls):
        cls._dispatcher.include_routers(start_router)

    @classmethod
    async def run(cls):
        cls._register_routers()
        print(f"Logged in {(await bot.get_me()).full_name}")
        await cls._dispatcher.start_polling(bot)


__all__ = ["TelegramBot"]
