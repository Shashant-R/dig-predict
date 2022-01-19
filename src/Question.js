import { useEffect, useState } from "react";
var answer = "";
export function Question(props){
    const [randomNumA, setRandomNumberA] = useState(0);
    const [randomNumB, setRandomNumberB] = useState(0);

    useEffect(()=>{
        setRandomNumberA(Math.floor(Math.random()*100));
        setRandomNumberB(Math.floor(Math.random()*100));
    }, []);

    let randomNumC = Math.abs(randomNumA-randomNumB);
    let expression = "";
    if(randomNumA > randomNumB)
    {
        answer = randomNumC;
        expression = randomNumA.toString() + ' - ' + randomNumB.toString();
    }
    else
    {
        answer = randomNumB;
        expression = randomNumC.toString() + ' + ' + randomNumA.toString();
    }
    return (
        <p className="display-4 m-3">
            {props.getAnswer(answer)}
            What is {' '+expression + ' = ?'}
        </p>
    );
}