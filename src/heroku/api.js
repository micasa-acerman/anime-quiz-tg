const axios = require('axios');
const { getRandomInt } = require('../utils');

const DOMAIN = 'https://shikimori.one/api/';

/**
 * Return anime list
 * @returns {Promise<[object]>}
 */
const getAnimeList = (options) => axios.get(`${DOMAIN}animes`, {
  params: {
    limit: 4,
    ranked: 'ranked',
    page: getRandomInt(0, 20),
    ...options,
  },
}).then((response) => response.data);

/**
 * Return anime
 * @param id - anime id
 * @returns {Promise<object>}
 */
const getAnime = (id) => axios.get(`${DOMAIN}animes/${id}`).then((response) => response.data);

/**
 * Return screenshots list
 * @param id - anime id
 * @returns {Promise<object>}
 */
const getAnimeAssets = (id) => axios.get(`${DOMAIN}animes/${id}/screenshots`).then((response) => response.data);

module.exports = {
  getAnime,
  getAnimeList,
  getAnimeAssets,
};
