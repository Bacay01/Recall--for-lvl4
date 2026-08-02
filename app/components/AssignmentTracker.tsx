"use client";

import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";

const GET_ASSIGNMENTS = gql`
  query GetAssignments {
    assignments {
      id
      title
      course
      description
      dueDate
      completed
    }
  }
`;

const ADD_ASSIGNMENT = gql`
  mutation AddAssignment($title: String!, $course: String, $description: String, $dueDate: String!) {
    addAssignment(title: $title, course: $course, description: $description, dueDate: $dueDate) {
      id
    }
  }
`;

const TOGGLE_ASSIGNMENT = gql`
  mutation ToggleAssignment($id: ID!, $completed: Boolean!) {
    toggleAssignment(id: $id, completed: $completed) {
      id
    }
  }
`;

const DELETE_ASSIGNMENT = gql`
  mutation DeleteAssignment($id: ID!) {
    deleteAssignment(id: $id)
  }
`;

interface Assignment {
  id: string;
  title: string;
  course: string | null;
  description: string | null;
  dueDate: string;
  completed: boolean;
}

interface AssignmentsData {
  assignments: Assignment[];
}

const AssignmentTracker = () => {
  const { data, loading, refetch } = useQuery<AssignmentsData>(GET_ASSIGNMENTS);
  const [addAssignment] = useMutation(ADD_ASSIGNMENT);
  const [toggleAssignment] = useMutation(TOGGLE_ASSIGNMENT);
  const [deleteAssignment] = useMutation(DELETE_ASSIGNMENT);

  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const assignments: Assignment[] = data?.assignments || [];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    await addAssignment({ variables: { title, course, description, dueDate } });

    setTitle("");
    setCourse("");
    setDescription("");
    setDueDate("");
    refetch();
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    await toggleAssignment({ variables: { id, completed: !completed } });
    refetch();
  };

  const handleDelete = async (id: string) => {
    await deleteAssignment({ variables: { id } });
    refetch();
  };

  const isOverdue = (dueDate: string, completed: boolean) => {
    return !completed && new Date(dueDate) < new Date();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="font-display font-semibold text-xl mb-4">
        Assignment Tracker
      </h2>

      <form onSubmit={handleAdd} className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          placeholder="Assignment title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-dark/15 rounded-lg px-4 py-2.5"
        />

        <textarea
          placeholder="Small details about this assignment (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="border border-dark/15 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-secondary"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Course (optional)"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="flex-1 border border-dark/15 rounded-lg px-4 py-2.5 w-full"
          />
          <input
  type="date"
  value={dueDate}
  onChange={(e) => setDueDate(e.target.value)}
  required
  className="border border-dark/15 rounded-lg px-4 py-2.5 w-full sm:w-auto"
/>
        </div>

        <button
          type="submit"
          className="bg-primary text-white font-medium py-2.5 rounded-lg hover:opacity-90"
        >
          Add assignment
        </button>
      </form>

      {loading ? (
        <p className="text-dark/40 text-sm">Loading...</p>
      ) : assignments.length === 0 ? (
        <p className="text-dark/40 text-sm">No assignments yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {assignments.map((a) => (
            <li
              key={a.id}
              className={`flex items-start justify-between border rounded-lg px-4 py-3 ${
                isOverdue(a.dueDate, a.completed)
                  ? "border-primary/40 bg-primary/5"
                  : "border-dark/10"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={a.completed}
                  onChange={() => toggleComplete(a.id, a.completed)}
                  className="w-5 h-5 mt-0.5"
                />
                <div>
                  <p
                    className={`font-medium ${
                      a.completed ? "line-through text-dark/40" : "text-dark"
                    }`}
                  >
                    {a.title}
                  </p>
                  <p className="text-xs text-dark/40">
                    {a.course && `${a.course} · `}
                    Due {new Date(a.dueDate).toLocaleDateString()}
                    {isOverdue(a.dueDate, a.completed) && " · Overdue"}
                  </p>
                  {a.description && (
                    <p className="text-sm text-dark/60 mt-1">{a.description}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                className="text-dark/30 hover:text-primary text-sm shrink-0"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssignmentTracker;