'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEnrollment } from '../../context/EnrollmentContext';

import { graphqlFetch } from '../../utils/graphql';
import { Course } from '../../types/types';
import { useCourseRole } from '../../hooks/useCourseRole';
import Image from 'next/image';
import './CourseDetail.css';
type CourseQuery = {
  course: Course;
};
export default function CourseDetail() {
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
    <div className="course-detail">
      <div className="course-section-1">
        <div className="course-info">
          <div className="breadcrumb">
            <span>All courses</span> &gt; <span>Web Design</span> &gt; <span>Product Design</span>
          </div>

          {/* <h1>{course.title}</h1> */}
          {/* <h1>Founders Master Class: 7 Essential Steps for Startups</h1> */}
                    <h1>{course.title}</h1>

          <p className="program">By Instructor | {course.level} Level</p>

          <div className="ratings">
            <span className="stars">★★★★★</span>
            <span className="reviews">(789 reviews)</span>
          </div>

          <p className="description">
            The UX Fundamentals & Design Research program teaches the core principles of human-centered design,
            including. Learn product validation, UI/UX practices, Google’s Design Sprint and the process for setting and
            tracking actionable ... <a href="#">Read more</a>
          </p>

          <div className="skills">
            <span>UX Research</span>
            <span>UX Design</span>
            <span>Innovation</span>
            <span>Prototyping</span>
            <span>User-Centered Design</span>
            <span>UX Market Research</span>
            <span className="more-skills">27+ More Skills</span>
          </div>

          <div className="cta-buttons">
            <button onClick={() => handleEnroll(isGloballyProfessor ? 'PROFESSOR' : 'STUDENT')} className="subscribe">
              Enroll as {isGloballyProfessor ? 'Professor' : 'Student'}
            </button>
            {/* {isGloballyProfessor && (
              <button onClick={() => router.push(`/edit-course/${course.id}`)} className="add-cart">
                Edit Course
              </button>
            )} */}
            <button onClick={() => router.push(`/edit-course/${course.id}`)} className="add-cart">
              Edit Course
            </button>
          </div>
        </div>
        <div className="course-visual">
          <Image src="/uiux.png" alt="UI/UX Illustration" width={1500} height={1500} />
        </div>
      </div>

      <div className="course-section-2">
        <div className="course-includes">
          <h2>What’s included</h2>
          <div className="includes-grid">
            <div className="include-item">
              <Image src="/folder.png" alt="Project File" width={50} height={50} />
              <p>One project file</p>
            </div>
            <div className="include-item">
              <Image src="/quiz.png" alt="Chapter Quizzes" width={50} height={50} />
              <p>3 chapter quizzes</p>
            </div>
            <div className="include-item">
              <Image src="/access.png" alt="Access Devices" width={50} height={50} />
              <p>Access on tablet and phone</p>
            </div>
            <div className="include-item">
              <Image src="/certicate.png" alt="Certificate" width={50} height={50} />
              <p>Certificate of completion</p>
            </div>
          </div>
        </div>

        <div className="course-description-section">
          <h2>Course description</h2>
          <p>
            As a product manager, you serve as the diplomat of the product team. You're tasked with communicating with
            stakeholders inside the product team, outside the product team, and even outside the company. By
            understanding how to communicate with each of these stakeholders in terms of what they care about, you'll be
            able to build better products and get more accomplished. In this course, Jay Clouse reviews the roles and
            responsibilities of the typical product team and explains the nuances of communicating with each group of
            stakeholders, including senior leaders, company partners such as sales and marketing, and customers
            themselves... <a href="#">Read more</a>
          </p>
        </div>

        <div className="course-content">
          <h2>Courses In This Program</h2>
          <p className="chapter-info">16 Chapter • 323 lectures • 109h 12m total length</p>
          <div className="chapter-card">
            <div className="chapter-header">
              <span className="chapter-title">Chapter 1 • 55 minutes</span>
              <span className="toggle-icon">^</span>
            </div>
            <p className="chapter-description">Welcome to the User Experience Product Design Program</p>
          </div>

          <div className="chapter-card">
            <div className="chapter-header">
              <span className="chapter-title">Chapter 1 • 10 minutes</span>
              <span className="toggle-icon">^</span>
            </div>
            <p className="chapter-description">Welcome to the User Interface Product Design Program</p>
          </div>
          <div className="expand-all">
            <a href="#">Expand all chapters →</a>
          </div>
        </div>
      </div>
      <div className="course-section-3">
        <div className="taught-by">
          <h2>Taught By The Best</h2>
          <div className="instructor-grid">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <div className="instructor-card" key={index}>
                  <Image
                    style={{ borderRadius: '10px' }}
                    src="/instructor.jpg"
                    alt="Instructor"
                    width={100}
                    height={100}
                  />
                  <div>
                    <h3>Michael Dedrick</h3>
                    <p>UX Designer, Google</p>
                    <a href="#">Read bio</a>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="ratings-reviews">
          <h2>Ratings & Reviews</h2>
          <div className="average-rating">
            <p>Average Rating: 4.7 Stars</p>
            <div className="stars">★★★★☆</div>
            <p className="review-count">(789 Reviews)</p>
          </div>
          <div className="review-cards">
            {['Brooklyn Simmons', 'Pintér Beatrix', 'Darlene Robertson'].map((name, i) => (
              <div className="review-card" key={i}>
                <div>
                  <Image style={{ borderRadius: '10px' }} src="/instructor.jpg" alt={name} width={50} height={50} />

                  <h4 style={{ marginBottom: '2px' }}>{name}</h4>
                  <p className="title">{i === 0 ? 'UI/UX Designer' : i === 1 ? 'Bookkeeper' : 'General Manager'}</p>
                  <div className="stars">★★★★☆</div>
                  <p style={{ fontStyle: 'italic', fontSize: '14px' }}>
                    "The service provided is incredible. The use of AI to help Ed Tech is much needed"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
