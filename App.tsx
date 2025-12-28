
import React, { useState, useEffect, useMemo } from 'react';
import { Guest, GuestStatus, AttendanceStats } from './types';
import * as guestService from './services/guestService';
import Header from './components/Header';
import Hero from './components/Hero';
import StatsCard from './components/StatsCard';
import VenueCard from './components/VenueCard';
import GuestItem from './components/GuestItem';

type FilterType = 'all' | GuestStatus.CONFIRMED | GuestStatus.PENDING;

const App: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [scriptUrl, setScriptUrl] = useState<string>(localStorage.getItem('gas_script_url') || 'https://script.google.com/macros/s/AKfycbwuqJFQBzJozp-CwWbbGvvegh-7zcvEuREmPSZPTj4RkYBL0hYJiisou0xMyYKWKSw/exec');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState(scriptUrl);

  const loadData = async () => {
    if (!scriptUrl) return;
    
    if (scriptUrl.includes('docs.google.com/spreadsheets')) {
      setError("Use the 'Web App URL' from your Apps Script Deployment, not the Sheet URL.");
      setGuests([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await guestService.fetchGuests(scriptUrl);
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format.");
      }
      setGuests(data);
    } catch (err: any) {
      console.error('Failed to load guests', err);
      setError(err.message || 'Connection failed.');
      setGuests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scriptUrl) loadData();
  }, [scriptUrl]);

  const handleUpdateStatus = async (id: string, status: GuestStatus) => {
    if (!scriptUrl) return;
    try {
      setGuests(prev => prev.map(g => g.id === id ? { ...g, status } : g));
      await guestService.updateGuestStatus(scriptUrl, id, status);
    } catch (error) {
      console.error('Failed to update status', error);
      loadData();
    }
  };

  const handleSaveSettings = () => {
    const cleanUrl = tempUrl.trim();
    localStorage.setItem('gas_script_url', cleanUrl);
    setScriptUrl(cleanUrl);
    setIsSettingsOpen(false);
    setError(null);
  };

  const stats = useMemo<AttendanceStats>(() => {
    return guests.reduce((acc, g) => {
      const status = g.status?.toString().toLowerCase();
      if (status === GuestStatus.CONFIRMED) acc.confirmed++;
      else acc.pending++;
      return acc;
    }, { confirmed: 0, pending: 0 });
  }, [guests]);

  const filteredGuests = useMemo(() => {
    return guests.filter(g => {
      const name = (g.name?.toString() || '').toLowerCase();
      const spec = (g.specialty?.toString() || '').toLowerCase();
      const disc = (g.discipline?.toString() || '').toLowerCase();
      const search = searchTerm.toLowerCase();
      
      const matchesSearch = name.includes(search) || spec.includes(search) || disc.includes(search);
      const matchesFilter = activeFilter === 'all' || 
        (activeFilter === GuestStatus.PENDING && (!g.status || g.status === GuestStatus.PENDING)) ||
        g.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [guests, searchTerm, activeFilter]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background-dark text-white font-display">
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        hasUrl={!!scriptUrl}
      />
      
      <main className="flex grow flex-col items-center">
        <div className="w-full max-w-[1024px] px-4 py-6 md:px-8 md:py-8">
          <Hero />

          {(!scriptUrl || error) && (
            <div className="mb-6 flex flex-col items-center justify-center gap-4 rounded-3xl bg-surface-dark p-6 text-center border border-dashed border-primary/40 md:mb-8 md:p-12 md:gap-6">
              <div className={`size-12 flex items-center justify-center rounded-full md:size-20 ${error ? 'bg-red-500/10 text-red-400' : 'bg-primary/10 text-primary'}`}>
                <span className="material-symbols-outlined text-2xl md:text-4xl">{error ? 'report_problem' : 'database'}</span>
              </div>
              <div className="max-w-md">
                <h3 className="text-xl font-bold text-white mb-1 md:text-2xl md:mb-2">
                  {error ? 'Sync Connection Issue' : 'Connect Gate Data'}
                </h3>
                <p className="text-sm text-gray-400 md:text-base">
                  {error || "Connect your guest list spreadsheet to start checking people in at the gate."}
                </p>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform md:px-8 md:py-3 md:text-base"
              >
                {error ? 'Check Settings' : 'Connect Now'}
              </button>
            </div>
          )}

          {scriptUrl && !error && (
            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
              <div className="flex flex-col gap-4 lg:col-span-1 lg:gap-6">
                <StatsCard stats={stats} />
                <div className="hidden lg:block">
                  <VenueCard />
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:col-span-2 lg:gap-6">
                <div className="sticky top-[72px] z-40 -mx-4 px-4 bg-background-dark/95 backdrop-blur-md pt-2 pb-3 space-y-4 md:top-[88px] md:mx-0 md:px-0">
                  {/* Modern Pill Search Bar */}
                  <div className="relative group w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <span className={`material-symbols-outlined transition-colors duration-300 ${searchTerm ? 'text-primary' : 'text-gray-500'} text-xl md:text-2xl`}>
                        search
                      </span>
                    </div>
                    <input 
                      type="text"
                      className="block w-full h-12 md:h-14 pl-11 pr-12 text-sm md:text-base bg-surface-highlight/40 border border-white/10 rounded-full text-white placeholder-gray-500 transition-all duration-300 focus:bg-surface-highlight focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none shadow-lg group-hover:bg-surface-highlight/60"
                      placeholder="Search guests by name or specialty..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">cancel</span>
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {[
                      { id: 'all', label: 'All', count: guests.length },
                      { id: GuestStatus.CONFIRMED, label: 'Arrived', count: stats.confirmed, color: 'text-green-400' },
                      { id: GuestStatus.PENDING, label: 'Expected', count: stats.pending, color: 'text-yellow-400' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveFilter(tab.id as FilterType)}
                        className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all border md:px-5 md:py-2.5 md:text-sm ${
                          activeFilter === tab.id 
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105' 
                            : 'bg-surface-highlight/40 border-white/5 text-gray-400 hover:bg-surface-highlight hover:text-white'
                        }`}
                      >
                        <span className={activeFilter === tab.id ? 'text-white' : tab.color}>{tab.label}</span>
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${activeFilter === tab.id ? 'bg-white/20' : 'bg-black/20'}`}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:gap-3">
                  <div className="flex items-center justify-between px-1 pb-1">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest md:text-base">Guest Entry List</h3>
                    <button 
                      onClick={loadData}
                      disabled={loading}
                      className="flex items-center gap-1 text-xs font-bold text-primary hover:text-white transition-colors disabled:opacity-50"
                    >
                      <span className={`material-symbols-outlined text-[14px] md:text-[16px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
                      Sync
                    </button>
                  </div>

                  {loading && guests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent md:size-10 md:border-4"></div>
                      <p className="text-xs text-gray-500 md:text-sm">Updating guest list...</p>
                    </div>
                  ) : filteredGuests.length > 0 ? (
                    filteredGuests.map(guest => (
                      <GuestItem 
                        key={guest.id} 
                        guest={guest} 
                        onUpdateStatus={handleUpdateStatus} 
                      />
                    ))
                  ) : (
                    <div className="py-12 text-center text-gray-500 bg-surface-dark/30 rounded-3xl border border-surface-highlight border-dashed md:py-20">
                      <span className="material-symbols-outlined text-3xl mb-2 block opacity-20 md:text-5xl md:mb-4">person_off</span>
                      <p className="text-sm md:text-lg">No guests found</p>
                      {searchTerm && (
                        <button 
                          onClick={() => setSearchTerm('')} 
                          className="mt-2 text-primary text-xs font-bold hover:underline"
                        >
                          Clear search query
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-surface-dark p-5 border border-surface-highlight shadow-2xl animate-in fade-in zoom-in duration-200 my-auto md:p-10">
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 md:text-2xl">
                  <span className="material-symbols-outlined text-primary">gate</span>
                  Gate Setup
                </h3>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-500 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
              <div className="space-y-4">
                <div className="rounded-xl bg-surface-highlight/40 p-4 border border-surface-highlight md:p-5">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Updates to <b>status</b> column in Google Sheet immediately.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-1">Web App URL</label>
                  <input 
                    type="text"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    placeholder="https://script.google.com/..."
                    className="w-full rounded-xl bg-surface-highlight border-none text-white p-3 focus:ring-2 focus:ring-primary text-xs font-mono md:p-4 md:text-sm"
                  />
                </div>

                <button 
                  onClick={handleSaveSettings}
                  disabled={!tempUrl}
                  className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 md:py-4"
                >
                  Save URL
                </button>
              </div>

              <div className="rounded-xl bg-black/20 p-4 border border-white/5 space-y-3 md:p-5">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Guide</h4>
                <div className="text-[10px] text-gray-400 space-y-2 md:text-[11px]">
                  <p>1. Copy Apps Script from <code>guestService.ts</code></p>
                  <p>2. Extensions {'>'} Apps Script in Sheet</p>
                  <p>3. Deploy {'>'} New Deployment (Web App)</p>
                  <p>4. Access: "Anyone"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-6 border-t border-surface-highlight p-6 text-center text-gray-600 text-[10px] md:mt-10 md:p-10 md:text-xs">
        &copy; 2025 The 31st Collective. Gate Management System.
      </footer>
    </div>
  );
};

export default App;
