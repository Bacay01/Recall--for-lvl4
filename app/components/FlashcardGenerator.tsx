"use client";

import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const SAVE_DECK = gql`
  mutation SaveDeck($title: String!, $cards: [FlashcardInput!]!) {
    saveDeck(title: $title, cards: $cards) {
      id
    }
  }
`;

interface Flashcard {
  question: string;
  answer: string;
}

const FlashcardGenerator = () => {
  const [notes, setNotes] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const [saveDeck, { loading: saving }] = useMutation(SAVE_DECK, {
  refetchQueries: ["GetDecks"],
    });
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    if (!notes.trim()) {
      setError("Paste some notes first.");
      return;
    }

    setError("");
    setLoading(true);
    setFlashcards([]);
    setCurrentIndex(0);
    setFlipped(false);
    setSaved(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate flashcards.");
        return;
      }

      setFlashcards(data.flashcards);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setNotes(text);
    } catch {
      setError("Couldn't access clipboard — paste manually instead.");
    }
  };

  const handleCardClick = () => {
    setFlipped((prev) => !prev);
  };

  const goToCard = (direction: "next" | "prev") => {
    setFlipped(false);
    setCurrentIndex((i) => {
      if (direction === "next") return (i + 1) % flashcards.length;
      return i === 0 ? flashcards.length - 1 : i - 1;
    });
  };

  const handleSaveDeck = async () => {
    const title = notes.slice(0, 40) + (notes.length > 40 ? "..." : "");
    await saveDeck({
      variables: {
        title,
        cards: flashcards.map((c) => ({ question: c.question, answer: c.answer })),
      },
    });
    setSaved(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
      <h2 className="font-display font-semibold text-xl mb-4">
        Flashcard Generator
      </h2>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-dark/50">Paste your notes below</span>
          <button
            onClick={handlePaste}
            className="flex items-center gap-1.5 text-xs text-secondary font-medium hover:underline"
          >
            <img src="/paste.svg" alt="" className="w-3.5 h-3.5" />
            Paste
          </button>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste a lecture summary, textbook paragraph, or your own notes here..."
          rows={6}
          className="w-full border border-dark/15 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-secondary"
        />
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 mb-6"
      >
        <img src="/sparkle.svg" alt="" className="w-4 h-4 invert" />
        {loading ? "Generating..." : "Generate flashcards"}
      </button>

      {flashcards.length > 0 && (
        <div>
          <p className="font-mono text-xs text-dark/40 mb-3 text-center">
            Card {currentIndex + 1} / {flashcards.length}
          </p>

          <div
            onClick={handleCardClick}
            className="relative w-full h-56 mx-auto cursor-pointer"
            style={{ perspective: "1200px" }}
          >
            <div
              className="relative w-full h-full transition-transform duration-500"
              style={{
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              <div
                className="absolute inset-0 bg-primary rounded-2xl p-6 flex items-center justify-center text-center shadow-lg"
                style={{ backfaceVisibility: "hidden" }}
              >
                <p className="font-display text-lg text-white">
                  {flashcards[currentIndex].question}
                </p>
              </div>

              <div
                className="absolute inset-0 bg-secondary rounded-2xl p-6 flex items-center justify-center text-center shadow-lg"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <p className="font-display text-lg text-dark">
                  {flashcards[currentIndex].answer}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => goToCard("prev")}
              className="px-4 py-2 border border-dark/15 rounded-lg text-sm hover:bg-bg"
            >
              ← Prev
            </button>
            <button
              onClick={() => goToCard("next")}
              className="px-4 py-2 border border-dark/15 rounded-lg text-sm hover:bg-bg"
            >
              Next →
            </button>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={handleSaveDeck}
              disabled={saving || saved}
              className="px-4 py-2 bg-secondary text-dark rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {saved ? "Saved!" : saving ? "Saving..." : "Save this deck"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardGenerator;