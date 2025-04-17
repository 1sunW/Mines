import type React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 border-b border-[hsl(var(--border))]">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💎</span>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            SERBET Mines
          </h1>
        </div>

        <nav className="flex items-center gap-4">
          <a href="/games" className="text-muted-foreground hover:text-foreground transition-colors">
            Games
          </a>
          <a href="/promotions" className="text-muted-foreground hover:text-foreground transition-colors">
            Promotions
          </a>
          <a href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
            Support
          </a>
          <button className="px-4 py-2 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium">
            Login
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
