import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Course } from '../types';

interface ProgressCardProps {
  course: Course;
}

export function ProgressCard({ course }: ProgressCardProps) {
  return (
    <div className="glass-card p-4 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{course.icon}</span>
          <h3 className="font-medium text-white">{course.title}</h3>
        </div>
        <ChevronRight className="h-5 w-5 text-white/40" />
      </div>
      
      <div className="space-y-3">
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-white/40 h-2 rounded-full transition-all duration-300 shimmer"
            style={{ width: `${course.progress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-white/70">
          <span>{course.lectures} lectures</span>
          <span>{course.practicalWork} practical work</span>
        </div>
      </div>
    </div>
  );
}