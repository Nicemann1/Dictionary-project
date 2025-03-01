import React from 'react';
import { ScheduleItem } from '../types';
import { Check, Pencil } from 'lucide-react';

interface ScheduleListProps {
  items: ScheduleItem[];
}

export function ScheduleList({ items }: ScheduleListProps) {
  return (
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.id} className="flex items-start gap-4">
          <div className="glass rounded-full px-4 py-1 flex items-center gap-2 text-white/90">
            {item.time}
            <div className={`w-6 h-6 rounded-full glass flex items-center justify-center ${
              item.status === 'completed' ? 'text-emerald-200' : 'text-white/90'
            }`}>
              {item.status === 'completed' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Pencil className="w-4 h-4" />
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white">{item.title}</h3>
            {item.subtitle && (
              <p className="text-white/80">{item.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}