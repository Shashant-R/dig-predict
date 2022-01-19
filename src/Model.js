import * as tf from '@tensorflow/tfjs';

async function Model() {
    var model = await tf.loadModel('./Model.js');
    return model;
}
export default Model;