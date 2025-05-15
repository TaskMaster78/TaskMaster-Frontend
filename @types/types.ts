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
