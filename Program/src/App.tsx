import React from 'react';
import MinesGame from './components/MinesGame';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Header />
      <main className="container py-8">
        <MinesGame />
      </main>
    </div>
  );
}

export default App;
