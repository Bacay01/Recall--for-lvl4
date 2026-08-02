"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const DashboardTabs = () => {
  const pathname = usePathname();

  const tabs = [
    { href: "/dashboard/assignments", label: "Assignments" },
    { href: "/dashboard/flashcards", label: "Flashcards" },
  ];

  return (
    <>
      {/* MOBILE: logout button pinned top-right */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="md:hidden fixed top-4 right-4 z-10 text-sm font-medium text-primary bg-white shadow-sm px-4 py-2 rounded-lg"
      >
        Log out
      </button>

      {/* SIDEBAR */}
      <div className="flex flex-col gap-1 bg-white rounded-xl p-2 shadow-sm w-full md:w-48 h-fit">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium ${
              pathname === tab.href
                ? "bg-primary/10 text-primary"
                : "text-dark/70 hover:bg-bg"
            }`}
          >
            {tab.label}
          </Link>
        ))}

        {/* DESKTOP: logout button under the sidebar links */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="hidden md:block mt-2 pt-2 border-t border-dark/10 px-4 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-bg text-left"
        >
          Log out
        </button>
      </div>
    </>
  );
};

export default DashboardTabs;