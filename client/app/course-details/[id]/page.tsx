'use client';
import { useEffect } from 'react';

import '../CourseDetail.css';
import CourseDetail from '@/components/CourseDetail/CourseDetail';

export default function CourseDetailPage() {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <CourseDetail />
    </div>
  );
}
