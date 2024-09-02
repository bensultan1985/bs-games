import React, { useState, useEffect } from "react";
import styles from "./connectFour.module.css";

export const ConnectFour = () => {
  const rows = 6;
  const columns = 7;
  const [grid, setGrid] = useState(
    Array(rows)
      .fill(null)
      .map(() => Array(columns).fill(null))
  );
  const [player, setPlayer] = useState(); // 'user' or 'ai'
  const [userPieces, setUserPieces] = useState(21);
  const [aiPieces, setAiPieces] = useState(21);
  const [winner, setWinner] = useState(false);
  const [winnerMessage, setWinnerMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [highlightedCol, setHighlightedCol] = useState(null);
  const [showGame, setShowGame] = useState(false);
  useEffect(() => {
    console.log(grid);
    if (player == "ai") {
      handleAITurn(); // AI turn after user move
    }
  }, [grid, gameStarted]);
  const addMove = (col, color) => {
    console.log("taking turn");
    console.log(col);
    console.log(player);
    const newGrid = grid.map((row) => row.slice());
    for (let row = rows - 1; row >= 0; row--) {
      console.log(grid);
      console.log(newGrid[row][col]);
      if (!newGrid[row][col]) {
        newGrid[row][col] = color;
        break;
      }
    }
    setGrid(newGrid);
    return newGrid;
  };

  const handleClick = async (col) => {
    if (player === "ai") return;
    if (winner || !gameStarted) return; // Prevent clicks if game is over or game hasn't started

    const newGrid = addMove(col, "blue");

    const winnerCheck = checkWinner(newGrid);

    if (winnerCheck) {
      setWinner("user");
      setWinnerMessage("You Won!");
      return;
    }
    setUserPieces(userPieces - 1);
    if (userPieces === 0) {
      setWinner("tie");
      setWinnerMessage("Tie Game!");
    }
    setPlayer("ai");
  };

  const handleAiTurnEnd = async (col, firstTurn) => {
    if (winner || (!gameStarted && firstTurn !== true)) return; // Prevent clicks if game is over or game hasn't started
    console.log("hit2");
    const newGrid = addMove(col, "red");

    const winnerCheck = checkWinner(newGrid);

    if (winnerCheck) {
      setWinner("ai");
      setWinnerMessage("AI Beat You! Try again!");
      return;
    }
    setAiPieces(aiPieces - 1);
    if (aiPieces === 0) {
      setWinner("ai");
      setWinnerMessage("Tie game!");
    }
    setPlayer("user");
  };

  const handleAITurn = async (firstTurn) => {
    // Call your OpenAI API here
    console.log("fetching AI turn...");
    const response = await fetch("/api/getAiMove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ grid: grid }),
    });

    const { thisTurn } = await response.json();
    console.log("this is this turn", thisTurn);
    const colIndex = parseInt(thisTurn); // Assuming format like 'c4'
    await handleAiTurnEnd(colIndex, firstTurn);
    return;
  };

  const checkWinner = (grid) => {
    const rows = grid.length;
    const cols = grid[0].length;

    const checkLine = (a, b, c, d) => {
      return a !== null && a === b && a === c && a === d;
    };

    // Check horizontal lines
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols - 3; col++) {
        if (
          checkLine(
            grid[row][col],
            grid[row][col + 1],
            grid[row][col + 2],
            grid[row][col + 3]
          )
        ) {
          return grid[row][col];
        }
      }
    }

    // Check vertical lines
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows - 3; row++) {
        if (
          checkLine(
            grid[row][col],
            grid[row + 1][col],
            grid[row + 2][col],
            grid[row + 3][col]
          )
        ) {
          return grid[row][col];
        }
      }
    }

    // Check diagonal lines (bottom-left to top-right)
    for (let row = 3; row < rows; row++) {
      for (let col = 0; col < cols - 3; col++) {
        if (
          checkLine(
            grid[row][col],
            grid[row - 1][col + 1],
            grid[row - 2][col + 2],
            grid[row - 3][col + 3]
          )
        ) {
          return grid[row][col];
        }
      }
    }

    // Check diagonal lines (top-left to bottom-right)
    for (let row = 0; row < rows - 3; row++) {
      for (let col = 0; col < cols - 3; col++) {
        if (
          checkLine(
            grid[row][col],
            grid[row + 1][col + 1],
            grid[row + 2][col + 2],
            grid[row + 3][col + 3]
          )
        ) {
          return grid[row][col];
        }
      }
    }

    return null;
  };

  const resetGame = () => {
    setGrid(
      Array(rows)
        .fill(null)
        .map(() => Array(columns).fill(null))
    );
    // setPlayer("user");
    console.log("reset game");
    setWinner(false);
    setGameStarted(false);
    setWinnerMessage("");
    setWinner("");
    setUserPieces(21);
    setAiPieces(21);
    setShowGame(false);
  };

  const startGame = async () => {
    setShowGame(true);
    console.log("game started");
    setGameStarted(true);
    console.log("set game started", gameStarted);
    const firstPlayer = Math.random() < 0.5 ? "user" : "ai";
    setPlayer(firstPlayer);
    if (firstPlayer === "ai") {
      // Give the AI the first move
      await handleAITurn(true); // Adding a slight delay for a better user experience
    }
  };

  const handleMouseEnter = (colIndex) => {
    setHighlightedCol(colIndex);
  };

  const handleMouseLeave = () => {
    setHighlightedCol(null);
  };

  return (
    <div>
      {!showGame && (
        <button
          className={styles.connectFourButton}
          onClick={startGame}
          disabled={gameStarted}
        >
          Start Game
        </button>
      )}
      {showGame && (
        <>
          <div name={"gameInfo"} className={styles.infoGrid}>
            <div className={styles.infoCell}>
              {player === "user" ? "It's Your Turn" : "ChatGPT's Turn"}
            </div>
          </div>
          <div></div>
          <div></div>
          <div className={styles.grid}>
            {grid[0].map((_, colIndex) => (
              <div key={colIndex} className={styles.column}>
                {grid.map((row, rowIndex) => {
                  let highlight =
                    highlightedCol === colIndex ? styles.highlight : "";
                  return (
                    <div
                      key={rowIndex}
                      className={`${styles.cell} ${
                        styles[row[colIndex]]
                      } ${highlight}`}
                      onClick={() => handleClick(colIndex)}
                      onMouseEnter={() => handleMouseEnter(colIndex)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* {row[colIndex]} */}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
      {winner && (
        <div>
          <p>{winnerMessage}</p>
          <button className={styles["connect-four-button"]} onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectFour;
