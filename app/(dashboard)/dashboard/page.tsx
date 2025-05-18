"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardChart } from "@/components/dashboard-chart";
import { getGraphqlClient } from "@/lib/graphqlClient";
import { useEffect, useState } from "react";
import { DASHBOARD_STATS_QUERY } from "@/lib/queries";

type DashboardStatsResponse = {
  dashboardStats: {
    totalProjects: number;
    totalStudents: number;
    totalTasks: number;
    finishedProjects: number;
  };
};

export default function DashboardPage() {
  const [stats, setStats] = useState([
    { title: "Number of Projects", value: 0 },
    { title: "Number of Students", value: 0 },
    { title: "Number of Tasks", value: 0 },
    { title: "Number of Finished Projects", value: 0 }
  ]);

  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getGraphqlClient().request<DashboardStatsResponse>(
          DASHBOARD_STATS_QUERY
        );
        const { totalProjects, totalStudents, totalTasks, finishedProjects } =
          data.dashboardStats;

        setStats([
          { title: "Number of Projects", value: totalProjects },
          { title: "Number of Students", value: totalStudents },
          { title: "Number of Tasks", value: totalTasks },
          { title: "Number of Finished Projects", value: finishedProjects }
        ]);
      } catch (err) {
        console.error("❌ Failed to fetch dashboard stats", err);
      }
    };

    fetchStats();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

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
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-zinc-400"
        >
          {currentTime}
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
                <CardTitle className="text-center text-zinc-400 text-sm">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-center text-white">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-400 text-lg">
              Admin Dashboard Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <DashboardChart stats={stats} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
