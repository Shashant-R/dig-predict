import React, { useState, useEffect } from 'react';
import Canvas from './Canvas';
import * as tf from '@tensorflow/tfjs';
import './App.css';
import Question from './Question';

function App() {
  const [model, setModel] = useState(null);
  async function initializeModel(){
    const loadedModel = await tf.loadLayersModel('https://jarbun.github.io/digit-recognition/model/model.json');
    setModel(loadedModel);
  }
  
  useEffect(()=>{
    initializeModel();
  }, [])

  return (
    <div className="App">
      <Question/>
      <Canvas model={model}/>
      <Canvas model={model}/>
    </div>
  );
  
}

export default App;
