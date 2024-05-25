const { postPredictHandler, getHistoryHandler } = require('../server/handler');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 1000000, // Batas maksimal ukuran file 1MB
        output: 'stream',
        parse: true
      }
    }
  },
  {
    path: '/predict/histories',
    method: 'GET',
    handler: getHistoryHandler
  }
];

module.exports = routes;
