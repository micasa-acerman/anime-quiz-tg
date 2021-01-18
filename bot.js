const TelegramBot = require('node-telegram-bot-api');
const rest = require('./src/rest');
const { getRandomInt } = require('./src/unit');

const token = '770256364:AAHVl416qQ5VkZqLp-jhdhVj2kvR7-xQSDo';
const bot = new TelegramBot(token, { polling: true });
bot.onText(/\/start/, async (msg) => {
  bot.sendMessage(msg.chat.id, `Привет!
Я аниме-бот, с которым ты весело проведешь время :D
Хорошо ли ты знаешь аниме??? Давай проверим!
    `);
});
bot.onText(/\/quiz/, async (msg) => {
  const animeModels = await rest.getAnimeList();
  const { chat: { id } } = msg;
  const index = getRandomInt(0, animeModels.length);
  const names = animeModels.map((anime) => (anime.russian ? anime.russian : anime.name));
  const response = await bot.sendPhoto(id, `https://shikimori.one${animeModels[index].image.preview}`);
  bot.sendPoll(id, 'Какое аниме изобаржено на картинке?', names, {
    correct_option_id: index,
    type: 'quiz',
    is_anonymous: false,
    reply_to_message_id: response.message_id,
  });
});
bot.setMyCommands([{
  command: '/start',
  description: 'Информация о боте',
}, {
  command: '/quiz',
  description: 'Получить вопрос',
}]);
bot.getMyCommands();
