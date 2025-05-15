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
