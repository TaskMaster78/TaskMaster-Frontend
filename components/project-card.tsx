"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Project } from "@/lib/types"

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const getBorderColor = () => {
    switch (project.category) {
      case "Web Development":
        return "border-gray-500"
      case "Mobile Development":
        return "border-amber-500"
      case "Data Science":
        return "border-blue-500"
      case "Machine Learning":
        return "border-purple-500"
      default:
        return "border-zinc-700"
    }
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={`bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer ${getBorderColor()}`}
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-blue-500">{project.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-zinc-400">Description:</p>
            <p className="text-zinc-300">{project.description}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-400">Students:</p>
            <p className="text-zinc-300">{project.students.join(", ")}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-400">Category:</p>
            <p className="text-zinc-300">{project.category}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Progress</span>
              <span className="text-zinc-300">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          <div className="flex justify-between text-xs text-zinc-500">
            <span>{project.startDate}</span>
            <span>{project.endDate}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
