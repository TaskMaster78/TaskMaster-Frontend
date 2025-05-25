"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProjectAPI, ProjectUI, TaskAPI } from "@/@types/types";
import { useEffect, useState } from "react";
import { getGraphqlClient } from "@/lib/graphqlClient";
import { TASKS_BY_PROJECT_QUERY } from "@/lib/queries";

interface ProjectCardProps {
  project: ProjectAPI;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const projectUi: ProjectUI = {
    ...project,
    students: project.selectedStudents,
    progress: 100
  };
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fetchProjectTasks = async () => {
      if (!projectUi.id) return;
      try {
        const res: { tasksByProject: TaskAPI[] } =
          await getGraphqlClient().request(TASKS_BY_PROJECT_QUERY, {
            projectId: projectUi.id
          });

        const tasks = res.tasksByProject;

        const completedCount = tasks.filter(
          (t) => t.status === "Completed"
        ).length;
        const progressPercent =
          tasks.length > 0
            ? Math.round((completedCount / tasks.length) * 100)
            : 0;
        setProgress(progressPercent);
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };

    fetchProjectTasks();
  }, [projectUi.id]);

  const getBorderColor = () => {
    switch (project.category) {
      case "Web Development":
        return "border-gray-500";
      case "Mobile Development":
        return "border-amber-500";
      case "Data Science":
        return "border-blue-500";
      case "Machine Learning":
        return "border-purple-500";
      default:
        return "border-zinc-700";
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={`bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer ${getBorderColor()}`}
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-blue-500">
            {projectUi.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-zinc-400">Description:</p>
            <p className="text-zinc-300">{projectUi.description}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-400">Students:</p>
            <p className="text-zinc-300">{projectUi.students.join(", ")}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-400">Category:</p>
            <p className="text-zinc-300">{projectUi.category}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Progress</span>
              <span className="text-zinc-300">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex justify-between text-xs text-zinc-500">
            <span>{projectUi.startDate}</span>
            <span>{projectUi.endDate}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
