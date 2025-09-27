"use client";

import { useState } from "react";
import {
  Leaf,
  Home,
  BarChart2,
  CheckSquare,
  Menu,
  X,
} from "lucide-react";
import UserDropdown from "@/components/header/UserDropdown";
import Link from "next/link";
import "../globals.css";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/petani/dashboard", icon: Home, key: "dashboard" },
    { name: "Nilai", href: "/petani/nilai", icon: BarChart2, key: "nilai" },
    { name: "Hasil", href: "/petani/hasil", icon: CheckSquare, key: "hasil" },
  ];

  return (
    <div className="min-h-screen xl:flex">
      <div className="flex-1 transition-all duration-300 ease-in-out">
        {/* Header */}
        <header className="sticky top-0 flex w-full bg-white border-gray-200 z-40 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
          <div className="flex items-center justify-between w-full px-4 py-3 lg:px-6">
            {/* Left: Mobile Menu Button */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>

              {/* Logo */}
              <div className="hidden sm:block">
              <div className="flex items-center space-x-3 ">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-xl">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <div className="">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    EcoDesa
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Desa Sidomukti
                  </p>
                </div>
              </div>
              </div>
            </div>

            {/* Middle (Desktop Nav) */}
            <nav className="hidden lg:flex space-x-6">
              {navItems.map(({ name, href, icon: Icon, key }) => (
                <Link
                  key={key}
                  href={href}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center space-x-1 transition-colors ${
                    activeTab === key
                      ? "text-emerald-600 font-semibold"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{name}</span>
                </Link>
              ))}
            </nav>

            {/* Right: User Dropdown */}
            <UserDropdown />
          </div>
        </header>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 space-y-2">
            {navItems.map(({ name, href, icon: Icon, key }) => (
              <Link
                key={key}
                href={href}
                onClick={() => {
                  setActiveTab(key);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 py-2 rounded-md transition-colors ${
                  activeTab === key
                    ? "text-emerald-600 font-semibold"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{name}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Page Content */}
        <main className="mx-auto">{children}</main>
      </div>
    </div>
  );
}
