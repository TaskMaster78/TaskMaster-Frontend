"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ProjectCard } from "@/components/project-card";
import { AddProjectDialog } from "@/components/add-project-dialog";
import { ProjectDrawer } from "@/components/project-drawer";
import { Search } from "lucide-react";
import type {
  AllProjectsResponse,
  MyProjectsResponse,
  ProjectAPI
} from "@/@types/types";

import { useAuth } from "@/context/AuthContext";

import { gql } from "graphql-request";
import { getGraphqlClient } from "@/lib/graphqlClient";

export default function ProjectsPage() {
  const { role, userId } = useAuth();
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<ProjectAPI[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredProjects = projects.filter((project) => {
    const matchesStatus =
      statusFilter === "All Statuses" || project.status === statusFilter;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);

      const query = gql`
        query {
          ${role === "admin" ? "allProjects" : "myProjects"} {
            id
            title
            description
            status
            category
            startDate
            endDate
            selectedStudents
          }
        }
      `;

      try {
        if (role === "admin") {
          const data: AllProjectsResponse = await getGraphqlClient().request(
            query
          );
          setProjects(data.allProjects);
        } else {
          const data: MyProjectsResponse = await getGraphqlClient().request(
            query
          );
          setProjects(data.myProjects);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    if (role) {
      fetchProjects();
    }
  }, [role]);

  return (
    <div className="p-6 space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-blue-500"
      >
        Projects Overview
      </motion.h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {role === "admin" && (
            <Button
              onClick={() => setIsAddProjectOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add New Project
            </Button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-1 gap-4"
        >
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
              size={18}
            />
            <Input
              placeholder="Search projects by title or description..."
              className="pl-10 bg-zinc-800 border-zinc-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700 text-white">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
              <SelectItem value="All Statuses">All Statuses</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProjectCard
                  project={project}
                  onClick={() => setSelectedProject(project.id)}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center w-full min-h-[50vh]">
              <div className="flex items-center justify-center w-full max-w-md h-40 text-zinc-500 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <div className="text-center">
                  <p className="text-lg font-medium">
                    No projects available to display
                  </p>
                  <p className="text-sm">Create a new project to get started</p>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      <AddProjectDialog
        open={isAddProjectOpen}
        onOpenChange={setIsAddProjectOpen}
      />

      <ProjectDrawer
        projectId={selectedProject}
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
