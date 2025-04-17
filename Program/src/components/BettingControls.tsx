import type React from 'react';

interface BettingControlsProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  numMines: number;
  setNumMines: (num: number) => void;
  currentMultiplier: number;
  gameState: 'waiting' | 'playing' | 'won' | 'lost';
  onStartGame: () => void;
  onCashOut: () => void;
  balance: number;
}

const BettingControls: React.FC<BettingControlsProps> = ({
  betAmount,
  setBetAmount,
  numMines,
  setNumMines,
  currentMultiplier,
  gameState,
  onStartGame,
  onCashOut,
  balance,
}) => {
  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value);
    if (!Number.isNaN(value) && value > 0) {
      setBetAmount(value);
    }
  };

  const handleMinesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10);
    if (!Number.isNaN(value) && value >= 1 && value <= 24) {
      setNumMines(value);
    }
  };

  const isPlaying = gameState === 'playing';
  const isWaiting = gameState === 'waiting';
  const winAmount = betAmount * currentMultiplier;

  return (
    <div className="flex flex-col space-y-6 w-full max-w-md p-6 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">Balance</div>
        <div className="text-xl font-bold">${balance.toFixed(2)}</div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Bet Amount</label>
        <div className="flex items-center">
          <span className="mr-2">$</span>
          <input
            type="number"
            value={betAmount}
            onChange={handleBetChange}
            className="mines-input w-full"
            min="0.1"
            step="0.1"
            disabled={isPlaying}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Number of Mines</label>
        <input
          type="range"
          min="1"
          max="24"
          value={numMines}
          onChange={handleMinesChange}
          className="w-full"
          disabled={isPlaying}
        />
        <div className="flex justify-between">
          <span>1</span>
          <span className="font-bold">{numMines}</span>
          <span>24</span>
        </div>
      </div>

      {isPlaying && (
        <div className="p-4 bg-[hsl(var(--secondary))] rounded-lg text-center">
          <div className="text-sm">Current Multiplier</div>
          <div className="text-2xl font-bold text-[hsl(var(--primary))]">
            {currentMultiplier.toFixed(2)}x
          </div>
          <div className="text-sm mt-1">
            Potential Win: <span className="font-semibold">${winAmount.toFixed(2)}</span>
          </div>
        </div>
      )}

      {isPlaying ? (
        <button
          className="mines-button bg-[hsl(var(--mine-gem-bg))] text-black hover:bg-[hsl(var(--mine-gem-bg))] hover:brightness-110"
          onClick={onCashOut}
        >
          Cash Out ${winAmount.toFixed(2)}
        </button>
      ) : (
        <button
          className="mines-button"
          onClick={onStartGame}
          disabled={betAmount <= 0 || betAmount > balance}
        >
          {gameState === 'lost' ? 'Try Again' : gameState === 'won' ? 'Play Again' : 'Start Game'}
        </button>
      )}
    </div>
  );
};

export default BettingControls;
