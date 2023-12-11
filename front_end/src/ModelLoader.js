import { ready, loadLayersModel } from '@tensorflow/tfjs';

const MODEL_URL = './model.json';

const loadModel = async () => {
  try {
    await ready();
    const model = await loadLayersModel(MODEL_URL);
    console.log('Model Loaded Successfully');
    return model;
  } catch (error) {
    console.error('Error loading the model:', error);
    return null;
  }
};

export default loadModel;
