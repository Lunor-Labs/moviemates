
import React, { useState } from 'react';
import { Guest, GuestStatus } from '../types';

interface GuestItemProps {
  guest: Guest;
  onUpdateStatus: (id: string, status: GuestStatus) => Promise<void>;
}

const GuestItem: React.FC<GuestItemProps> = ({ guest, onUpdateStatus }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const isCheckedIn = guest.status === GuestStatus.CONFIRMED;
  const isLocked = guest.locked || isCheckedIn; // Lock confirmed guests

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpdating || isLocked) return;
    const newStatus = isCheckedIn ? GuestStatus.PENDING : GuestStatus.CONFIRMED;
    setIsUpdating(true);
    try {
      await onUpdateStatus(guest.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={`group relative flex items-center justify-between gap-3 rounded-2xl border p-3 transition-all duration-300 md:p-4 ${
        isCheckedIn
          ? 'border-green-500/30 bg-green-500/5'
          : isLocked
            ? 'border-gray-500/30 bg-gray-500/5 cursor-not-allowed opacity-75'
            : 'border-surface-highlight bg-surface-dark hover:border-primary/50 cursor-pointer'
      }`}
    >
      {isUpdating && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background-dark/20 backdrop-blur-[1px]">
          <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      )}
      
      <div className="flex min-w-0 items-center gap-3 md:gap-4">
        <div className={`relative size-10 shrink-0 overflow-hidden rounded-full border transition-all duration-500 md:size-14 md:border-2 ${isCheckedIn ? 'border-green-500 scale-105' : 'border-surface-highlight'}`}>
          <img alt={guest.name} className="h-full w-full object-cover" src={guest.avatar || `https://picsum.photos/seed/${guest.name}/200`} />
          {isCheckedIn && (
            <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
              <span className="material-symbols-outlined text-green-400 font-black text-sm md:text-base">check</span>
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col">
          <h4 className={`truncate text-sm font-bold transition-colors md:text-lg ${isCheckedIn ? 'text-green-400' : 'text-white'}`}>
            {guest.name}
          </h4>
          <p className="truncate text-[10px] font-medium text-gray-500 md:text-sm md:text-gray-400">
            {guest.specialty || guest.discipline}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className={`hidden text-[9px] font-black uppercase tracking-widest lg:block ${
          isCheckedIn ? 'text-green-500' : isLocked ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {isCheckedIn ? 'Arrived' : isLocked ? 'Locked' : 'Expected'}
        </span>
        
        {/* iOS Style Toggle */}
        <div
          className={`relative h-6 w-11 rounded-full transition-all duration-300 md:h-8 md:w-14 ${
            isCheckedIn
              ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
              : isLocked
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-surface-highlight'
          }`}
        >
          <div className={`absolute top-0.5 size-5 rounded-full shadow-md transition-all duration-300 ease-out md:top-1 md:size-6 ${
            isCheckedIn
              ? 'left-[22px] md:left-7 bg-white'
              : isLocked
                ? 'left-[22px] md:left-7 bg-gray-400 cursor-not-allowed'
                : 'left-0.5 md:left-1 bg-white'
          }`}></div>
        </div>
      </div>
    </div>
  );
};

export default GuestItem;
