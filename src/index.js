const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const { getQuiz } = require('./bot/functions');
const { TOKEN, MESSAGES } = require('./config/bot');
const { COMMANDS, REPLY_MARKUP } = require('./config/buttons');
const User = require('./model/User');

mongoose.connect('mongodb://localhost:27017/db', { useNewUrlParser: true });
const app = new TelegramBot(TOKEN, { polling: true });
let queue = [];

app.onText(new RegExp(COMMANDS.CMD_START), async (msg) => {
  const user = new User(
    {
      username: msg.chat.username,
    },
  );
  await user.save();
  app.sendMessage(msg.chat.id, MESSAGES.startMessage, { reply_markup: REPLY_MARKUP });
});

app.onText(new RegExp(COMMANDS.CMD_STATS), async (msg) => {
  const user = await User.findOne({ username: msg.chat.username });
  await app.sendMessage(msg.chat.id, MESSAGES.stats(user), { reply_markup: REPLY_MARKUP });
});

app.onText(new RegExp(COMMANDS.CMD_QUIZ), async (msg) => {
  const chatId = msg.chat.id;
  try {
    const quiz = await getQuiz();
    await app.sendPhoto(chatId, `https://shikimori.one${quiz.image}`, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: quiz.options.map((o) => ([{
          text: o,
        }])),
      },
    });
    queue = [
      ...queue,
      {
        chatId,
        correct: quiz.options[quiz.correct_option_id],
      },
    ];
  } catch (ex) {
    app.sendMessage(chatId, ex.message);
  }
});

app.onText(/.*/, (msg) => {
  const chatId = msg.chat.id;
  const element = queue.find((q) => q.chatId === chatId);

  if (element) {
    // eslint-disable-next-line max-len
    const message = element.correct === msg.text ? MESSAGES.correctAnswer : MESSAGES.incorrectAnswer;
    app.sendMessage(chatId, message, {
      reply_markup: REPLY_MARKUP,
    });

    User.findOneAndUpdate(
      { username: msg.chat.username }, {
        $inc: {
          success_attempts: element.correct === msg.text ? 1 : 0,
          total_attempts: 1,
        },
      },
    ).exec();
    queue = queue.filter((q) => q.chatId !== chatId);
  }
});

// app.setMyCommands([{
//   command: '/start',
//   description: 'Информация о боте',
// }, {
//   command: '/quiz',
//   description: 'Получить вопрос',
// }]);

// app.getMyCommands();

module.exports = app;
