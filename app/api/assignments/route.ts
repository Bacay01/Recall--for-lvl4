import { prisma } from "../../../lib/prisma";
import { auth } from "../../../auth";
import { NextResponse } from "next/server";

// GET — list the signed-in user's assignments
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const assignments = await prisma.assignment.findMany({
    where: { userId: user.id },
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json(assignments);
}

// POST — create a new assignment
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const { title, course, dueDate } = await request.json();

  if (!title || !dueDate) {
    return NextResponse.json(
      { error: "Title and due date are required." },
      { status: 400 }
    );
  }

  const assignment = await prisma.assignment.create({
    data: {
      title,
      course,
      dueDate: new Date(dueDate),
      userId: user.id,
    },
  });

  return NextResponse.json(assignment, { status: 201 });
}