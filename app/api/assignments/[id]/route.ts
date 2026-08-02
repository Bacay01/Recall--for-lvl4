import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../auth";
import { NextResponse } from "next/server";

// PATCH — toggle completed status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { id } = await params;
  const { completed } = await request.json();

  const assignment = await prisma.assignment.update({
    where: { id },
    data: { completed },
  });

  return NextResponse.json(assignment);
}

// DELETE — remove an assignment
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { id } = await params;

  await prisma.assignment.delete({ where: { id } });

  return NextResponse.json({ success: true });
}