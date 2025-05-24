import { GraphQLClient } from "graphql-request";

const endpoint = process.env.NEXT_PUBLIC_API_URL! as string;

export const getGraphqlClient = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return new GraphQLClient(endpoint, {
    headers: {
      Authorization: token ? `Bearer ${token}` : ""
    }
  });
};
