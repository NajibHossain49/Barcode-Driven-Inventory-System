// File: src/app/components/Navbar.tsx
// Description: A responsive navigation bar for the inventory system application.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Inventory System</h1>
        <div className="space-x-4">
          <Link
            href="/"
            className={`px-3 py-2 rounded ${
              pathname === "/" ? "bg-blue-800" : "hover:bg-blue-500"
            }`}
          >
            Home
          </Link>
          <Link
            href="/kanban"
            className={`px-3 py-2 rounded ${
              pathname === "/kanban" ? "bg-blue-800" : "hover:bg-blue-500"
            }`}
          >
            Kanban Board
          </Link>
          <Link
            href="/analytics"
            className={`px-3 py-2 rounded ${
              pathname === "/analytics" ? "bg-blue-800" : "hover:bg-blue-500"
            }`}
          >
            Analytics
          </Link>
        </div>
      </div>
    </nav>
  );
}
