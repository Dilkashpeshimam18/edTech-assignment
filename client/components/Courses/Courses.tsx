'use client';

import './Courses.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '../../types/types';
import { useAuth } from '../../context/AuthContext';
import { graphqlFetch } from '../../utils/graphql';
import CourseCard from '../CourseCard/CourseCard';

type CoursesQuery = {
  courses: Course[];
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    graphqlFetch<CoursesQuery>(`query { courses { id title description level } }`, {}, user)
      .then((d) => setCourses(d.courses))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [user, router]);
  return (
    <div className="courses">
      <section className="courses-header">
        <button className="section-label">Our Courses</button>
        <h2 >Courses Designed for a Fast-Changing World</h2>
        <p>
          Stay ahead with content that evolves with industry trends, delivered by experts who know what skills you
          actually need. Dive into courses crafted by industry leaders.
        </p>
        <div className="filter-buttons">
          <button className="active">Featured</button>
          <button>Web Development</button>
          <button>Marketing</button>
          <button>Animation</button>
          <button>Social Media</button>
          <button>UI/UX Design</button>
          <button>Creative Marketing</button>
          <button>More+</button>
        </div>
      </section>

      <section className="course-grid">
        {courses && courses.length > 0
          ? courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))
          : !loading && <p>No courses found.</p>}
        {/* Example course card */}

        {/* Duplicate or map similar course cards here */}
      </section>
    </div>
  );
}
