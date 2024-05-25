const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        console.log("Decoding and processing image");

        const tensor = tf.node
            .decodeJpeg(image._data)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        console.log("Tensor shape:", tensor.shape);

        const classes = ['Cancer', 'Non-cancer'];

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        console.log("Prediction scores:", score);

        const classResult = tf.argMax(prediction, 1).dataSync()[0];
        const label = classes[classResult];

        let suggestion;

        if(label === 'Cancer') {
            suggestion = "Segera periksa ke dokter!";
        } else {
            suggestion = "Tidak ada tanda-tanda kanker.";
        }

        console.log("Prediction result:", { confidenceScore, label, suggestion });

        return { confidenceScore, label, suggestion };
    } catch (error) {
        console.error("Error during image processing or prediction:", error);
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;
