const { getAnimeList } = require('../heroku/api');
const { getRandomInt } = require('../utils');

const getQuiz = async () => {
  const animeModels = await getAnimeList();
  const correct = getRandomInt(0, animeModels.length);
  const names = animeModels.map((anime) => (anime.russian ? anime.russian : anime.name));
  return {
    options: names,
    correct_option_id: correct,
    image: animeModels[correct].image.preview,
  };
};

module.exports = {
  getQuiz,
};
