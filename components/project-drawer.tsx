"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";
import { PROJECT_BY_ID_QUERY, TASKS_BY_PROJECT_QUERY } from "@/lib/queries";
import { getGraphqlClient } from "@/lib/graphqlClient";
import { ProjectByIdResponse, TaskAPI } from "@/@types/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";

interface ProjectDrawerProps {
  projectId: string | null;
  open: boolean;
  onClose: () => void;
  setProgress: (p: number) => void;
}

export function ProjectDrawer({
  projectId,
  open,
  onClose,
  setProgress
}: ProjectDrawerProps) {
  const [projectTasks, setProjectTasks] = useState<TaskAPI[]>([]);
  const [projectProgress, setProjectProgress] = useState(0);

  useEffect(() => {
    const fetchProjectTasks = async () => {
      if (!projectId) return;
      try {
        const res: { tasksByProject: TaskAPI[] } =
          await getGraphqlClient().request(TASKS_BY_PROJECT_QUERY, {
            projectId
          });

        const tasks = res.tasksByProject;
        setProjectTasks(tasks);

        const completedCount = tasks.filter(
          (t) => t.status === "Completed"
        ).length;
        const progressPercent =
          tasks.length > 0
            ? Math.round((completedCount / tasks.length) * 100)
            : 0;
        setProjectProgress(progressPercent);
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };

    fetchProjectTasks();
  }, [projectId]);

  useEffect(() => {
    setProgress(projectProgress);
  }, [projectProgress]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-green-900 text-green-300";
      case "Completed":
        return "bg-blue-900 text-blue-300";
      case "Pending":
        return "bg-amber-900 text-amber-300";
      default:
        return "bg-zinc-800 text-zinc-300";
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-zinc-900 border-zinc-800 text-white p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="text-2xl font-bold text-blue-500">
            Project Tasks
          </SheetTitle>
        </SheetHeader>{" "}
        {projectTasks.length > 0 ? (
          projectTasks.map((task) => (
            <div key={task.id} className="h-full flex flex-col">
              <div className="flex-1 overflow-auto p-6 pt-2">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-zinc-300">Tasks</h3>

                    <AnimatePresence>
                      {projectTasks.length > 0 ? (
                        <motion.div className="space-y-3">
                          {projectTasks.map((task, index) => (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="bg-zinc-800 rounded-md p-4 space-y-2"
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-zinc-200">
                                  {task.taskName}
                                </h4>
                                <Badge className={getStatusColor(task.status)}>
                                  {task.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-zinc-400">
                                {task.description}
                              </p>
                              <div className="flex justify-between text-xs text-zinc-500">
                                <span>Assigned to: {task.assignedStudent}</span>
                                <span>Due: {task.dueDate}</span>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <p className="text-zinc-500 text-center py-4">
                          No tasks found for this project
                        </p>
                      )}
                    </AnimatePresence>
                  </div>
                  <Separator className="bg-zinc-800" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center min-h-screen">
            <p className="text-gray-400 ">No tasks found for this project</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
