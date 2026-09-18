"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/meetings", label: "Meetings" },
  { href: "/meetings/current", label: "This Week" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex space-x-4">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "text-white font-bold underline"
                  : "hover:text-gray-400"
              }
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}