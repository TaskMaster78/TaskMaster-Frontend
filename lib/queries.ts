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
