const getHistories = require("../services/getHistories");
const predictClassification = require("../services/inferenceService");
const storeData = require("../services/storeData");
const crypto = require('crypto');

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    const { label } = await predictClassification(model, image);

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        "id": id,
        "result": label,
        "suggestion": label == 'Cancer' ? 'Segera hubungi dokter' : 'None',
        "createdAt": createdAt
    }

    await storeData(id, data);

    const response = h.response({
        status: 'success',
        message: 'Model is predicted successfully',
        data
    })
    response.code(201);
    return response;
}

async function getHistoriesHandler(_request, h) {
    histories = await getHistories()
    const response = h.response({
        status: 'success',
        data: histories
    })
    return response;
}

module.exports = {
    postPredictHandler,
    getHistoriesHandler
};