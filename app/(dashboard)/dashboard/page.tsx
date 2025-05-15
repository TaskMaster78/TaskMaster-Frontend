"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardChart } from "@/components/dashboard-chart"

export default function DashboardPage() {
  const currentDate = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  const stats = [
    { title: "Number of Projects", value: 5 },
    { title: "Number of Students", value: 20 },
    { title: "Number of Tasks", value: 10 },
    { title: "Number of Finished Projects", value: 2 },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-blue-500"
        >
          Welcome to the Task Management System
        </motion.h1>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-zinc-400">
          {currentDate}
        </motion.div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={item}>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-zinc-400 text-sm">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-center text-white">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-400 text-lg">Admin Dashboard Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <DashboardChart />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
