import React, { useState, useEffect, useRef } from 'react';
import Canvas from './Canvas';
import * as tf from '@tensorflow/tfjs';
import './App.css';
import { Question } from './Question';

function App() {
  const [model, setModel] = useState(null);
  const [inputAnswer, setInputAnswer] = useState(0);
  const [actualAnswer, setActualAnswer] = useState(0);
  const [final, setFinal] = useState(false);
  const [win, setWin] = useState(false);

  const check = useRef(null);

  async function initializeModel(){
    const modelPath='./dig-predict/model/model.json';
    const loadedModel = await tf.loadLayersModel(modelPath);
    setModel(loadedModel);
  }
  const predictAnswer = (inputValue) => {
    if(inputValue<0)
      setInputAnswer(0);
    else
      setInputAnswer(inputAnswer+inputValue);
  }
  const getAnswer = (answer) => {
    setActualAnswer(answer);
  }
  function answerClick(){
    check.current.disabled = true;
    setFinal(true);
    console.log("You Entered: ", inputAnswer);
  }
  useEffect(()=>{
    initializeModel();
  }, [])
  useEffect(()=>{
    if(inputAnswer===actualAnswer)
      setWin(true);
    else
      setWin(false);
  }, [inputAnswer, actualAnswer])
  return (
    <div className='container'>
      <div className='App'>
        <Question getAnswer={getAnswer}/>
        <div className="input-region">
          <Canvas model={model} predictAnswer={predictAnswer} digit={10}/>
          <Canvas model={model} predictAnswer={predictAnswer} digit={1}/>
        </div>
        <button className='btn btn-outline-info p-2 m-2'
                ref={check}
                onClick={answerClick}
        >
          Check
        </button>
        {
          (final)? (
          <div className='verdict'>
            {(win)? (
              <p className='display-5 m-1'> You got it right!</p>
            ) : (<p className='display-5 m-1' onClick={() => window.location.reload(false)}> Try again</p>)}
            <p className='display-7 mt-4'>You Entered = {inputAnswer}</p>
            <p className='display-7 md-1'>Correct Answer = {actualAnswer}</p>
          </div>
          ) : (<p className='display-8 mt-4'>Confirm your input and then Check for your answer</p>)
        }
      </div>
    </div>
  );
  
}

export default App;
