"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { Badge } from "@/components/ui/badge"
import { tasksData } from "@/lib/data"

export default function TasksPage() {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("Task Status")

  const getSortedTasks = () => {
    return [...tasksData].sort((a, b) => {
      switch (sortBy) {
        case "Task Status":
          return a.status.localeCompare(b.status)
        case "Project":
          return a.project.localeCompare(b.project)
        case "Due Date":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case "Assigned Student":
          return a.assignedStudent.localeCompare(b.assignedStudent)
        default:
          return 0
      }
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-green-900 text-green-300"
      case "Completed":
        return "bg-blue-900 text-blue-300"
      case "Pending":
        return "bg-amber-900 text-amber-300"
      default:
        return "bg-zinc-800 text-zinc-300"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
          <span className="text-zinc-400">Sort By:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700 text-white">
              <SelectValue placeholder="Task Status" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
              <SelectItem value="Task Status">Task Status</SelectItem>
              <SelectItem value="Project">Project</SelectItem>
              <SelectItem value="Due Date">Due Date</SelectItem>
              <SelectItem value="Assigned Student">Assigned Student</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Button
            onClick={() => {
              setEditingTask(null)
              setIsAddTaskOpen(true)
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create a New Task
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-md border border-zinc-800 overflow-hidden"
      >
        <Table>
          <TableHeader className="bg-zinc-900">
            <TableRow className="hover:bg-zinc-900/80 border-zinc-800">
              <TableHead className="text-zinc-400 w-[80px]">Task ID</TableHead>
              <TableHead className="text-zinc-400">Project</TableHead>
              <TableHead className="text-zinc-400">Task Name</TableHead>
              <TableHead className="text-zinc-400 hidden md:table-cell">Description</TableHead>
              <TableHead className="text-zinc-400">Assigned Student</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getSortedTasks().map((task) => (
              <TableRow
                key={task.id}
                className="hover:bg-zinc-800/50 border-zinc-800 cursor-pointer"
                onClick={() => {
                  setEditingTask(task.id)
                  setIsAddTaskOpen(true)
                }}
              >
                <TableCell className="font-medium">{task.id}</TableCell>
                <TableCell>{task.project}</TableCell>
                <TableCell>{task.name}</TableCell>
                <TableCell className="hidden md:table-cell">{task.description}</TableCell>
                <TableCell>{task.assignedStudent}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                </TableCell>
                <TableCell>{task.dueDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      <AddTaskDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen} taskId={editingTask} />
    </div>
  )
}
