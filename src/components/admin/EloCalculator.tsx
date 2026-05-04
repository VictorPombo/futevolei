'use client';

import { useState, useEffect } from 'react';

export function EloCalculator() {
  const [ratingA, setRatingA] = useState(1500);
  const [ratingB, setRatingB] = useState(1400);
  const [scoreA, setScoreA] = useState(18);
  const [scoreB, setScoreB] = useState(14);
  const [isOfficial, setIsOfficial] = useState(true);

  const [probA, setProbA] = useState(0);
  const [winA, setWinA] = useState({ diffA: 0, diffB: 0 });
  const [winB, setWinB] = useState({ diffA: 0, diffB: 0 });
  const [multiplier, setMultiplier] = useState(0);

  useEffect(() => {
    const calcExpected = (rA: number, rB: number) => 1 / (1 + Math.pow(10, (rB - rA) / 400));
    const calcScoreMultiplier = (winS: number, loseS: number) => {
      const diff = Math.abs(winS - loseS);
      return diff >= 3 ? 1.0 : diff === 2 ? 0.85 : 0.7;
    };
    const calcNewRating = (current: number, expected: number, won: boolean, mult: number, official: boolean) => {
      const K = 32;
      const offMult = official ? 1.5 : 1;
      const delta = K * mult * offMult * ((won ? 1 : 0) - expected);
      return Math.max(Math.round(current + delta), 100);
    };

    const expA = calcExpected(ratingA, ratingB);
    const expB = calcExpected(ratingB, ratingA);
    setProbA(Math.round(expA * 100));

    // Multiplier calculation
    const multA = calcScoreMultiplier(Math.max(scoreA, scoreB), Math.min(scoreA, scoreB));
    setMultiplier(multA);

    // If A wins
    const newRa_winA = calcNewRating(ratingA, expA, true, multA, isOfficial);
    const newRb_loseA = calcNewRating(ratingB, expB, false, multA, isOfficial);
    setWinA({ diffA: newRa_winA - ratingA, diffB: newRb_loseA - ratingB });

    // If B wins
    const newRb_winB = calcNewRating(ratingB, expB, true, multA, isOfficial);
    const newRa_loseB = calcNewRating(ratingA, expA, false, multA, isOfficial);
    setWinB({ diffA: newRa_loseB - ratingA, diffB: newRb_winB - ratingB });

  }, [ratingA, ratingB, scoreA, scoreB, isOfficial]);

  const multText = multiplier === 1.0 ? 'Dominante' : multiplier === 0.85 ? 'Confortável' : 'Apertada';

  return (
    <div className="bg-[rgba(17,17,32,0.6)] backdrop-blur-md border border-[var(--admin-border)] rounded-2xl p-6 h-full flex flex-col">
      <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-[var(--admin-text)]">
        📟 Calculadora ELO Ao Vivo
      </h3>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex flex-col">
          <label className="text-xs text-[var(--admin-text2)] mb-1">Rating Dupla A</label>
          <input 
            type="number" 
            className="bg-black/20 border border-[var(--admin-border)] text-[var(--admin-text)] px-3 py-2 rounded-lg font-dm-mono outline-none focus:border-[var(--admin-primary)]" 
            value={ratingA} 
            onChange={e => setRatingA(parseInt(e.target.value) || 0)} 
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-[var(--admin-text2)] mb-1">Rating Dupla B</label>
          <input 
            type="number" 
            className="bg-black/20 border border-[var(--admin-border)] text-[var(--admin-text)] px-3 py-2 rounded-lg font-dm-mono outline-none focus:border-[var(--admin-primary)]" 
            value={ratingB} 
            onChange={e => setRatingB(parseInt(e.target.value) || 0)} 
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-[var(--admin-text2)] mb-1">Placar A</label>
          <input 
            type="number" 
            className="bg-black/20 border border-[var(--admin-border)] text-[var(--admin-text)] px-3 py-2 rounded-lg font-dm-mono outline-none focus:border-[var(--admin-primary)]" 
            value={scoreA} 
            onChange={e => setScoreA(parseInt(e.target.value) || 0)} 
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-[var(--admin-text2)] mb-1">Placar B</label>
          <input 
            type="number" 
            className="bg-black/20 border border-[var(--admin-border)] text-[var(--admin-text)] px-3 py-2 rounded-lg font-dm-mono outline-none focus:border-[var(--admin-primary)]" 
            value={scoreB} 
            onChange={e => setScoreB(parseInt(e.target.value) || 0)} 
          />
        </div>
      </div>

      <label className="text-sm flex items-center gap-2 mb-4 cursor-pointer text-[var(--admin-text)] hover:text-[var(--admin-primary)] transition-colors">
        <input 
          type="checkbox" 
          checked={isOfficial} 
          onChange={e => setIsOfficial(e.target.checked)} 
          className="accent-[var(--admin-primary)] w-4 h-4"
        />
        Campeonato Oficial (1.5x)
      </label>
      
      <div className="bg-black/30 p-4 rounded-lg border border-dashed border-[var(--admin-border2)] font-dm-mono text-sm flex-1 flex flex-col justify-center">
        <div className="mb-2 text-[var(--admin-text2)]">Probabilidade esperada: A tem {probA}% de chance</div>
        <div className="flex justify-between border-b border-white/5 pb-2 mb-2">
          <span className="text-[var(--admin-success)]">
            Se A ganhar: <b>+{winA.diffA} (A) / {winA.diffB} (B)</b>
          </span>
          <span className="text-[var(--admin-danger)]">
            Se B ganhar: <b>+{winB.diffB} (B) / {winB.diffA} (A)</b>
          </span>
        </div>
        <div className="text-[var(--admin-text2)] text-xs">
          Multiplicador de placar: {multiplier} ({multText})
        </div>
      </div>
    </div>
  );
}
