'use client';

import React from "react";
import "./EnrollmentConfirmation.css";
import { useRouter, useParams ,useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEnrollment } from '../../context/EnrollmentContext';

import { graphqlFetch } from '../../utils/graphql';
import { Course } from '../../types/types';

type CourseQuery = {
  course: Course;
};
export default function EnrollmentConfirmation() {
      const router = useRouter();
  const params = useParams();

const searchParams = useSearchParams();
    const courseId = searchParams.get('courseId');
      const { user } = useAuth();
      const { getEnrollmentForCourse } = useEnrollment();
    
      const [course, setCourse] = useState<Course | null>(null);
      const [error, setError] = useState<string | null>(null);
      const [loading, setLoading] = useState(true);
    
      const enrollment = courseId && typeof courseId === 'string' ? getEnrollmentForCourse(courseId) : undefined;
    
      useEffect(() => {
        if (!courseId || typeof courseId !== 'string') return;
        if (!user) {
          router.replace('/login');
          return;
        }
        graphqlFetch<CourseQuery>(
          `query ($id: ID!) { course(id: $id) { id title description level } }`,
          { id: courseId },
          user
        )
          .then((d) => setCourse(d.course))
          .catch((e) => setError(String(e)))
          .finally(() => setLoading(false));
      }, [courseId, user, router]);
    
      if (!courseId) return <p className="text-red-600">No course specified.</p>;
      if (!user) return null; 
      if (loading) return <p>Loading confirmation...</p>;
  return (
    <div className="enrollment-confirmation">
      {/* Left Section */}
      <div className="confirmation-left">
        <h1 className="confirmation-title">Enrollment confirmed successfully!</h1>
        <p className="confirmation-message">
          Thank you for enrolling in our course! Your seat has been reserved.
          If there’s anything you need before classes start, please don’t
          hesitate to reach out to us.
        </p>
        <div className="confirmation-buttons">
          <button onClick={() => router.push(`/course-details/${courseId}`)} className="btn-primary">View course details</button>
          <button onClick={() => router.push('/')} className="btn-link">Go back to home</button>
        </div>
      </div>

      {/* Right Section */}
      <div className="confirmation-right">
        <div className="amount-card">
          <h2>$549.99</h2>
          <p>Payment success!</p>
          <div className="check-icon">✔</div>
        </div>

        <div className="payment-details">
          <h3>Payment details</h3>
          <div className="details-row">
            <span>Date</span>
            <span>Jul 25, 2023 05:07:03 AM</span>
          </div>
          <div className="details-row">
            <span>Reference number</span>
            <span>148979951</span>
          </div>
          <div className="details-row">
            <span>Amount</span>
            <span>$549.99</span>
          </div>
          <div className="details-row">
            <span>Payment method</span>
            <span className="bold">Credit Card</span>
          </div>
          <div className="details-row">
            <span>Payment status</span>
            <span className="status-success">✔ Success</span>
          </div>
        </div>
      </div>
    </div>
  );
}
