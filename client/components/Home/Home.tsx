'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '../../types/types';
import { useAuth } from '../../context/AuthContext';
import { graphqlFetch } from '../../utils/graphql';
import CourseCard from '../CourseCard/CourseCard';
import './Home.css';

type CoursesQuery = {
  courses: Course[];
};

export default function HomePage() {
  const { user, logout,loading: authLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="home-container">
      <h2 className="home-title">All Courses</h2>
      {user && (
        <button onClick={handleLogout} className="logout-button">
          🚪 Logout
        </button>
      )}
      {error && <div className="home-error">Error: {error}</div>}
      {loading && <p className="home-loading">Loading courses...</p>}

      <div className="courses-grid">
        {courses && courses.length > 0
          ? courses.map((c) => <CourseCard key={c.id} course={c} />)
          : !loading && <p>No courses found.</p>}
      </div>
    </div>
  );
}
