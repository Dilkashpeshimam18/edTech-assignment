'use client';

import { useRouter } from 'next/navigation';
import { Course } from '../../types/types';
import Image from 'next/image';
import './CourseCard.css';

export default function CourseCard({ course }: { course: Course }) {
  const router = useRouter();

  return (
    <div onClick={() => router.push(`/course-details/${course.id}`)} className="course-card">
      <Image src="/ai_course.jpg" alt="Course 1" width={300} height={200} className="course-image" />
      <div className="course-info">
        <div className="stars">
          ★★★★★ <span>(340 Reviews)</span>
        </div>
        <h3>{course.title}</h3>
        <div className="meta">
          <span>{course.description}</span>

          <span>06 hr 20 mins</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="author">
            <Image src="/ai_course.jpg" alt="Shane" width={24} height={24} />
            <span>By Shane Watson</span>
          </div>
          <div className="price">$120.00</div>
        </div>
      </div>
    </div>
  );
}
