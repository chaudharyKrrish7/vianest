"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavLinks() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Overview", href: "/admin" },
    { name: "Agents", href: "/admin/agents" },
    { name: "Ledger & UTR", href: "/admin/ledger" },
    { name: "Settings", href: "/admin/settings" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "text-zinc-900 bg-zinc-100/80 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Hamburger Button */}
      <button 
        className="md:hidden flex items-center justify-center p-2 text-zinc-600 hover:text-zinc-900 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Admin Menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Dropdown Menu (Glassmorphic) */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-zinc-200/80 shadow-lg md:hidden animate-[fadeIn_0.2s_ease-out_forwards]">
          <nav className="flex flex-col p-4 gap-2">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)} // Close menu on click
                  className={`rounded-xl px-4 py-3 text-base font-semibold transition-all duration-300 ${
                    isActive
                      ? "text-zinc-900 bg-zinc-100/80 shadow-sm border border-zinc-200/50"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}