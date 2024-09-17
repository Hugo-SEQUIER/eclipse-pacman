import React, { useRef, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import idl from './idl.json';

const PacmanGame = () => {
    const wallet = useWallet();
    const canvasRef = useRef(null);
    const [gameStarted, setGameStarted] = useState(false);
    const gameStartedRef = useRef(gameStarted);
  
    useEffect(() => {
        gameStartedRef.current = gameStarted;
      }, [gameStarted]);
    
    // Game settings
    const canvasWidth = 560;
    const canvasHeight = 620;
    const blockSize = 20;
  
  
    // Define the initial game state
    const initialState = {
        pacman: { x: 1, y: 1, dx: 0, dy: 0, speed: 1 },
        ghosts: [
        { x: 14, y: 1, dx: -1, dy: 0, speed: 1, color: 'red' },
        // Add more ghosts as needed
        ],
        score: 0,
        lives: 3,
        gameOver: false,
        // Define the maze layout
        map: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1],
            [1,2,1,1,1,1,2,1,1,1,1,2,1,1,2,1,1,1,1,2,1,1,1,1,2,2,1,1],
            [1,2,1,1,1,1,2,1,1,1,1,2,1,1,2,1,1,1,1,2,1,1,1,1,2,2,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1],
            [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,2,1,1],
            [1,2,2,2,2,2,2,1,1,2,2,2,1,1,2,2,2,1,1,2,2,2,2,2,2,2,1,1],
            [1,1,1,1,1,1,2,1,1,1,1,2,1,1,2,1,1,1,1,2,1,1,1,1,1,2,1,1],
            [0,0,0,0,0,1,2,1,1,1,1,2,1,1,2,1,1,1,1,2,1,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,2,1,1,2,2,2,2,2,2,2,2,1,1,2,1,1,1,1,1,1,1,1],
            [2,2,2,2,2,2,2,2,2,2,1,1,0,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2],
            [1,1,1,1,1,1,2,1,1,2,1,0,0,0,0,1,2,1,1,2,1,1,1,1,1,1,1,1],
            [0,0,0,0,0,1,2,1,1,2,1,0,0,0,0,1,2,1,1,2,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,2,1,1,2,1,1,1,1,1,1,2,1,1,2,1,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,2,1,1,2,2,2,2,2,2,2,2,1,1,2,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1],
            [1,2,1,1,1,1,2,1,1,1,1,2,1,1,2,1,1,1,1,2,1,1,1,1,2,2,1,1],
            [1,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,1,1],
            [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,2,1,1],
            [1,2,2,2,2,2,2,1,1,2,2,2,1,1,2,2,2,1,1,2,2,2,2,2,2,2,1,1],
            [1,2,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,2,2,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ],
    };
    // Initialize the game state directly from initialState
    const [gameState, setGameState] = useState(() => JSON.parse(JSON.stringify(initialState)));

    const initializeGameLoop = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
      
        let animationFrameId;
      
        const gameLoop = () => {
          if (!gameStartedRef.current) {
            // Stop requesting new frames if the game isn't started
            cancelAnimationFrame(animationFrameId);
            return;
          }
          update();
          draw(context);
          animationFrameId = requestAnimationFrame(gameLoop);
        };
      
        gameLoop();
      
        return () => {
          cancelAnimationFrame(animationFrameId);
        };
      };

      useEffect(() => {
        let cleanup;
        if (gameStarted) {
          cleanup = initializeGameLoop();
        }
        return () => {
          if (cleanup) cleanup();
        };
      }, [gameStarted]);
      
      useEffect(() => {
        if (gameState.gameOver) {
          setGameStarted(false);
        }
      }, [gameState.gameOver]);
      
      useEffect(() => {
        if (!gameStarted && gameState.gameOver) {
          alert('Game Over! Your score: ' + gameState.score);
          setGameState(JSON.parse(JSON.stringify(initialState)));
        }
      }, [gameStarted]);

      const update = () => {
  setGameState((prevState) => {
    const currentState = { ...prevState };

    // Update Pacman's position
    const newPacman = moveCharacter(currentState.pacman, currentState.map);

    // Update ghosts' positions
    const newGhosts = currentState.ghosts.map((ghost) => moveCharacter(ghost, currentState.map));

    // Prepare new game state
    let newGameState = { ...currentState, pacman: newPacman, ghosts: newGhosts };

    // Now check for collisions, collect dots, etc.
    newGameState = checkCollisions(newGameState);
    newGameState = collectDots(newGameState);
    newGameState = checkGameOver(newGameState);

    // Compare newGameState with currentState
    if (shallowEqual(newGameState, currentState)) {
      // No changes, avoid updating state
      return currentState;
    }

    return newGameState;
  });
};

// Helper function for shallow comparison
const shallowEqual = (obj1, obj2) => {
  for (let key in obj1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
};
    
      const moveCharacter = (character, map) => {
        //console.log(`Moving character at (${character.x}, ${character.y}) with dx=${character.dx}, dy=${character.dy}`);
        const newX = character.x + character.dx * character.speed;
        const newY = character.y + character.dy * character.speed;
    
        const mapHeight = map.length;
        const mapWidth = map[0].length;
    
        const roundedX = Math.round(newX);
        const roundedY = Math.round(newY);
    
        if (
          roundedY >= 0 &&
          roundedY < mapHeight &&
          roundedX >= 0 &&
          roundedX < mapWidth &&
          map[roundedY][roundedX] !== 1
        ) {
          return { ...character, x: newX, y: newY };
        } else {
          return character;
        }
      };

      const checkCollisions = (currentState) => {
        let newGameState = { ...currentState };
        let collisionOccurred = false;
    
        newGameState.ghosts.forEach((ghost) => {
          if (
            Math.abs(newGameState.pacman.x - ghost.x) < 0.5 &&
            Math.abs(newGameState.pacman.y - ghost.y) < 0.5
          ) {
            collisionOccurred = true;
          }
        });
    
        if (collisionOccurred) {
          newGameState.lives--;
          newGameState = resetPositions(newGameState);
        }
    
        return newGameState;
      };

      const collectDots = (currentState) => {
        let newGameState = { ...currentState };
        const pacmanX = Math.round(newGameState.pacman.x);
        const pacmanY = Math.round(newGameState.pacman.y);
    
        if (newGameState.map[pacmanY][pacmanX] === 2) {
          // Create a deep copy of the map
          const newMap = newGameState.map.map((row) => [...row]);
          newMap[pacmanY][pacmanX] = 0;
          newGameState.map = newMap;
          newGameState.score += 10;
        }
        return newGameState;
      };

      const checkGameOver = (currentState) => {
        let newGameState = { ...currentState };
        if (newGameState.lives <= 0) {
          newGameState.gameOver = true;
        }
        return newGameState;
      };
      
      const resetPositions = (currentState) => {
        console.log('Resetting positions');
        return {
          ...currentState,
          pacman: { ...initialState.pacman },
          ghosts: initialState.ghosts.map((ghost) => ({ ...ghost })),
        };
      };

      const draw = (context) => {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
    
        // Draw the maze
        drawMaze(context);
    
        // Draw Pacman
        drawPacman(context);
    
        // Draw Ghosts
        drawGhosts(context);
    
        // Draw Score and Lives
        drawScore(context);
      };

      const drawMaze = (context) => {
        gameState.map.forEach((row, rowIndex) => {
          row.forEach((value, colIndex) => {
            if (value === 1) {
              // Draw wall
              context.fillStyle = 'blue';
              context.fillRect(colIndex * blockSize, rowIndex * blockSize, blockSize, blockSize);
            } else if (value === 2) {
              // Draw dot
              context.fillStyle = 'white';
              context.beginPath();
              context.arc(
                colIndex * blockSize + blockSize / 2,
                rowIndex * blockSize + blockSize / 2,
                blockSize / 8,
                0,
                2 * Math.PI
              );
              context.fill();
            }
          });
        });
      };
      
      const drawPacman = (context) => {
        context.fillStyle = 'yellow';
        context.beginPath();
        context.arc(
          gameState.pacman.x * blockSize + blockSize / 2,
          gameState.pacman.y * blockSize + blockSize / 2,
          blockSize / 2,
          0.25 * Math.PI,
          1.75 * Math.PI
        );
        context.lineTo(
          gameState.pacman.x * blockSize + blockSize / 2,
          gameState.pacman.y * blockSize + blockSize / 2
        );
        context.fill();
      };

      const drawGhosts = (context) => {
        gameState.ghosts.forEach((ghost) => {
          context.fillStyle = ghost.color;
          context.beginPath();
          context.arc(
            ghost.x * blockSize + blockSize / 2,
            ghost.y * blockSize + blockSize / 2,
            blockSize / 2,
            0,
            2 * Math.PI
          );
          context.fill();
        });
      };
    
      const drawScore = (context) => {
        context.fillStyle = 'white';
        context.font = '16px Arial';
        context.fillText(`Score: ${gameState.score}`, 8, canvasHeight - 16);
      };
    
      useEffect(() => {
        const handleKeyDown = (event) => {
          const { key } = event;
          let dx = 0;
          let dy = 0;
    
          switch (key) {
            case 'ArrowUp':
              dx = 0;
              dy = -1;
              break;
            case 'ArrowDown':
              dx = 0;
              dy = 1;
              break;
            case 'ArrowLeft':
              dx = -1;
              dy = 0;
              break;
            case 'ArrowRight':
              dx = 1;
              dy = 0;
              break;
            default:
              break;
          }
    
          console.log(`Key pressed: ${key}, dx: ${dx}, dy: ${dy}`);
    
          setGameState((prevState) => ({
            ...prevState,
            pacman: { ...prevState.pacman, dx, dy },
          }));
        };
      
        window.addEventListener('keydown', handleKeyDown);
      
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, []);
    
      const playGame = async () => {
        if (!wallet.connected) {
          alert('Please connect your wallet!');
          return;
        }
    
        const connection = new anchor.web3.Connection('https://staging-rpc.dev2.eclipsenetwork.xyz');
        const provider = new anchor.AnchorProvider(connection, wallet, {});
        anchor.setProvider(provider);
    
        // Replace with your program ID
        const programId = new anchor.web3.PublicKey('DRUiH1Vd6zUvrZXKmKPwKnYq8jLiUYJdffStA1ETmc2v');
    
        if (!idl) {
          console.error('Failed to fetch IDL');
          return;
        }
    
        const program = new anchor.Program(idl, programId, provider);
    
        try {
          const tx = await program.rpc.playGame({
            accounts: {
              player: wallet.publicKey,
            },
          });
          console.log('Transaction signature', tx);
          alert('Game started! Transaction signed.');
          setGameState(JSON.parse(JSON.stringify(initialState))); // Reset game state
          setGameStarted(true);
        } catch (err) {
          console.error(err);
          alert('Transaction failed.');
        }
      };
      
    
      return (
        <div>
          {!gameStarted && <button onClick={playGame}>Play Pacman</button>}
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{ border: '1px solid black', backgroundColor: 'black' }}
          />
        </div>
      );
    };
    
export default PacmanGame;
