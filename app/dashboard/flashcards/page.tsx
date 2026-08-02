import React from "react";
import FlashcardGenerator from "../../components/FlashcardGenerator";
import SavedDecks from "../../components/SavedDecks";

const FlashcardsPage = () => {
  return (
    <div>
      <FlashcardGenerator />
      <SavedDecks />
    </div>
  );
};

export default FlashcardsPage;