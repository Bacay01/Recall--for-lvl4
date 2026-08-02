"use client";

import React from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";

const GET_DECKS = gql`
  query GetDecks {
    decks {
      id
      title
      createdAt
      cards {
        id
        question
        answer
      }
    }
  }
`;

const DELETE_DECK = gql`
  mutation DeleteDeck($id: ID!) {
    deleteDeck(id: $id)
  }
`;

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface Deck {
  id: string;
  title: string;
  createdAt: string;
  cards: Flashcard[];
}

interface DecksData {
  decks: Deck[];
}

const SavedDecks = () => {
  const { data, loading, refetch } = useQuery<DecksData>(GET_DECKS);
  const [deleteDeck] = useMutation(DELETE_DECK);

  const decks = data?.decks || [];

  const handleDelete = async (id: string) => {
    await deleteDeck({ variables: { id } });
    refetch();
  };

  if (loading) return <p className="text-dark/40 text-sm">Loading decks...</p>;
  if (decks.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
      <h2 className="font-display font-semibold text-xl mb-4">
        Saved Decks
      </h2>
      <ul className="flex flex-col gap-3">
        {decks.map((deck) => (
          <li
            key={deck.id}
            className="flex items-center justify-between border border-dark/10 rounded-lg px-4 py-3"
          >
            <div>
              <p className="font-medium text-dark">{deck.title}</p>
              <p className="text-xs text-dark/40">
                {deck.cards.length} cards ·{" "}
                {new Date(deck.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(deck.id)}
              className="text-dark/30 hover:text-primary text-sm"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedDecks;