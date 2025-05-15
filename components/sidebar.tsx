"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, FolderKanban, CheckSquare, MessageSquare } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/chat", label: "Chat", icon: MessageSquare },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-zinc-900 border-r border-zinc-800 hidden md:block"
    >
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </motion.aside>
  )
}
