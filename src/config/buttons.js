const COMMANDS = {
  CMD_START: '/start',
  CMD_QUIZ: '❔',
  CMD_STATS: '⌚',
};
const REPLY_MARKUP = {
  resize_keyboard: true,
  keyboard: [
    [
      {
        text: COMMANDS.CMD_QUIZ,
      },
      {
        text: COMMANDS.CMD_STATS,
      },
    ],
  ],
};

module.exports = {
  COMMANDS,
  REPLY_MARKUP,
};
