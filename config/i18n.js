// i18n.js
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const path = require('path');

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'ru',
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/translation.json'),
    },
    detection: {
      order: ['header'],
      caches: false,
    }, // отключаем кэширование
    initImmediate: false, // важно для синхронной загрузки
  });

module.exports = i18next;
