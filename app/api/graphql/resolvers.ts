import { prisma } from "../../../lib/prisma";
import { auth } from "../../../auth";

async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not signed in.");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
}

export const resolvers = {
  Query: {
    assignments: async () => {
      const user = await getCurrentUser();
      const assignments = await prisma.assignment.findMany({
        where: { userId: user.id },
        orderBy: { dueDate: "asc" },
      });
      return assignments.map((a) => ({
        ...a,
        dueDate: a.dueDate.toISOString(),
        createdAt: a.createdAt.toISOString(),
      }));
    },
    decks: async () => {
      const user = await getCurrentUser();
      return prisma.flashcardDeck.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: { cards: true },
      });
    },
  },
  Mutation: {
    addAssignment: async (
      _parent: unknown,
      args: { title: string; course?: string; description?: string; dueDate: string }
    ) => {
      const user = await getCurrentUser();
      const assignment = await prisma.assignment.create({
        data: {
          title: args.title,
          course: args.course,
          description: args.description,
          dueDate: new Date(args.dueDate),
          userId: user.id,
        },
      });
      return {
        ...assignment,
        dueDate: assignment.dueDate.toISOString(),
        createdAt: assignment.createdAt.toISOString(),
      };
    },
    toggleAssignment: async (
      _parent: unknown,
      args: { id: string; completed: boolean }
    ) => {
      await getCurrentUser();
      const assignment = await prisma.assignment.update({
        where: { id: args.id },
        data: { completed: args.completed },
      });
      return {
        ...assignment,
        dueDate: assignment.dueDate.toISOString(),
        createdAt: assignment.createdAt.toISOString(),
      };
    },
    deleteAssignment: async (_parent: unknown, args: { id: string }) => {
      await getCurrentUser();
      await prisma.assignment.delete({ where: { id: args.id } });
      return true;
    },

    saveDeck: async (
      _parent: unknown,
      args: {
        title: string;
        cards: { question: string; answer: string }[];
      }
    ) => {
      const user = await getCurrentUser();
      return prisma.flashcardDeck.create({
        data: {
          title: args.title,
          userId: user.id,
          cards: {
            create: args.cards,
          },
        },
        include: { cards: true },
      });
    },
    deleteDeck: async (_parent: unknown, args: { id: string }) => {
      await getCurrentUser();
      await prisma.flashcardDeck.delete({ where: { id: args.id } });
      return true;
    },
  },
};