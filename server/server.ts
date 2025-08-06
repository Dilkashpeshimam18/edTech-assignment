import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@as-integrations/express5';
import { PrismaClient } from "@prisma/client";
import { typeDefs } from "./schema/schema";
import { createResolvers } from "./resolver/resolver";

const prisma = new PrismaClient();

async function start() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers: createResolvers(prisma),
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const user = {
          id: (req.headers["x-user-id"] as string) || null,
          name: (req.headers["x-user-name"] as string) || null,
          email: (req.headers["x-user-email"] as string) || null,
        };
        return { prisma, user };
      },
    })
  );

  app.listen(4000, () => {
    console.log("🚀 GraphQL server running at http://localhost:4000/graphql");
  });
}

start();
