import { GraphQLClient } from "graphql-request";

export const graphqlClient = new GraphQLClient(
  "http://localhost:4000/graphql",
  {
    // Use a function to allow dynamic token retrieval
    headers: () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      return {
        Authorization: token ? `Bearer ${token}` : ""
      };
    }
  }
);
