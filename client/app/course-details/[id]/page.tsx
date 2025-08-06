'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useEnrollment } from '../../../context/EnrollmentContext';

import { graphqlFetch } from '../../../utils/graphql';
import { Course } from '../../../types/types';
import { useCourseRole } from '../../../hooks/useCourseRole';
import '../CourseDetail.css';

type CourseQuery = {
  course: Course;
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId; // normalize to string | undefined
  const { user } = useAuth();
  const { getEnrollmentForCourse, addEnrollment } = useEnrollment();
  const { role } = useCourseRole(id);
  const isGloballyProfessor = user?.role === 'PROFESSOR';

  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const enrollment = typeof id === 'string' ? getEnrollmentForCourse(id) : undefined;

  useEffect(() => {
    if (!id || typeof id !== 'string') return;
    if (!user) {
      router.replace('/login');
      return;
    }

    setLoading(true);
    graphqlFetch<CourseQuery>(`query ($id: ID!) { course(id: $id) { id title description level } }`, { id }, user)
      .then((d) => setCourse(d.course))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [id, user, router]);

  const handleEnroll = async (role: 'STUDENT' | 'PROFESSOR') => {
    if (!user || !course) return;
    const mutation = `
      mutation Enroll($userId: ID!, $courseId: ID!, $role: Role!) {
        enroll(userId: $userId, courseId: $courseId, role: $role) {
          id
          role
        }
      }
    `;
    try {
      await graphqlFetch(mutation, { userId: user.id, courseId: course.id, role }, user);
      addEnrollment({ courseId: course.id, role });
      router.push(`/enrollment-confirmation?courseId=${course.id}`);
    } catch (e) {
      setError(String(e));
    }
  };

  if (loading) return <p>Loading course...</p>;
  if (!course) return <p className="text-red-600">Course not found.</p>;

  return (
    <div className="course-detail-container">
      <div className="course-left">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 className="course-title">{course.title}</h2>

          {isGloballyProfessor && (
            <button className="edit-button" onClick={() => router.push(`/edit-course/${course.id}`)}>
              ✏️ Edit Course
            </button>
          )}
        </div>
        <p className="course-sub">By Instructor | {course.level} Level</p>
        <p className="course-description">{course.description}</p>

        <h3 className="section-title">What you'll learn</h3>
        <ul className="course-points">
          <li>Learn to produce initial sketches for ideation</li>
          <li>Create storyboards to support the concept</li>
          <li>Develop engaging UI mockups</li>
          <li>Run design walkthroughs to test usability</li>
        </ul>

        {role && (
          <p className="info-box">
            You are enrolled as <strong>{role.toLowerCase()}</strong>.
          </p>
        )}
        {error && (
          <p className="info-box" style={{ color: 'red' }}>
            {error}
          </p>
        )}
      </div>

      <div className="course-right">
        <div className="info-box">👥 146 learners</div>
        <div className="info-box">💵 $120</div>
        <div className="info-box">📆 3 weeks</div>
        <div className="info-box">🕒 3-4 hours/week</div>
        <div className="info-box">📊 Level: {course.level}</div>
        <div className="info-box">🌍 Indonesia</div>

        {!role && (
          <button
            className="enroll-button"
            style={isGloballyProfessor ? { backgroundColor: '#fd7e14' } : {}}
            onClick={() => handleEnroll(isGloballyProfessor ? 'PROFESSOR' : 'STUDENT')}
          >
            Enroll as {isGloballyProfessor ? 'Professor' : 'Student'}
          </button>
        )}
      </div>
    </div>
  );
}
