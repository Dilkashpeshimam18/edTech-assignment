'use client';

import { useRouter, useParams ,useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEnrollment } from '../../context/EnrollmentContext';

import { graphqlFetch } from '../../utils/graphql';
import { Course } from '../../types/types';
import './EnrollmentConfirm.css';
import EnrollmentConfirmation from '@/components/EnrollmentConfirmation/EnrollmentConfirmation';

type CourseQuery = {
  course: Course;
};

export default function EnrolledPage() {
  const router = useRouter();
  const params = useParams();

const searchParams = useSearchParams();
const courseId = searchParams.get('courseId');
  const { user } = useAuth();
  const { getEnrollmentForCourse } = useEnrollment();

  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const enrollment = courseId && typeof courseId === 'string' ? getEnrollmentForCourse(courseId) : undefined;

  useEffect(() => {
    if (!courseId || typeof courseId !== 'string') return;
    if (!user) {
      router.replace('/login');
      return;
    }
    graphqlFetch<CourseQuery>(
      `query ($id: ID!) { course(id: $id) { id title description level } }`,
      { id: courseId },
      user
    )
      .then((d) => setCourse(d.course))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [courseId, user, router]);

  if (!courseId) return <p className="text-red-600">No course specified.</p>;
  if (!user) return null; 
  if (loading) return <p>Loading confirmation...</p>;

  return (
    // <div className="confirmation-container">
    //   <h2 className="confirmation-title">✅ Enrollment Confirmed</h2>

    //   {error && <div className="error-msg">{error}</div>}

    //   {enrollment ? (
    //     <>
    //       <p className="confirmation-text">
    //         You are enrolled in <strong>{course?.title || courseId}</strong> as{' '}
    //         <strong>{enrollment.role.toLowerCase()}</strong>.
    //       </p>
    //       {enrollment.role === 'PROFESSOR' && (
    //         <p className="extra-info">
    //           You can edit this course via the course detail page.
    //         </p>
    //       )}
    //       <div className="confirmation-button">
    //         <button
    //           onClick={() => router.push(`/course-details/${courseId}`)}
    //           className="goback-button"
    //         >
    //           Go to Course
    //         </button>
    //         <button
    //           onClick={() => router.push('/')}
    //           className="browse-button"
    //         >
    //           Browse More
    //         </button>
    //       </div>
    //     </>
    //   ) : (
    //     <p className="error-msg">
    //       Enrollment not found for course {courseId}.
    //     </p>
    //   )}
    // </div>
    <EnrollmentConfirmation />
  );
}
