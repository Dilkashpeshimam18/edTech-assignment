export type User = {
  id: string;
  name: string;
  email: string;
} | null;

export type Enrollment = {
  courseId: string;
  role: "STUDENT" | "PROFESSOR";
};

export type Course = {
  id: string;
  title: string;
  description: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
};
