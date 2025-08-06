import { PrismaClient, Role, CourseLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'student@gmail.com' },
    update: {},
    create: { name: 'Student1', email: 'student@gmail.com', role: 'STUDENT' },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'professor@gmail.com' },
    update: {},
    create: { name: 'Professor1', email: 'professor@gmail.com', role: 'PROFESSOR' },
  });

  const course1 = await prisma.course.upsert({
    where: { title: 'Intro to TypeScript' },
    update: {},
    create: {
      title: 'Intro to TypeScript',
      description: 'Learn the basics of TypeScript.',
      level: CourseLevel.BEGINNER,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { title: 'Advanced GraphQL' },
    update: {},
    create: {
      title: 'Advanced GraphQL',
      description: 'Deep dive into GraphQL.',
      level: CourseLevel.ADVANCED,
    },
  });
  const course3 = await prisma.course.upsert({
    where: { title: 'React for Beginners' },
    update: {},
    create: {
      title: 'React for Beginners',
      description: 'Get started with React and build interactive UIs.',
      level: CourseLevel.BEGINNER,
    },
  });

  const course4 = await prisma.course.upsert({
    where: { title: 'Node.js Fundamentals' },
    update: {},
    create: {
      title: 'Node.js Fundamentals',
      description: 'Understand the basics of Node.js for backend development.',
      level: CourseLevel.BEGINNER,
    },
  });

  const course5 = await prisma.course.upsert({
    where: { title: 'Database Design Principles' },
    update: {},
    create: {
      title: 'Database Design Principles',
      description: 'Learn how to design scalable and efficient databases.',
      level: CourseLevel.INTERMEDIATE,
    },
  });

  const course6 = await prisma.course.upsert({
    where: { title: 'Docker Essentials' },
    update: {},
    create: {
      title: 'Docker Essentials',
      description: 'Introduction to containerization using Docker.',
      level: CourseLevel.INTERMEDIATE,
    },
  });

  const course7 = await prisma.course.upsert({
    where: { title: 'GraphQL with Apollo Server' },
    update: {},
    create: {
      title: 'GraphQL with Apollo Server',
      description: 'Build GraphQL APIs using Apollo Server and Prisma.',
      level: CourseLevel.INTERMEDIATE,
    },
  });

  const course8 = await prisma.course.upsert({
    where: { title: 'Advanced TypeScript' },
    update: {},
    create: {
      title: 'Advanced TypeScript',
      description: 'Explore advanced concepts in TypeScript for large applications.',
      level: CourseLevel.ADVANCED,
    },
  });

  const course9 = await prisma.course.upsert({
    where: { title: 'Testing with Jest' },
    update: {},
    create: {
      title: 'Testing with Jest',
      description: 'Learn how to write unit and integration tests with Jest.',
      level: CourseLevel.INTERMEDIATE,
    },
  });

  const course10 = await prisma.course.upsert({
    where: { title: 'CI/CD with GitHub Actions' },
    update: {},
    create: {
      title: 'CI/CD with GitHub Actions',
      description: 'Set up continuous integration and delivery pipelines.',
      level: CourseLevel.ADVANCED,
    },
  });

  const course11 = await prisma.course.upsert({
    where: { title: 'Next.js Fullstack Development' },
    update: {},
    create: {
      title: 'Next.js Fullstack Development',
      description: 'Build fullstack applications using Next.js and API routes.',
      level: CourseLevel.ADVANCED,
    },
  });

  const course12 = await prisma.course.upsert({
    where: { title: 'Authentication in Web Apps' },
    update: {},
    create: {
      title: 'Authentication in Web Apps',
      description: 'Implement secure authentication and authorization in web apps.',
      level: CourseLevel.INTERMEDIATE,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: alice.id,
        courseId: course1.id,
      },
    },
    update: { role: Role.PROFESSOR },
    create: {
      userId: alice.id,
      courseId: course1.id,
      role: Role.PROFESSOR,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: bob.id,
        courseId: course1.id,
      },
    },
    update: { role: Role.STUDENT },
    create: {
      userId: bob.id,
      courseId: course1.id,
      role: Role.STUDENT,
    },
  });

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
