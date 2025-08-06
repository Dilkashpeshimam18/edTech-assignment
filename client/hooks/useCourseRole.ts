import { useAuth } from '../context/AuthContext';
import { useEnrollment } from '../context/EnrollmentContext';

export function useCourseRole(courseId: string | undefined) {
  const { user } = useAuth();
  const { getEnrollmentForCourse } = useEnrollment();

  const enrollment = courseId && user ? getEnrollmentForCourse(courseId) : undefined;
  return {
    role: enrollment?.role as 'STUDENT' | 'PROFESSOR' | undefined,
    isStudent: enrollment?.role === 'STUDENT',
    isProfessor: enrollment?.role === 'PROFESSOR',
  };
}
