export type SignupResponse = {
  signup: {
    id: string;
    name: string;
    role: "student" | "admin";
    universityId: string;
    username: string;
  };
};

export type LoginResponse = {
  login: {
    token: string;
    role: "student" | "admin";
  };
};

export type ProjectAPI = {
  id: string;
  title: string;
  description: string;
  selectedStudents: string[];
  category: string;
  status: string;
  startDate: string;
  endDate: string;
};

export type ProjectUI = Omit<ProjectAPI, "selectedStudents"> & {
  students: string[];
  progress: number; // you may hardcode 100% or calculate later
};

export type AllProjectsResponse = {
  allProjects: ProjectAPI[];
};

export type MyProjectsResponse = {
  myProjects: ProjectAPI[];
};

export type Student = {
  id: string; // The ObjectId from MongoDB
  name: string; // Student full name
  username: string;
  universityId: string;
};

export type StudentsQueryResponse = {
  students: Student[];
};

export type Task = {
  id: string;
  projectId: string;
  projectTitle: string;
  taskName: string;
  description: string;
  assignedStudent: string;
  status: string;
  dueDate: string;
};

export type TasksQueryResponse = {
  tasks: Task[];
};

export type StudentSummary = { id: string; name: string };
export type ProjectSummary = { id: string; title: string };

export interface TaskAPI {
  id: string;
  taskName: string;
  description: string;
  assignedStudent: string;
  assignedStudentDetails: StudentSummary[]; // ✅ added
  status: string;
  dueDate: string;
}
export interface TasksByProjectResponse {
  tasksByProject: TaskAPI[];
}

export interface ProjectByIdResponse {
  projectById: {
    id: string;
    title: string;
    description: string;
    status: string;
    category: string;
    startDate: string;
    endDate: string;
    selectedStudents: string[];
  };
}

export interface Me {
  id: string;
  username: string;
  name: string;
  role: "admin" | "student";
  universityId: string;
  phone?: string;
  department?: string;
  bio?: string;
}
export interface MeResponse {
  me: Me;
}
