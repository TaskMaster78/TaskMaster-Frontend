"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  FolderKanban,
  CheckSquare,
  MessageSquare,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/chat", label: "Chat", icon: MessageSquare }
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Mobile Trigger Button - Only visible on small screens */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-3 left-3 z-50 md:hidden bg-zinc-800 hover:bg-zinc-700 text-white"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </Button>

      {/* Desktop Sidebar - Hidden on mobile */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-64 bg-zinc-900 border-r border-zinc-800 hidden md:block"
      >
        <SidebarContent pathname={pathname} />
      </motion.aside>

      {/* Mobile Sidebar with Overlay - Only for small screens */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Dark overlay behind the sidebar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-zinc-900 border-r border-zinc-800 z-50 md:hidden"
            >
              <div className="flex justify-end p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileOpen(false)}
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </Button>
              </div>
              <SidebarContent pathname={pathname} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Extracted sidebar content to avoid duplication
function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <nav className="p-4 space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
