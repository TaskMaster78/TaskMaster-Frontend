"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { toast } from "sonner";
import { graphqlClient } from "@/lib/graphqlClient";
import { CREATE_PROJECT } from "@/lib/mutations";

import { Student, StudentsQueryResponse } from "@/@types/types";
import { STUDENTS_QUERY } from "@/lib/queries";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProjectDialog({
  open,
  onOpenChange
}: AddProjectDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
    status: "In Progress",
    selectedStudents: [] as string[]
  });


  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data: StudentsQueryResponse = await graphqlClient.request(
          STUDENTS_QUERY
        );
        setStudents(data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleStudentToggle = (studentId: string) => {
    setFormData((prev) => {
      const isSelected = prev.selectedStudents.includes(studentId);
      return {
        ...prev,
        selectedStudents: isSelected
          ? prev.selectedStudents.filter((id) => id !== studentId)
          : [...prev.selectedStudents, studentId]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await graphqlClient.request(CREATE_PROJECT, formData);
      toast.success("Project created successfully!");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create project.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-blue-500">
            Add New Project
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-80px)] px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-300">
                Project Title:
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-300">
                Project Description:
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700 text-white min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Students List:</Label>
              <div className="border border-zinc-700 rounded-md p-2 max-h-[200px] overflow-y-auto">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center space-x-2 py-2"
                  >
                    <Checkbox
                      id={`student-${student.id}`}
                      checked={formData.selectedStudents.includes(student.id)}
                      onCheckedChange={() => handleStudentToggle(student.id)}
                    />
                    <Label
                      htmlFor={`student-${student.id}`}
                      className="text-zinc-300 cursor-pointer"
                    >
                      {student.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-zinc-300">
                Project Category:
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectItem value="Web Development">
                    Web Development
                  </SelectItem>
                  <SelectItem value="Mobile Development">
                    Mobile Development
                  </SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Machine Learning">
                    Machine Learning
                  </SelectItem>
                  <SelectItem value="E-commerce Platform">
                    E-commerce Platform
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-zinc-300">
                Starting Date:
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-zinc-300">
                Ending Date:
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-zinc-300">
                Project Status:
              </Label>
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

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Add Project
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
