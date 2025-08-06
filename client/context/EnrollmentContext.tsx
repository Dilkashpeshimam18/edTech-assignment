"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Enrollment } from '../types/types';

type EnrollmentContextValue = {
  enrollments: Enrollment[];

  addEnrollment: (e: Enrollment) => void;
  getEnrollmentForCourse: (courseId: string) => Enrollment | undefined;
};

const EnrollmentContext = createContext<EnrollmentContextValue | undefined>(undefined);

export function EnrollmentProvider({ children }: { children: ReactNode }) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    localStorage.setItem('enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  const addEnrollment = (e: Enrollment) =>
    setEnrollments((prev) => {
      const filtered = prev.filter((en) => en.courseId !== e.courseId);
      return [...filtered, e];
    });
  const getEnrollmentForCourse = (courseId: string) => enrollments.find((e) => e.courseId === courseId);

  return (
    <EnrollmentContext.Provider value={{ enrollments, addEnrollment, getEnrollmentForCourse }}>
      {children}
    </EnrollmentContext.Provider>
  );
}

export function useEnrollment() {
  const ctx = useContext(EnrollmentContext);
  if (!ctx) throw new Error('useEnrollment must be used within EnrollmentProvider');
  return ctx;
}
