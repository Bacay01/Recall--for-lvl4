import React from "react";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import DashboardTabs from "./DashboardTabs";
import ApolloProviderWrapper from "../components/ApolloProviderWrapper";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-bg p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display font-semibold text-3xl mb-2">
          Welcome, {session.user?.name || session.user?.email}
        </h1>
        <p className="text-dark/60 mb-6">
          Keep track of your assignments, and turn your notes into flashcards.
        </p>

        <ApolloProviderWrapper>
          <div className="flex flex-col md:flex-row gap-6">
            <DashboardTabs />
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </ApolloProviderWrapper>
      </div>
    </div>
  );
};

export default DashboardLayout;