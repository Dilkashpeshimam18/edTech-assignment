// src/utils/graphql.ts
import { User } from "../types/types";

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/graphql";

export async function graphqlFetch<T>(
  query: string,
  variables: Record<string, any> = {},
  user?: User
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (user) {
    headers["x-user-id"] = user.id;
    headers["x-user-name"] = user.name;
    headers["x-user-email"] = user.email;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Network error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors) {
    const message = json.errors.map((e: any) => e.message || JSON.stringify(e)).join("; ");
    throw new Error(`GraphQL error: ${message}`);
  }

  return json.data as T;
}
