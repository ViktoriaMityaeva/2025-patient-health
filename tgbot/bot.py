import logging
from aiogram import Bot, Dispatcher, types
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.utils import executor
from os import getenv
import aiohttp  # Import aiohttp for asynchronous HTTP requests

# Установите уровень логирования
logging.basicConfig(level=logging.INFO)
domain = getenv('TGBOT_DOMAIN')
protocol = getenv('TGBOT_PROTOCOL')
# Замените 'YOUR_BOT_TOKEN' на токен вашего бота
API_TOKEN = getenv('TGBOT_TOKEN')

# Создаем объект бота и диспетчера
bot = Bot(token=API_TOKEN)
storage = MemoryStorage()
dp = Dispatcher(bot, storage=storage)

# Обработчик команды /start
@dp.message_handler(commands=['start'])
async def send_welcome(message: types.Message):
    await message.reply(f"Для авторизации пришлите код из вашего личного кабинета:\n{protocol}://{domain}")

# Обработчик текстовых сообщений
@dp.message_handler()
async def echo(message: types.Message):
    text = message.text
    async with aiohttp.ClientSession() as session:  # Create an aiohttp session
        async with session.post(f'{protocol}://{domain}/auth-api/checkauthtg/', ssl=False, json={'tg_id': message.from_user.id}) as response:
            if response.status == 404:
                async with session.post(f'{protocol}://{domain}/auth-api/authtg/', ssl=False, json={'uid': text, 'tg_id': message.from_user.id}) as check_response:
                    if check_response.status == 200:
                        await message.reply("Вы успешно авторизовались")
                    else:
                        await message.reply(f"Для авторизации пришлите код из вашего личного кабинета:\n{protocol}://{domain}")
            elif response.status == 200:
                await message.reply("Передаю доктору.")

@dp.callback_query_handler(lambda c: c.data.startswith('medication_'))
async def process_callback_button(callback_query: types.CallbackQuery):
    # Получаем uid из callback_data
    uid = callback_query.data.split('_')[1]
    await bot.answer_callback_query(callback_query.id)  # Подтверждаем нажатие кнопки

    async with aiohttp.ClientSession() as session:  # Create an aiohttp session
        async with session.post(f'{protocol}://{domain}/auth-api/takepill/', ssl=False, json={'uid': uid}) as response:
            if response.status == 200:
                await bot.send_message(callback_query.from_user.id, "Вы приняли лекарство")
                
                # Редактируем сообщение с кнопкой
                new_keyboard = {
                    "inline_keyboard": [[
                        {"text": "Лекарство принято 👍", "callback_data": "nothing"}
                    ]]
                }
                await bot.edit_message_reply_markup(
                    chat_id=callback_query.from_user.id,
                    message_id=callback_query.message.message_id,
                    reply_markup=new_keyboard
                )
            else:
                await bot.send_message(callback_query.from_user.id, "Ошибка")
                
                # Редактируем сообщение с кнопкой
                new_keyboard = {
                    "inline_keyboard": [[
                        {"text": "Попробовать снова", "callback_data": f"medication_{uid}"}
                    ]]
                }
                await bot.edit_message_reply_markup(
                    chat_id=callback_query.from_user.id,
                    message_id=callback_query.message.message_id,
                    reply_markup=new_keyboard
                )


if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
