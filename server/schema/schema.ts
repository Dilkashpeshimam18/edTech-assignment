import { gql } from 'graphql-tag';

export const typeDefs = gql`
  enum Role {
    STUDENT
    PROFESSOR
  }

  enum CourseLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }

  type Course {
    id: ID!
    title: String!
    description: String!
    level: CourseLevel!
    enrollments: [Enrollment!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: Role!
    enrollments: [Enrollment!]!
  }

  type Enrollment {
    id: ID!
    user: User!
    course: Course!
    role: Role!
  }

  type Query {
    courses: [Course!]!
    course(id: ID!): Course
    login(email: String!): User
  }

  type Mutation {
    enroll(userId: ID!, courseId: ID!, role: Role!): Enrollment!
    editCourse(id: ID!, title: String, description: String, level: CourseLevel, userId: ID!): Course
  }
`;
