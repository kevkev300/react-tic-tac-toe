import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)} // onClick is a prop here, not a trigger bc it is on a react component, not HTML tag
    />;
  }

  createRows() {
    let content = []
    for (let i = 0; i < 3; i++) {
      let counter = i * 3
      content.push(
        <div className="board-row">
          {this.renderSquare(counter)}
          {this.renderSquare(counter + 1)}
          {this.renderSquare(counter + 2 )}
        </div>
      )
    }
    return content
  }

  render() {
    return (
      <div>
        {
          this.createRows()
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        square: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const location = squareLocation(step.square)
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button style={{fontWeight: (move === this.state.stepNumber ? "bold" : "")}} onClick={() => this.jumpTo(move)}>{`${desc}${move ? ` --- (${location})` : ''}`}</button>
        </li>
      )
    });

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// helper functions =======================

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function squareLocation(square) {
  return `col ${squareColumn(square)}, row ${squareRow(square)}`
}

function squareColumn(square) {
  let col;
  if ([0, 3, 6].includes(square)) {
    col = 1;
  } else if ([1, 4, 7].includes(square)) {
    col = 2;
  } else {
    col = 3;
  }

  return col
}

function squareRow(square) {
  let row;
  if ([0, 1, 2].includes(square)) {
    row = 1;
  } else if ([3, 4, 5].includes(square)) {
    row = 2;
  } else {
    row = 3;
  }

  return row
}
