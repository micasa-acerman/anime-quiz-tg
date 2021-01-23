const TOKEN = '770256364:AAEMrWtv8k4ATJLb7EJte2_USlUDBuzrH6s';
const RANGS = [
  {
    count: 0,
    label: 'Гость',
  },
  {
    count: 10,
    label: 'Анимешник',
  },
  {
    count: 20,
    label: 'Отец хентая',
  },
];

const getRang = (count) => RANGS.filter((rang) => rang.count < count).pop().label;

const MESSAGES = {
  startMessage: `Привет!
Я аниме-бот, с которым ты весело проведешь время :D
Хорошо ли ты знаешь аниме??? Давай проверим!`,
  correctAnswer: 'Правильно ✅',
  incorrectAnswer: 'Неверно ⛔',
  stats: (user) => `Процент правильных ответов: ${(user.success_attempts * 100.0) / user.total_attempts}%
Количество пройденных вопросов: ${user.total_attempts}
Твой ранг: ${getRang(user.total_attempts)}`,
};

module.exports = {
  TOKEN,
  MESSAGES,
};
