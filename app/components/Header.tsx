"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gold/30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/lotus-logo.png"
            alt="The Lotus Foundation logo"
            width={48}
            height={48}
            className="h-12 w-auto"
            priority
          />
          <span className="font-display text-lg text-royal-purple leading-tight">
            The Lotus Foundation
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-teal ${
                pathname === link.href ? "text-royal-purple" : "text-foreground/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-full bg-royal-purple px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-teal"
          >
            Get in Touch
          </Link>
        </nav>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className="h-0.5 w-6 bg-royal-purple" />
          <span className="h-0.5 w-6 bg-royal-purple" />
          <span className="h-0.5 w-6 bg-royal-purple" />
        </button>
      </div>

      {open && (
        <nav className="md:hidden flex flex-col gap-1 border-t border-gold/30 bg-white px-6 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 text-sm font-medium text-foreground/80 hover:text-royal-purple"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-2 rounded-full bg-royal-purple px-5 py-2 text-center text-sm font-medium text-white"
            onClick={() => setOpen(false)}
          >
            Get in Touch
          </Link>
        </nav>
      )}
    </header>
  );
}
