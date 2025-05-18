"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

interface StatItem {
  title: string;
  value: number;
}

interface DashboardChartProps {
  stats: StatItem[];
}

export function DashboardChart({ stats }: DashboardChartProps) {
  // Convert to chart-friendly format
  const chartData = stats.map((stat) => ({
    name: stat.title.replace("Number of ", ""),
    count: stat.value
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <XAxis
            dataKey="name"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "6px",
              color: "#e4e4e7"
            }}
            labelStyle={{ fontWeight: "bold", color: "#3b82f6" }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
