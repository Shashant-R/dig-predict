import { useEffect, useState } from "react";

export default function Question(){
    const [randomNumA, setRandomNumberA] = useState(0);
    const [randomNumB, setRandomNumberB] = useState(0);

    useEffect(()=>{
        setRandomNumberA(Math.floor(Math.random()*100));
        setRandomNumberB(Math.floor(Math.random()*100));
    }, []);

    let randomNumC = Math.abs(randomNumA-randomNumB);
    let expression = "";
    let answer = "";
    if(randomNumA > randomNumB)
    {
        answer = randomNumC.toString();
        expression = randomNumA.toString() + ' - ' + randomNumB.toString();
    }
    else
    {
        answer = randomNumB.toString();
        expression = randomNumC.toString() + ' + ' + randomNumA.toString();
    }
    return (<p>{expression + ' = ' + answer}</p>);
}
