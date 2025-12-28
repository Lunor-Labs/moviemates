
import React from 'react';
import { AttendanceStats } from '../types';

interface StatsCardProps {
  stats: AttendanceStats;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  return (
    <div className="rounded-2xl bg-surface-dark p-4 border border-surface-highlight md:p-6">
      <h3 className="mb-3 text-sm font-bold text-white flex items-center gap-2 md:mb-4 md:text-lg">
        <span className="material-symbols-outlined text-primary text-[20px] md:text-[24px]">analytics</span>
        Gate Attendance
      </h3>
      <div className="grid grid-cols-2 gap-2 md:flex md:flex-col md:gap-3">
        {[
          { label: 'Checked In', count: stats.confirmed, color: 'bg-green-400' },
          { label: 'Remaining', count: stats.pending, color: 'bg-yellow-400' },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center justify-between rounded-xl bg-surface-highlight/50 p-3 border border-surface-highlight md:flex-row md:p-4">
            <div className="flex flex-col items-center gap-1 md:flex-row md:gap-3">
              <div className={`h-1.5 w-1.5 rounded-full ${item.color} md:h-2 md:w-2`}></div>
              <span className="text-[10px] font-medium text-gray-400 md:text-sm md:text-gray-200">{item.label}</span>
            </div>
            <span className="text-lg font-bold text-white md:text-xl">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;
