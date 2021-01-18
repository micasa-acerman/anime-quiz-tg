const svg2img = require('svg2img');
const Image64 = require('node-base64-image');
const assert = require('assert');
const uuid = require('uuid');
const fs = require('fs');

/**
 * Возвращает случайное число в диапазоне
 * @param min - минимальное значение
 * @param max - максимальное значение
 * @returns {number}
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min);
}

/**
 * Генерирует составную картинку
 * @param imageSources - массив картинок
 * @returns {Promise<string>}
 */
const getImage = async (imageSources) => {
  assert(imageSources.length === 4, 'Image Source count must been 4');
  const imagesBase64 = (await Promise.all(imageSources.map((source) => Image64.encode(source, {}))))
    .map((source) => source.toString('base64'));

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="500" height="500" 
        viewBox="0 0 500 500">
<image width="250" height="250" href="data:image/jpeg;base64,${imagesBase64[0]}"/>
            <image width="250" height="250" x="250" y="0" href="data:image/jpeg;base64,${imagesBase64[1]}"/>
            <image width="250" height="250" y="250" href="data:image/jpeg;base64,${imagesBase64[2]}"/>
            <image width="250" height="250" x="250" y="250" href="data:image/jpeg;base64,${imagesBase64[3]}"/>
            <rect width="40" height="40" fill="#47C0B2"/>
            <rect x="250" width="40" height="40" fill="#47C0B2"/>
            <rect y="250" width="40" height="40" fill="#47C0B2"/>>
            <rect x="250" y="250" width="40" height="40" fill="#47C0B2"/>
            <path d="M21.8223 26H19V15.1211L15.6309 16.166V13.8711L21.5195 11.7617H21.8223V26Z" fill="white" fill-opacity="0.7"/>
            <path d="M271.822 26H269V15.1211L265.631 16.166V13.8711L271.52 11.7617H271.822V26Z" fill="white" fill-opacity="0.7"/>
            <path d="M21.8223 276H19V265.121L15.6309 266.166V263.871L21.5195 261.762H21.8223V276Z" fill="white" fill-opacity="0.7"/>
            <path d="M271.822 276H269V265.121L265.631 266.166V263.871L271.52 261.762H271.822V276Z" fill="white" fill-opacity="0.7"/>
        </svg>
    `;
  const fileStream = await new Promise((resolve, reject) => svg2img(svgString, (err, buffer) => {
    if (err) reject(err);
    else resolve(buffer);
  }));

  const filePath = `temp/${uuid.v4()}.png`;
  fs.writeFileSync(filePath, fileStream);
  return filePath;
};

module.exports = {
  getImage,
  getRandomInt,
};
