import { gql } from "graphql-request";

export const TASKS_QUERY = gql`
  query {
    tasks {
      id
      projectTitle
      projectId
      taskName
      description
      assignedStudent
      status
      dueDate
      createdAt
      updatedAt
    }
  }
`;

export const STUDENTS_QUERY = gql`
  query {
    students {
      id
      name
    }
  }
`;

export const getProjectsQuery = (role: "admin" | "student") => gql`
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
