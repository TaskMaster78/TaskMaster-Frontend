"use client"
import { motion } from "framer-motion"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { name: "Projects", count: 5, color: "#2A4858" },
  { name: "Students", count: 20, color: "#1E5C8D" },
  { name: "Tasks", count: 10, color: "#6D5A31" },
  { name: "Finished Projects", count: 2, color: "#3D2A58" },
]

export function DashboardChart() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "6px",
              color: "#e4e4e7",
            }}
            labelStyle={{ fontWeight: "bold", color: "#3b82f6" }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
