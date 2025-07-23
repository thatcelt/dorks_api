from dotenv import load_dotenv
load_dotenv()
from asyncio import get_event_loop

from src.bot import TelegramBot


async def main():
    await TelegramBot.run()

if __name__ == "__main__":
    get_event_loop().run_until_complete(main())