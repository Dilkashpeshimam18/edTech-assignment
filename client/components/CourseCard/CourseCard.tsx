"use client";

import { useRouter } from "next/navigation";
import { Course } from "../../types/types";
import Image from "next/image";
import "./CourseCard.css";

export default function CourseCard({ course }: { course: Course }) {
  const router = useRouter();

  return (
    <div className="course-card">
      <Image
        src="/ai_course.jpg"
        alt={course.title}
        width={350}
        height={160}
        className="course-image"
      />

      <div className="course-content">
        <div className="course-rating">
          ★★★★☆ <span>4.5 (120)</span>
        </div>

        <h3 className="course-title">{course.title}</h3>

        <p className="course-description">{course.description}</p>

        <div className="course-instructor">
          <Image
            src="/ai_course.jpg"
            alt="Instructor avatar"
            width={20}
            height={20}
          />
          <span>By Daniel James | Featured</span>
        </div>

        <button
          onClick={() => router.push(`/course-details/${course.id}`)}
          className="course-button"
        >
          View Course
        </button>
      </div>
    </div>
  );
}
