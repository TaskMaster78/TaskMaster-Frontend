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

export const TASKS_BY_PROJECT_QUERY = gql`
  query TasksByProject($projectId: String!) {
    tasksByProject(projectId: $projectId) {
      id
      taskName
      description
      assignedStudent
      assignedStudentDetails {
        id
        name
      }
      status
      dueDate
    }
  }
`;

export const PROJECT_BY_ID_QUERY = gql`
  query ProjectById($id: String!) {
    projectById(id: $id) {
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

export const GET_OTHER_USERS = gql`
  query GetOtherUsers {
    otherUsers {
      id
      name
      role
    }
  }
`;

export const DASHBOARD_STATS_QUERY = gql`
  query DashboardStats {
    dashboardStats {
      totalProjects
      totalStudents
      totalTasks
      finishedProjects
    }
  }
`;
