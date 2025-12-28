
import React from 'react';
import { IMAGES } from '../constants';

const VenueCard: React.FC = () => {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-surface-dark p-6 border border-primary/20">
      <h3 className="mb-2 text-lg font-bold text-white">Venue Details</h3>
      <p className="text-sm text-gray-300 mb-4">The Grand Atrium, Downtown Arts District</p>
      <div className="aspect-video w-full rounded-xl bg-surface-highlight overflow-hidden relative">
        <img 
          alt="Venue Location" 
          className="h-full w-full object-cover opacity-80 hover:opacity-100 transition-opacity cursor-pointer" 
          src={IMAGES.map} 
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="material-symbols-outlined text-4xl text-white drop-shadow-lg">location_on</span>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
