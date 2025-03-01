import React from 'react';
import { Teacher } from '../types';

interface TeacherCardProps {
  teacher: Teacher;
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <div className="flex flex-col items-center space-y-2 cursor-pointer">
      <div className="relative">
        <img
          src={`${teacher.imageUrl}?w=100&h=100&fit=crop&crop=faces&q=80`}
          alt={teacher.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${teacher.status === 'online' ? 'bg-blue-600' : 'bg-gray-400'} rounded-full flex items-center justify-center text-white text-sm`}>
          ▶
        </div>
      </div>
      <span className="text-sm font-medium text-gray-900">{teacher.name}</span>
    </div>
  );
}