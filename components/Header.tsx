
import React from 'react';

interface HeaderProps {
  onOpenSettings: () => void;
  hasUrl: boolean;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings, hasUrl }) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-surface-highlight bg-background-dark/95 backdrop-blur-sm px-6 py-4 md:px-10">
      <div className="flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
          <span className="material-symbols-outlined">celebration</span>
        </div>
        <div>
          <h2 className="text-lg font-bold leading-tight tracking-tight text-white">
            Advertising Industry<br />
            Get-Together
          </h2>
          <p className="text-xs text-gray-400">Guest Management</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onOpenSettings}
          className={`flex size-10 items-center justify-center rounded-xl transition-all ${hasUrl ? 'bg-surface-highlight text-gray-300' : 'bg-primary text-white animate-pulse'}`}
          title="Spreadsheet Settings"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
        <button className="flex items-center gap-2 rounded-xl bg-surface-highlight px-4 py-2 text-sm font-bold text-white hover:bg-[#452d5b] transition-colors">
          <span className="material-symbols-outlined text-[18px]">account_circle</span>
          <span className="hidden sm:inline">Admin</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
