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
      await graphqlFetch(mutation, { id, title, description, level, userId: user.id }, user);
      alert('Course update successfully!');
      // router.push(`/course-details/${id}`);
    } catch (err) {
      setError(String(err));
    }
  };

  if (loading) return <p>Loading course data...</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div className="edit-course-wrapper">
      <div className="edit-course-left">
        <h2>Edit Course</h2>
        <p>Make changes to your course title, description, and materials to keep it fresh and engaging.</p>

        <img src="/edit_course.png" alt="Login Illustration" />
      </div>
      <div className="edit-course-right">
        <form className="edit-form" onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label style={{ marginTop: '15px' }} htmlFor="description">
            Description:
          </label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />

          <label style={{ marginTop: '15px' }} htmlFor="level">
            Level:
          </label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED')}
            required
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>

          <button type="submit" className="submit-btn">
            Save Changes
          </button>

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}
