const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const { storeData, getAllData } = require('../services/storeData');
const InputError = require('../exceptions/InputError');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  try {
    const { label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      createdAt: createdAt
    };

    console.log("Prediction successful, data:", data);

    // Menyimpan data prediksi ke Firestore
    await storeData(id, data);

    const response = h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error("Error during prediction:", error);

    if (error.isBoom && error.output.statusCode === 413) {
      return h.response({
        status: 'fail',
        message: 'Payload content length greater than maximum allowed: 1000000'
      }).code(413);
    }

    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi'
    }).code(400);
  }
}

async function getHistoryHandler(request, h) {
  try {
    const data = await getAllData();
    const response = h.response({
      status: 'success',
      data: data
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error("Error fetching history:", error);
    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam mengambil data'
    }).code(500);
  }
}

module.exports = { postPredictHandler, getHistoryHandler };
