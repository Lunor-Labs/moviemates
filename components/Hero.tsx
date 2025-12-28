
import React, { useState, useEffect } from 'react';
import { IMAGES, EVENT_DATE } from '../constants';

const Hero: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = EVENT_DATE.getTime() - now;

      setTimeLeft({
        days: Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
        minutes: Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))),
        seconds: Math.max(0, Math.floor((distance % (1000 * 60)) / 1000))
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNum = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="mb-6 overflow-hidden rounded-3xl bg-surface-dark shadow-2xl md:mb-8">
      <div 
        className="relative flex min-h-[220px] flex-col items-center justify-center gap-4 bg-cover bg-center bg-no-repeat p-6 text-center md:min-h-[360px] md:gap-6 md:p-8"
        style={{
          backgroundImage: `linear-gradient(rgba(25, 16, 34, 0.7) 0%, rgba(25, 16, 34, 0.9) 100%), url("${IMAGES.heroBg}")`
        }}
      >
        <div className="flex flex-col gap-1 md:gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary md:text-sm">Year End 2025</span>
          <h1 className="text-2xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            Gathering
          </h1>
          <p className="mx-auto hidden max-w-xl text-sm text-gray-300 md:block md:text-lg">
            Exclusive entry for the 31st Collective creative community.
          </p>
        </div>

        <div className="flex justify-center gap-2 md:gap-4">
          {[
            { label: 'D', value: formatNum(timeLeft.days) },
            { label: 'H', value: formatNum(timeLeft.hours) },
            { label: 'M', value: formatNum(timeLeft.minutes) },
            { label: 'S', value: formatNum(timeLeft.seconds) },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-0.5 rounded-xl bg-black/40 px-3 py-2 backdrop-blur-md border border-white/10 min-w-[50px] md:min-w-[80px] md:gap-1 md:py-3">
              <span className="text-sm font-bold text-white md:text-2xl">{item.value}</span>
              <span className="text-[8px] uppercase text-gray-500 md:text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
