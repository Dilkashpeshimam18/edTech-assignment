'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { graphqlFetch } from '../../../utils/graphql';
import { Course } from '../../../types/types';
import '../EditCourse.css';
type CourseQuery = {
  course: Course;
};

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('BEGINNER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }

    if (!id) return;

    graphqlFetch<CourseQuery>(
      `query ($id: ID!) {
      course(id: $id) {
        id
        title
        description
        level
      }
    }`,
      { id },
      user
    )
      .then((res) => {
        setCourse(res.course);
        setTitle(res.course.title);
        setDescription(res.course.description);
        setLevel(res.course.level);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [id, user, router]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user || !id) return;

  const mutation = `
    mutation EditCourse($id: ID!, $title: String, $description: String, $level: CourseLevel, $userId: ID!) {
      editCourse(id: $id, title: $title, description: $description, level: $level, userId: $userId) {
        id
        title
        description
        level
      }
    }
  `;

  try {
    await graphqlFetch(
      mutation,
      { id, title, description, level, userId: user.id },
      user
    );
    alert('Course update successfully!')
    // router.push(`/course-details/${id}`);
  } catch (err) {
    setError(String(err));
  }
};


  if (loading) return <p>Loading course data...</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div className="edit-course-container" style={{ padding: '2rem' }}>
      <h2>Edit Course</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>

        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>

        <label>
          Level:
          <select value={level} onChange={(e) => setLevel(e.target.value as any)} required>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </label>

        <button type="submit" style={{ marginTop: '1rem' }}>
          Save Changes
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
