export const typeDefs = `#graphql
  type Assignment {
    id: ID!
    title: String!
    course: String
    description: String
    dueDate: String!
    completed: Boolean!
    createdAt: String!
  }

  type Flashcard {
    id: ID!
    question: String!
    answer: String!
  }

  type FlashcardDeck {
    id: ID!
    title: String!
    createdAt: String!
    cards: [Flashcard!]!
  }

  input FlashcardInput {
    question: String!
    answer: String!
  }

  type Query {
    assignments: [Assignment!]!
    decks: [FlashcardDeck!]!
  }

  type Mutation {
    addAssignment(title: String!, course: String, description: String, dueDate: String!): Assignment!
    toggleAssignment(id: ID!, completed: Boolean!): Assignment!
    deleteAssignment(id: ID!): Boolean!

    saveDeck(title: String!, cards: [FlashcardInput!]!): FlashcardDeck!
    deleteDeck(id: ID!): Boolean!
  }
`;