"use client";

import React, { useState } from "react";

const demoCards = [
  { question: "What is the powerhouse of the cell?", answer: "Mitochondria" },
  { question: "What year did WWII end?", answer: "1945" },
  { question: "What is 7 × 8?", answer: "56" },
];

const FlashcardDemo = () => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    if (!flipped) {
      setFlipped(true);
    } else {
      setFlipped(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % demoCards.length);
      }, 200);
    }
  };

  const current = demoCards[index];

  return (
    <div className="relative w-72 h-96 mx-auto" style={{ perspective: "1200px" }}>
      <div className="absolute inset-0 bg-white rounded-2xl border-2 border-dark/10 rotate-[-6deg] translate-y-2" />
      <div className="absolute inset-0 bg-white rounded-2xl border-2 border-dark/15 rotate-[4deg] translate-y-1" />

      <button
        onClick={handleClick}
        className="absolute inset-0 w-full h-full text-left"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="absolute inset-0 bg-primary rounded-2xl p-8 flex flex-col justify-between shadow-xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="font-mono text-xs text-white/70 tracking-wide">
              CARD {index + 1} / {demoCards.length}
            </span>
            <p className="font-display text-2xl text-white leading-snug">
              {current.question}
            </p>
            <span className="font-mono text-xs text-white/50">
              tap to reveal
            </span>
          </div>

          <div
            className="absolute inset-0 bg-secondary rounded-2xl p-8 flex flex-col justify-between shadow-xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="font-mono text-xs text-dark/60 tracking-wide">
              ANSWER
            </span>
            <p className="font-display text-3xl text-dark leading-snug">
              {current.answer}
            </p>
            <span className="font-mono text-xs text-dark/50">
              tap for next card
            </span>
          </div>
        </div>
      </button>
    </div>
  );
};

export default FlashcardDemo;