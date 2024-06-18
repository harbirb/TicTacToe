"use client";

import { useState } from "react";

function Square({value, onSquareClick, highlight}) {
  let style = highlight ? {backgroundColor: 'greenyellow'} : {backgroundColor: 'gainsboro'}
  return <button className=" square" onClick={onSquareClick} style={style}>{value}</button>
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove]
  const xIsNext = currentMove % 2 ===0
  const [ascendingMoves, setAscendingMoves] = useState(true); 


  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove+1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(currentMove+1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  let moves = history.map((squares, move) => {
    let description;
    if (move > 0 && move !== currentMove) {
      description = 'Go to move #' + move;
    } else if (move === currentMove) {
      return (
        <li key={move}>
          <div>You are at move #{move}</div>
        </li>
      )
    } 
    else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  function toggleMovesOrder() {
    setAscendingMoves(!ascendingMoves);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <button onClick={toggleMovesOrder}>Toggle Order of Moves</button>
        <ol>{ascendingMoves ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function Board({xIsNext, squares, onPlay}) {

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X'
    } else {
      nextSquares[i] = 'O'
    }
    onPlay(nextSquares)
  }

  const winLocations = calculateWinner(squares)
  let status;
  if (winLocations) {
    status = "Winner: " + squares[winLocations[0]];
  } else {
    status = "Next player: " + (xIsNext ? 'X' : 'O')
  }

  if (!squares.includes(null) && !winLocations) {
    status = "TIE"
  }


  function makeBoard() {
    let board = []
    for (let j = 0; j < 3; j++) {
      let row=[]
      for (let i = 0; i < 3; i++) {
        const index = j*3 +i;
        let highlighted = false;      
        if (winLocations && winLocations.includes(index)) {
          highlighted = true;
        } 
        row.push(<Square value={squares[index]} highlight={highlighted} onSquareClick={() => handleClick(index)}/>)
      }
      board.push(<div className="board-row">
        {row}
        </div>)
    }
    return board;
  }
   
  return  (
    <>
    <div className="status">{status}</div>
      {makeBoard()}
    </>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}
  
