'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Check, ShieldCheck, Sparkles, ChevronRight, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SwipeToCollectProps {
  orderNumber: string;
  businessName: string;
  isCollected: boolean;
  onCollected: () => void;
}

export function SwipeToCollect({
  orderNumber,
  businessName,
  isCollected,
  onCollected,
}: SwipeToCollectProps) {
  const [swiped, setSwiped] = useState(isCollected);
  const [liveSeconds, setLiveSeconds] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const sliderWidth = 280; // drag travel distance in px

  const x = useMotionValue(0);
  const bgOpacity = useTransform(x, [0, sliderWidth], [0.15, 1]);
  const textOpacity = useTransform(x, [0, sliderWidth / 2], [1, 0]);

  // Anti-screenshot live timestamp
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveSeconds(now.getSeconds());
      setCurrentTimeStr(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x >= sliderWidth * 0.75) {
      setSwiped(true);
      onCollected();
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    } else {
      x.set(0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Live Anti-Screenshot Handshake Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 p-5 text-center shadow-xl">
        {/* Pulsing Anti-Fraud Live Badge */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-[11px]">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold tracking-wide uppercase">Live Verification Seal</span>
          </div>
          <div className="font-mono text-slate-300 font-bold bg-slate-800 px-2 py-0.5 rounded">
            {currentTimeStr}
          </div>
        </div>

        {/* Security Shield Seal */}
        <div className="my-3 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-emerald-950/80 border-2 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
              className="absolute inset-1 rounded-full border border-dashed border-emerald-400/50"
            />
            {swiped ? (
              <Check className="w-10 h-10 text-emerald-400" />
            ) : (
              <ShieldCheck className="w-10 h-10 text-emerald-400 animate-pulse" />
            )}
          </div>
          <p className="text-xs font-bold text-slate-200 mt-2">
            {swiped ? 'Meal Rescued & Collected!' : 'Show screen to staff upon pickup'}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Order <span className="font-mono text-emerald-400">#{orderNumber}</span> at {businessName}
          </p>
        </div>

        {/* Slider Action */}
        {swiped ? (
          <div className="mt-4 py-3 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-400 text-xs font-black flex items-center justify-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>COLLECTED & VERIFIED BY CASHIER</span>
          </div>
        ) : (
          <div className="mt-4">
            <div className="relative h-14 bg-slate-950 rounded-2xl border border-emerald-500/40 p-1.5 flex items-center select-none overflow-hidden">
              {/* Background fill based on swipe */}
              <motion.div
                style={{ opacity: bgOpacity }}
                className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500"
              />

              {/* Slider instruction text */}
              <motion.div
                style={{ opacity: textOpacity }}
                className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-emerald-400 tracking-wider uppercase pointer-events-none pl-10"
              >
                <span>Swipe to collect &gt;&gt;</span>
              </motion.div>

              {/* Draggable thumb */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: sliderWidth }}
                dragElastic={0.05}
                dragSnapToOrigin={!swiped}
                onDragEnd={handleDragEnd}
                style={{ x }}
                className="relative z-10 w-11 h-11 bg-gradient-to-tr from-emerald-400 to-teal-300 rounded-xl shadow-lg flex items-center justify-center text-slate-950 font-black cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
              >
                <ChevronRight className="w-6 h-6 animate-pulse" />
              </motion.div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              💡 Swipe right in front of the store manager to confirm collection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
