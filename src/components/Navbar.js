"use client";
import Link from "next/link";

import { useRouter } from "next/navigation";
const Navbar = () => {
  const router = useRouter();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <nav className="bg-black text-white px-6 py-4">
      <div className="flex items-center justify-between">
        <Link legacyBehavior href="/">
          <a className="text-2xl font-bold text-white">QR</a>
        </Link>
        <div className="flex space-x-4">
          {navItems.map((item) => (
            <Link legacyBehavior key={item.name} href={item.href}>
              <a
                className={`text-lg text-white hover:text-gray-300 transition-all duration-200 ${
                  router.pathname === item.href && "underline"
                }`}
              >
                {item.name}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
