import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import './Canvas.css';
export default function Canvas(props)
{
    const [drawing, setDrawing] = useState(false);
    const [inputBox, setInputBox] = useState(undefined);
    const [outputBox, setOutputBox] = useState(undefined);
    
    const mainCanvas = useRef(null);
    const outputCanvas = useRef(null);

    useEffect(()=>{
        if(inputBox!==undefined)
        {
            inputBox.lineWidth = '15';
            inputBox.lineJoin = inputBox.lineCap = 'round';
            inputBox.beginPath();
        }
    }, [inputBox, drawing]);


    function mouseDownCanvas(event){
        setDrawing(true);
        setInputBox(mainCanvas.current.getContext('2d'));
    }
    function mouseMoveCanvas(event){
        if (drawing)
            drawStroke(event.clientX, event.clientY);
    }
    function mouseUpCanvas(event){    
        setDrawing(false);
        setOutputBox(outputCanvas.current.getContext('2d'));
    }
    function drawStroke(clientX, clientY) {
        const rect = mainCanvas.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        inputBox.lineTo(x, y);
        inputBox.stroke();
        inputBox.moveTo(x, y);
    }
    function getPixelData(){
        //console.log(outputBox);
        outputBox.drawImage(inputBox.canvas, 0, 0, outputCanvas.current.width, outputCanvas.current.height);
        //console.log(outputBox);
        let imgData = outputBox.getImageData(0, 0, outputCanvas.current.width, outputCanvas.current.height);
        let values = [];
        for (let i = 0; i < imgData.data.length; i += 4) {
            values.push(imgData.data[i] / 255);
        }
        values = tf.reshape(values, [1, 28, 28, 1]);
        return values;
    }
    function predictClick()
    {
        if(inputBox!==undefined)
        {
            let data = getPixelData();
            let predictions = props.model.predict(data).dataSync();
            let bestPred = predictions.indexOf(Math.max(...predictions));
            console.log("Data: ", data);
            console.log("Prediction: ", predictions);
            console.log("Predict input: ", bestPred);
            return predictions;
        }
    }
    return (
        <div className="canvas-board">
            <canvas ref={mainCanvas} 
                    width='300px' 
                    height='300px'
                    onMouseDown={mouseDownCanvas}
                    onMouseMove={mouseMoveCanvas}
                    onMouseUp={mouseUpCanvas}
                    onMouseLeave={mouseUpCanvas}
                    >

            </canvas>
            <canvas className='output-canvas'
                    ref={outputCanvas}
                    width='28px'
                    height='28px'
                    >

            </canvas>
            <button onClick={()=>{
                        if(inputBox !== undefined)
                        {
                            inputBox.clearRect(0, 0, mainCanvas.current.width, mainCanvas.current.height);
                            inputBox.closePath();
                        }
                        if(outputBox !== undefined)
                        {
                            outputBox.clearRect(0, 0, outputCanvas.current.width, outputCanvas.current.height);
                            outputBox.closePath();
                        }
                    }}
                >
                Erase
            </button>
            <button onClick={predictClick}>
                Predict
            </button>
        </div>
    );
}