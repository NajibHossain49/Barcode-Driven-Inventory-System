// File: src/app/components/Navbar.tsx
// Description: A responsive navigation bar for the inventory system application.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/analytics", label: "Analytics", icon: "📊" },
    // { href: "/kanban", label: "Kanban Board", icon: "📋" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div>
                <h1 className="text-xl font-bold">Inventory System</h1>
                <p className="text-xs text-blue-100 hidden sm:block">Management Dashboard</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  pathname === item.href
                    ? "bg-blue-800 text-white shadow-md"
                    : "hover:bg-blue-500 hover:bg-opacity-50"
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
                {pathname === item.href && (
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-500 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-700 bg-opacity-50 rounded-lg mt-2 backdrop-blur-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-blue-800 text-white shadow-md"
                    : "text-blue-100 hover:bg-blue-600 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                {pathname === item.href && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Active Page Indicator */}
      <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-300"></div>
    </nav>
  );
}