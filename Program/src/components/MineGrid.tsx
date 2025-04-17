import type React from 'react';

type TileState = 'hidden' | 'revealed' | 'gem' | 'bomb';

interface MineGridProps {
  gridSize: number;
  numMines: number;
  onTileClick: (index: number) => void;
  gameState: 'waiting' | 'playing' | 'won' | 'lost';
  revealedTiles: number[];
  mines: number[];
}

const MineGrid: React.FC<MineGridProps> = ({
  gridSize = 5,
  numMines,
  onTileClick,
  gameState,
  revealedTiles,
  mines,
}) => {
  const getTileState = (index: number): TileState => {
    if (!revealedTiles.includes(index)) {
      return 'hidden';
    }

    if (mines.includes(index)) {
      return 'bomb';
    }

    return 'gem';
  };

  const renderTile = (index: number) => {
    const tileState = getTileState(index);

    const isClickable = gameState === 'playing' && tileState === 'hidden';

    const handleClick = () => {
      if (isClickable) {
        onTileClick(index);
      }
    };

    // Game over, reveal all mines
    const shouldRevealMine = gameState === 'lost' && mines.includes(index);
    const isRevealed = revealedTiles.includes(index) || shouldRevealMine;

    return (
      <button
        key={index}
        className={`mines-tile group ${tileState !== 'hidden' ? `mines-tile-${tileState}` : ''} ${isClickable ? 'hover:scale-105 hover:shadow-lg' : ''}`}
        onClick={handleClick}
        disabled={!isClickable}
        aria-label={`Tile ${index}`}
      >
        {tileState === 'hidden' && (
          <span className="text-2xl opacity-70 group-hover:opacity-100">?</span>
        )}
        {tileState === 'gem' && (
          <span className="text-2xl animate-bounce">💎</span>
        )}
        {tileState === 'bomb' && (
          <span className="text-2xl animate-pulse">💣</span>
        )}
      </button>
    );
  };

  const totalTiles = gridSize * gridSize;

  return (
    <div className="mines-grid">
      {Array.from({ length: totalTiles }).map((_, index) => renderTile(index))}
    </div>
  );
};

export default MineGrid;
