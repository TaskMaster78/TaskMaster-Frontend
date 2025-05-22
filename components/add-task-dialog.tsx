"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

import { CREATE_TASK, UPDATE_TASK } from "@/lib/mutations";
import { getProjectsQuery, STUDENTS_QUERY } from "@/lib/queries";
import { toast } from "sonner";
import { ProjectSummary, StudentSummary, Task } from "@/@types/types";
import { useAuth } from "@/context/AuthContext";
import { getGraphqlClient } from "@/lib/graphqlClient";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId?: string | null;
  existingTask?: any;
  onTaskAdd: (task: Task) => void;
}

export default function AddTaskDialog({
  open,
  onOpenChange,
  taskId,
  existingTask,
  onTaskAdd
}: AddTaskDialogProps) {
  const [formData, setFormData] = useState({
    projectId: "",
    projectTitle: "",
    taskName: "",
    description: "",
    assignedStudent: "",
    status: "In Progress",
    dueDate: ""
  });

  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);
  const { role } = useAuth();

  useEffect(() => {
    if (existingTask && taskId) {
      setFormData({
        projectId: existingTask.projectId,
        projectTitle: existingTask.projectTitle,
        taskName: existingTask.taskName,
        description: existingTask.description,
        assignedStudent: existingTask.assignedStudent,
        status: existingTask.status,
        dueDate: existingTask.dueDate.split("T")[0]
      });
    } else {
      setFormData({
        projectId: "",
        projectTitle: "",
        taskName: "",
        description: "",
        assignedStudent: "",
        status: "In Progress",
        dueDate: ""
      });
    }
  }, [taskId, existingTask]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentData = await getGraphqlClient().request<{
          students: StudentSummary[];
        }>(STUDENTS_QUERY);

        const projectData = await getGraphqlClient().request<{
          myProjects?: ProjectSummary[];
          allProjects?: ProjectSummary[];
        }>(getProjectsQuery(role || "student"));

        setStudents(studentData.students);
        setProjects(projectData.myProjects || projectData.allProjects || []);
      } catch (err) {
        console.error("Error fetching students/projects:", err);
      }
    };

    fetchData();
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const variables = {
      projectId: formData.projectId,
      projectTitle: formData.projectTitle,
      taskName: formData.taskName,
      description: formData.description,
      assignedStudent: formData.assignedStudent,
      status: formData.status,
      dueDate: formData.dueDate
    };

    try {
      if (taskId) {
        const { updateTask } = await getGraphqlClient().request<{
          updateTask: Task;
        }>(UPDATE_TASK, { id: taskId, ...variables });

        onTaskAdd(updateTask); // This will update the task in state correctly
        toast.success("Task updated successfully!");
      } else {
        const { createTask } = await getGraphqlClient().request<{
          createTask: Task;
        }>(CREATE_TASK, variables);

        onTaskAdd(createTask); // ✅ Add the persisted task
        toast.success("Task created successfully!");
      }

      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save task");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-500">
            {taskId ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-80px)] px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Project</Label>
              <Select
                value={formData.projectId}
                onValueChange={(id) => {
                  const title = projects.find((p) => p.id === id)?.title || "";
                  setFormData((prev) => ({
                    ...prev,
                    projectId: id,
                    projectTitle: title
                  }));
                }}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Task Name</Label>
              <Input
                value={formData.taskName}
                onChange={(e) =>
                  setFormData({ ...formData, taskName: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Assigned Student</Label>
              <Select
                value={formData.assignedStudent}
                onValueChange={(value) =>
                  setFormData({ ...formData, assignedStudent: value })
                }
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
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
              <Label>Due Date</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {taskId ? "Update Task" : "Add Task"}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
