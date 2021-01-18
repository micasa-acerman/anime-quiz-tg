const TelegramBot = require('node-telegram-bot-api');
const { getQuiz } = require('./bot/functions');
const { TOKEN, MESSAGES } = require('./config/bot');
const BUTTONS = require('./config/buttons');

const app = new TelegramBot(TOKEN, { polling: true });
let queue = [];

app.onText(BUTTONS.CMD_START, async (msg) => {
  app.sendMessage(msg.chat.id, MESSAGES.startMessage, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [
        [
          {
            text: '❔',
          },
        ],
      ],
    },
  });
});

app.onText(BUTTONS.CMD_QUIZ, async (msg) => {
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
    if (element.correct === msg.text) {
      app.sendMessage(chatId, MESSAGES.correctAnswer, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [
              {
                text: '❔',
              },
            ],
          ],
        },
      });
    } else {
      app.sendMessage(chatId, MESSAGES.incorrectAnswer, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [
              {
                text: '❔',
              },
            ],
          ],
        },
      });
    }
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
