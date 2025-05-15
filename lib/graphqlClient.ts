import { GraphQLClient } from "graphql-request";

const endpoint = "http://localhost:4000/graphql";

export const getGraphqlClient = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return new GraphQLClient(endpoint, {
    headers: {
      Authorization: token ? `Bearer ${token}` : ""
    }
  });
};
