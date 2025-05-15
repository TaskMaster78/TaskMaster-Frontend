import { GraphQLClient } from "graphql-request";

const endpoint = "http://localhost:4000/graphql"; // replace with your deployed URL

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    authorization:
      typeof window !== "undefined"
        ? `Bearer ${localStorage.getItem("token") || ""}`
        : ""
  }
});
