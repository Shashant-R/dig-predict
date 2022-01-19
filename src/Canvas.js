import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import './Canvas.css';
export default function Canvas(props)
{
    const [drawing, setDrawing] = useState(false);
    const [inputBox, setInputBox] = useState(undefined);
    const [outputBox, setOutputBox] = useState(undefined);
    const [xMin, setXMin] = useState(280);
    const [yMin, setYMin] = useState(280);
    const [xMax, setXMax] = useState(0);
    const [yMax, setYMax] = useState(0);

    const mainCanvas = useRef(null);
    const outputCanvas = useRef(null);
    const confirm = useRef(null);
    const redraw = useRef(null);

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
        if(drawing && event.type === 'touchmove')
        {
            console.log('touch moved...');
            drawStroke(event.touches[0].clientX, event.touches[0].clientY);
        }
        else if (drawing)
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

        setXMin(Math.min(xMin, Math.floor(x)));
        setXMax(Math.max(xMax, Math.floor(x)));
        setYMin(Math.min(yMin, Math.floor(y)));
        setYMax(Math.max(yMax, Math.floor(y)));

        inputBox.lineTo(x, y);
        inputBox.stroke();
        inputBox.moveTo(x, y);
    }
    function getPixelData(){
        // let sourceX = Math.max(xMin-10, 0);
        // let sourceY = Math.max(yMin-10, 0);
        // let sourceW = Math.min(xMax+10-sourceX, 280);
        // let sourceH = Math.min(yMax+10-sourceY, 280);
        outputBox.drawImage(inputBox.canvas, 0, 0, outputCanvas.current.width, outputCanvas.current.height);
        //outputBox.drawImage(inputBox.canvas, sourceX, sourceY, sourceW, sourceH, 0, 0, outputCanvas.current.width, outputCanvas.current.height);
        //console.log(xMin, yMin, xMax, yMax);
        let imgData = outputBox.getImageData(0, 0, outputCanvas.current.width, outputCanvas.current.height);
        let values = [];
        for (let i = 3; i < imgData.data.length; i +=4) {
            values.push(imgData.data[i] / 255);
        }
        values = tf.reshape(values, [1, 28, 28, 1]);
        return values;
    }
    function predictClick()
    {
        if(inputBox===undefined)return;
        let data = getPixelData();
        let predictions = props.model.predict(data).dataSync();
        let bestPred = predictions.indexOf(Math.max(...predictions));
        props.predictAnswer(bestPred*props.digit);
        console.log("Predicted: ", bestPred);
        confirm.current.disabled = true;
        redraw.current.disabled = true;
    }
    function resetStates()
    {
        if(inputBox!==undefined){
            inputBox.clearRect(0, 0, mainCanvas.current.width, mainCanvas.current.height);
            inputBox.closePath();
        }
        if(outputBox!==undefined){
            outputBox.clearRect(0, 0, outputCanvas.current.width, outputCanvas.current.height);
            outputBox.closePath();
        }
        props.predictAnswer(-1);
        setDrawing(false);
        setXMax(0);
        setXMin(280);
        setYMax(0);
        setYMin(280);
    }
    return (
        <div className="canvas-board">
            <canvas ref={mainCanvas} 
                    width={(window.innerWidth > 600) ?'280' : '140'}
                    height={(window.innerWidth > 600) ?'280' : '140'}
                    onMouseDown={mouseDownCanvas}
                    onTouchStart={mouseDownCanvas}
                    onMouseMove={mouseMoveCanvas}
                    onTouchMove={mouseMoveCanvas}
                    onMouseUp={mouseUpCanvas}
                    onTouchEnd={mouseUpCanvas}
                    onMouseLeave={mouseUpCanvas}
                    onTouchCancel={mouseUpCanvas}
                    >

            </canvas>
            <canvas className='output-canvas'
                    ref={outputCanvas}
                    width='28'
                    height='28'
                    >

            </canvas>
            <div className='button-group'>
                <button className='btn btn-outline-danger p-2 m-2'
                        ref={redraw}
                        onClick={resetStates}
                >
                    Redraw
                </button>
                <button className='btn btn-outline-success p-2 m-2'
                        ref={confirm}
                        onClick={predictClick}
                    >
                    Confirm
                </button>
            </div>
        </div>
    );
}