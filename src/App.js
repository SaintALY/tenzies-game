import './App.css';
import './style.css';
import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

function App() {
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const [startTime, setStartTime] = React.useState(null)
    const [endTime, setEndTime] = React.useState(null)
    const [time, setTime] = React.useState(0)
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    React.useEffect(() => {
        console.log("you won")
        tenzies ? end() : start()

    }, [tenzies])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setRolls(rolls + 1) // increment rolls
            
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRolls(0)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))

    function start() {
      console.log("start")
        if (rolls === 0) {
            console.log("start 2")
            setStartTime(Date.now())
        } else {
            console.log("start 3")
            return 0
        }
    }

    function end() {
      // Stops the time
        let timeDiff = Date.now() - startTime; //in ms
        const seconds = Math.floor(timeDiff / 1000)
        setTime(seconds)
    }

    const styles = {
      backgroundColor: rolls < 10 ? "#9391f1" : "#f15656"
  } 
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <div className='dashboard'>
              <div className='dashboard-text'>Count</div>
              <div className='rolls-face' style={styles}>{rolls}</div>
              <div className='time-face'>{time}</div>
              <div className='dashboard-text'>Time</div>
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}

export default App;
