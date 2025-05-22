import { gql } from "graphql-request";

export const SIGNUP_MUTATION = gql`
  mutation Signup(
    $username: String!
    $password: String!
    $role: Role
    $name: String!
    $universityId: String!
  ) {
    signup(
      username: $username
      password: $password
      role: $role
      name: $name
      universityId: $universityId
    ) {
      id
      username
      role
      name
      universityId
    }
  }
`;
export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      role
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $title: String!
    $description: String
    $category: String
    $status: String
    $startDate: String
    $endDate: String
    $selectedStudents: [String]
  ) {
    createProject(
      title: $title
      description: $description
      category: $category
      status: $status
      startDate: $startDate
      endDate: $endDate
      selectedStudents: $selectedStudents
    ) {
      id
      title
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask(
    $projectId: String!
    $projectTitle: String!
    $taskName: String!
    $description: String
    $assignedStudent: String!
    $status: String
    $dueDate: String
  ) {
    createTask(
      projectId: $projectId
      projectTitle: $projectTitle
      taskName: $taskName
      description: $description
      assignedStudent: $assignedStudent
      status: $status
      dueDate: $dueDate
    ) {
      id
      projectId
      projectTitle
      taskName
      description
      assignedStudent
      status
      dueDate
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: String!
    $projectId: String
    $projectTitle: String
    $taskName: String
    $description: String
    $assignedStudent: String
    $status: String
    $dueDate: String
  ) {
    updateTask(
      id: $id
      projectId: $projectId
      projectTitle: $projectTitle
      taskName: $taskName
      description: $description
      assignedStudent: $assignedStudent
      status: $status
      dueDate: $dueDate
    ) {
      id
      taskName
      status
    }
  }
`;
