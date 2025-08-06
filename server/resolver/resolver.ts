import { PrismaClient, Role } from '@prisma/client';

export function createResolvers(prisma: PrismaClient) {
  type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

  return {
    Query: {
      courses: () => prisma.course.findMany(),
      course: (_: any, args: { id: string }) => prisma.course.findUnique({ where: { id: args.id } }),
      login: async (_: any, { email }: { email: string }) => {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error('User not found');
        return user;
      },
    },
    Mutation: {
      enroll: async (_: any, args: { userId: string; courseId: string; role: Role }) => {
        const user = await prisma.user.findUnique({
          where: { id: args.userId },
        });

        if (!user) {
          throw new Error(`User with id "${args.userId}" not found`);
        }

        const course = await prisma.course.findUnique({
          where: { id: args.courseId },
        });

        if (!course) {
          throw new Error(`Course with id "${args.courseId}" not found`);
        }

        const existingEnrollment = await prisma.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId: user.id,
              courseId: args.courseId,
            },
          },
        });

        if (existingEnrollment) {
          throw new Error('User is already enrolled in this course');
        }

        return prisma.enrollment.create({
          data: {
            user: { connect: { id: user.id } },
            course: { connect: { id: args.courseId } },
            role: args.role,
          },
        });
      },
      editCourse: async (
        _: any,
        args: {
          id: string;
          title?: string;
          description?: string;
          level?: CourseLevel;
          userId: string;
        }
      ) => {
        const user = await prisma.user.findUnique({
          where: { id: args.userId },
        });

        if (user?.role !== 'PROFESSOR') {
          throw new Error('Only professors can edit courses.');
        }

        const updatedCourse = await prisma.course.update({
          where: { id: args.id },
          data: {
            title: args.title,
            description: args.description,
            level: args.level,
          },
        });

        return updatedCourse;
      },
    },
    Course: {
      enrollments: (parent: any) => prisma.enrollment.findMany({ where: { courseId: parent.id } }),
    },
    User: {
      enrollments: (parent: any) => prisma.enrollment.findMany({ where: { userId: parent.id } }),
      role: (parent: any) => parent.role,
    },
    Enrollment: {
      user: (parent: any) => prisma.user.findUnique({ where: { id: parent.userId } }),
      course: (parent: any) => prisma.course.findUnique({ where: { id: parent.courseId } }),
    },
  };
}
