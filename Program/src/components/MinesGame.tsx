import type React from 'react';
import { useState, useEffect } from 'react';
import MineGrid from './MineGrid';
import BettingControls from './BettingControls';

// Calculate multiplier based on current game state
// Formula is simplified but provides increasing returns as more non-mine tiles are revealed
const calculateMultiplier = (gridSize: number, numMines: number, revealedTiles: number[]) => {
  const totalTiles = gridSize * gridSize;
  const safeTiles = totalTiles - numMines;

  if (revealedTiles.length === 0) return 1;

  // The more tiles revealed, the higher the multiplier
  // This formula creates an exponential growth in multiplier
  const baseMultiplier = safeTiles / (safeTiles - revealedTiles.length);

  // Apply a multiplier based on number of mines (more mines = higher multiplier)
  const mineMultiplier = 1 + (numMines / totalTiles);

  return baseMultiplier * mineMultiplier;
};

const MinesGame: React.FC = () => {
  const [balance, setBalance] = useState(1000); // Starting balance
  const [betAmount, setBetAmount] = useState(10); // Default bet
  const [numMines, setNumMines] = useState(3); // Default mines
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'won' | 'lost'>('waiting');
  const [mines, setMines] = useState<number[]>([]);
  const [revealedTiles, setRevealedTiles] = useState<number[]>([]);
  const [multiplier, setMultiplier] = useState(1);

  const gridSize = 5; // 5x5 grid
  const totalTiles = gridSize * gridSize;

  // Generate random mines
  const generateMines = () => {
    const minePositions: number[] = [];
    while (minePositions.length < numMines) {
      const position = Math.floor(Math.random() * totalTiles);
      if (!minePositions.includes(position)) {
        minePositions.push(position);
      }
    }
    return minePositions;
  };

  // Start a new game
  const startGame = () => {
    if (betAmount > balance) return;

    // Deduct bet amount from balance
    setBalance(prev => prev - betAmount);

    // Generate new mines
    const newMines = generateMines();
    setMines(newMines);

    // Reset game state
    setRevealedTiles([]);
    setMultiplier(1);
    setGameState('playing');
  };

  // Handle tile click
  const handleTileClick = (index: number) => {
    if (gameState !== 'playing') return;

    // Check if clicked on a mine
    if (mines.includes(index)) {
      // Game over
      setGameState('lost');
      // Reveal all mines
      setRevealedTiles([...revealedTiles, ...mines]);
      return;
    }

    // Reveal tile
    const newRevealedTiles = [...revealedTiles, index];
    setRevealedTiles(newRevealedTiles);

    // Calculate new multiplier
    const newMultiplier = calculateMultiplier(gridSize, numMines, newRevealedTiles);
    setMultiplier(newMultiplier);

    // Check if all safe tiles are revealed
    const safeTiles = totalTiles - numMines;
    if (newRevealedTiles.length === safeTiles) {
      // Player has won
      cashOut();
      setGameState('won');
    }
  };

  // Cash out current winnings
  const cashOut = () => {
    if (gameState !== 'playing') return;

    const winnings = betAmount * multiplier;
    setBalance(prev => prev + winnings);
    setGameState('won');
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="w-full text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">Mines</h2>
        <p className="text-muted-foreground">
          Uncover gems while avoiding mines to increase your multiplier!
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-8 w-full justify-center">
        <div className="bg-[hsl(var(--card))] p-6 rounded-xl border border-[hsl(var(--border))]">
          <MineGrid
            gridSize={gridSize}
            numMines={numMines}
            onTileClick={handleTileClick}
            gameState={gameState}
            revealedTiles={revealedTiles}
            mines={mines}
          />
        </div>

        <BettingControls
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          numMines={numMines}
          setNumMines={setNumMines}
          currentMultiplier={multiplier}
          gameState={gameState}
          onStartGame={startGame}
          onCashOut={cashOut}
          balance={balance}
        />
      </div>

      {/* Game status message */}
      {gameState === 'won' && (
        <div className="p-4 bg-[hsl(var(--mine-gem-bg))] text-black rounded-lg text-center w-full max-w-md">
          <p className="text-xl font-bold">You won ${(betAmount * multiplier).toFixed(2)}!</p>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="p-4 bg-[hsl(var(--mine-bomb-bg))] text-white rounded-lg text-center w-full max-w-md">
          <p className="text-xl font-bold">Boom! You hit a mine and lost ${betAmount.toFixed(2)}.</p>
        </div>
      )}
    </div>
  );
};

export default MinesGame;
