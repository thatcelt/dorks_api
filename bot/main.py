from dotenv import load_dotenv
from asyncio import get_event_loop
load_dotenv()
from src.bot import TelegramBot  # noqa: E402


async def main():
    await TelegramBot.run()

if __name__ == "__main__":
    get_event_loop().run_until_complete(main())
