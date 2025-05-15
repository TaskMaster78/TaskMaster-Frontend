"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { projectsData, studentsData, tasksData } from "@/lib/data"

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskId?: string | null
}

export function AddTaskDialog({ open, onOpenChange, taskId }: AddTaskDialogProps) {
  const [formData, setFormData] = useState({
    project: "",
    name: "",
    description: "",
    assignedStudent: "",
    status: "In Progress",
    dueDate: "",
  })

  useEffect(() => {
    if (taskId) {
      const task = tasksData.find((t) => t.id === taskId)
      if (task) {
        setFormData({
          project: task.project,
          name: task.name,
          description: task.description,
          assignedStudent: task.assignedStudent,
          status: task.status,
          dueDate: task.dueDate,
        })
      }
    } else {
      // Reset form for new task
      setFormData({
        project: "",
        name: "",
        description: "",
        assignedStudent: "",
        status: "In Progress",
        dueDate: "",
      })
    }
  }, [taskId, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save the task here
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-500">
            {taskId ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project" className="text-zinc-300">
              Project Title:
            </Label>
            <Select value={formData.project} onValueChange={(value) => setFormData({ ...formData, project: value })}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                {projectsData.map((project) => (
                  <SelectItem key={project.id} value={project.title}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-300">
              Task Name:
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-300">
              Description:
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedStudent" className="text-zinc-300">
              Assigned Student:
            </Label>
            <Select
              value={formData.assignedStudent}
              onValueChange={(value) => setFormData({ ...formData, assignedStudent: value })}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                {studentsData.map((student) => (
                  <SelectItem key={student.id} value={student.name}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-zinc-300">
              Status:
            </Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-zinc-300">
              Due Date:
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            {taskId ? "Update Task" : "Add Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
