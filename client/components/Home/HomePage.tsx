'use client';

import Image from 'next/image';
import './HomePage.css';
import CoursesPage from '../Courses/Courses';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '../../types/types';
import { useAuth } from '../../context/AuthContext';
import { graphqlFetch } from '../../utils/graphql';
import CourseCard from '../CourseCard/CourseCard';

type CoursesQuery = {
  courses: Course[];
};

export default function HomePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const coursesList = [
    { name: 'Introduction', progress: 60 },
    { name: 'Workspace', progress: 80 },
    { name: 'Notes & Tools', progress: 75 },
    { name: 'Customization', progress: 65 },
  ];
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    graphqlFetch<CoursesQuery>(`query { courses { id title description level } }`, {}, user)
      .then((d) => setCourses(d.courses))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [authLoading, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (authLoading) return null;
  return (
    <div className="homepage">
      <main className="main">
        <div className="text-content">
          <h1>
            <span className="highlight">Sell more courses</span>
            <br />
            and spend less time doing it
          </h1>
          <p>
            We make turning your expertise into engaging online courses easy. Do it with an easy-to-use AI solution
            designed with the learning experience in mind.
          </p>
          <div style={{ paddingTop: '15px' }} className="buttons">
            <button className="book-demo">Book a demo</button>
            <button className="free-trial">Start free trial</button>
          </div>
        </div>

        <div className="image-content">
          <Image src="/womenLearn.jpg" alt="Happy Woman" width={650} height={550} className="main-image" />
          <div className="enrollment-box">
            <svg className="progress-circle" viewBox="0 0 36 36">
              <path
                className="circle-bg"
                d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle"
                strokeDasharray="83, 100"
                d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="percentage">
                83%
              </text>
            </svg>
            <p className="label">Enrollments Started</p>
            <p className="sub-label">Course</p>
          </div>
          <div className="course-progress">
            <ul>
              {coursesList.map((course, idx) => (
                <li key={idx}>
                  <div className="course-header">
                    <span>{course.name}</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <section className="learngenix-section">
        <h2 className="learngenix-title">How LearnGenix Helps You</h2>
        <div className="learngenix-cards">
          <div className="learngenix-card">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Image src="/3d-lamp.png" alt="AI Powered" width={80} height={80} />
            </div>
            <h3>AI Powered Curriculum</h3>
            <p>Dynamic course generation based on student learning pace</p>
            <span className="arrow">↗</span>
          </div>

          <div className="learngenix-card">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Image src="/3d-report.png" alt="AI Powered" width={80} height={80} />
            </div>{' '}
            <h3>Learning Analytics</h3>
            <p>Real time insights to guide educators and improve student performance</p>
            <span className="arrow">↗</span>
          </div>

          <div className="learngenix-card">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Image src="/3d-fire.png" alt="AI Powered" width={80} height={80} />
            </div>{' '}
            <h3>Student Experience</h3>
            <p>Intuitive, adaptive UI that adjusts to each learner's unique journey</p>
            <span className="arrow">↗</span>
          </div>
        </div>
      </section>
      <section>
        <CoursesPage />
      </section>
      <section className="whyus-section">
        <div className="whyus-header">
          <span className="whyus-badge">Why Us?</span>
          <h2>
            Built to Help You Learn <span>Better,faster,smarter.</span>
          </h2>
          <p>
            We don’t just teach. We empower—with industry-relevant content, personalized guidance, and the tools to turn
            learning into action.
          </p>
        </div>

        <div className="whyus-grid">
          {/* Left Column */}
          <div className="whyus-left">
            <div className="whyus-card blue-card">
              <h3>We Have More Than 5k+ Courses</h3>
              <p>Join a growing global community—over 100,000 learners, 500+ success stories.</p>
              <button className="yellow-btn">Browse Courses</button>
            </div>

            <div className="whyus-card blue-card small-card">
              <div className="mentor-images">
                <img src="/instructor.jpg" alt="Mentor" />
                <img src="/instructor.jpg" alt="Mentor" />
                <img src="/instructor.jpg" alt="Mentor" />
                <img src="/instructor.jpg" alt="Mentor" />
                <span className="mentor-count">+200</span>
              </div>
              <h3 style={{ fontSize: '15px', color: 'white' }}>We Have More Than 250+ Top Mentors & Coaches</h3>
            </div>
          </div>

          {/* Right Column */}
          <div className="whyus-card growth-card">
            <h4>Our Growth</h4>
            <p className="growth-subtitle">Our Company growth each year:</p>
            <h2>70%</h2>
            <p className="growth-subtitle">Each year our course enrolment percentage growth</p>
            <h2>450%</h2>
            <a href="#" className="read-more">
              Read more
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
