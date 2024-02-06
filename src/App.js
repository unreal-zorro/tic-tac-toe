import { useState } from "react";

function Square({ value, onSquareClick, isWinner }) {
  return (
    <button className={`square ${ isWinner ? 'winner': '' }`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i, [row, col]) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares, [row, col]);
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = 'Winner: ' + squares[winner[0]];
  } else {
    status = 'Next player: ' + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {new Array(3).fill(null).map((_, i) => {
        return (
          <div
            key={i}
            className="board-row"
          >
            {new Array(3).fill(null).map((_, j) => {
              return (
                <Square
                  key={i * 3 + j}
                  value={squares[i * 3 + j]} onSquareClick={() => handleClick(i * 3 + j, [i, j])}
                  isWinner={winner && winner.includes(i * 3 + j)}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
      row: null,
      col: null
    }
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isMovesReverse, setIsMovesReverse] = useState(false);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, [row, col]) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      {
        squares: nextSquares,
        row,
        col
      }
    ];

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function movesReverse() {
    setIsMovesReverse(!isMovesReverse);
  }

  let moves = history.map(({squares, row, col}, move) => {
    let description;
    let element = null;

    if (move === currentMove) {
      description = currentMove === 9
        ? 'The result is a draw'
        : row !== null && col !== null
          ? `You are on the go # ${move} [${row}:${col}]`
          : `You are on the go # ${move}`;
      element = (
        <span>
          {description}
        </span>
      );
    } else {
      description = row !== null && col !== null
        ? `Go to move # ${move} [${row}:${col}]`
        : `Go to move # ${move}`;
      element = (
        <button onClick={() => jumpTo(move)}>
          {description}
        </button>
      );
    }

    return (
      <li key={move}>
        {element}
      </li>
    );
  });

  if (isMovesReverse) {
    moves = moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <button onClick={movesReverse}>Reverse</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
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

    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return [a, b, c];
    }
  }

  return null;
}
