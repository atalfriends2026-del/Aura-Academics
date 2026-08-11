import React, { useState, useEffect, useRef } from "react";
import { Timer, Play, Pause, RotateCcw, Volume2, Headphones, Sparkles, CheckCircle2, Settings2 } from "lucide-react";

export const FocusTab: React.FC = () => {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  
  const [mode, setMode] = useState<"work" | "break">("work");
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [activeSound, setActiveSound] = useState<string | null>("library");
  const [showSettings, setShowSettings] = useState(false);

  // Audio Context for subtle chime
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 1); // C6

      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 2);
    } catch (e) {
      console.log("AudioContext not supported or blocked");
    }
  };

  useEffect(() => {
    let timer: any = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      playChime();
      
      if (mode === "work") {
        setSessionCount((prev) => prev + 1);
        setMode("break");
        setSecondsLeft(breakMinutes * 60);
        alert(`Focus Session Completed! Time for a ${breakMinutes} minute break.`);
      } else {
        setMode("work");
        setSecondsLeft(workMinutes * 60);
        alert(`Break Completed! Ready for another focus session?`);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, mode, workMinutes, breakMinutes]);

  // When workMinutes/breakMinutes change and timer is not running, update secondsLeft
  useEffect(() => {
    if (!isRunning) {
      if (mode === "work") {
        setSecondsLeft(workMinutes * 60);
      } else {
        setSecondsLeft(breakMinutes * 60);
      }
    }
  }, [workMinutes, breakMinutes, mode, isRunning]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === "work") {
      setSecondsLeft(workMinutes * 60);
    } else {
      setSecondsLeft(breakMinutes * 60);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-800/50 shadow-sm text-center space-y-2 relative">
        <h2 className="text-xl font-black text-slate-900 dark:text-white inline-flex items-center space-x-2">
          <Timer className="w-5 h-5 text-indigo-500" />
          <span>Pomodoro Study Focus Timer</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Maintain deep focus using custom intervals and ambient acoustic audio.
        </p>

        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
          title="Timer Settings"
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      {showSettings && (
        <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm space-y-4 animate-fadeIn">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Custom Intervals</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Focus Time (minutes)</label>
              <input 
                type="number" 
                min="1" max="120" 
                value={workMinutes} 
                onChange={(e) => setWorkMinutes(Number(e.target.value) || 25)}
                disabled={isRunning}
                className="w-full px-4 py-2 rounded-xl border border-white/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Break Time (minutes)</label>
              <input 
                type="number" 
                min="1" max="60" 
                value={breakMinutes} 
                onChange={(e) => setBreakMinutes(Number(e.target.value) || 5)}
                disabled={isRunning}
                className="w-full px-4 py-2 rounded-xl border border-white/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Timer Clock Circle Container */}
      <div className="p-10 rounded-3xl bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-slate-900/90 text-white backdrop-blur-xl border border-indigo-500/30 shadow-2xl text-center space-y-8 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute inset-0 bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${mode === 'work' ? 'bg-indigo-500/30 text-indigo-200 border-indigo-400/30' : 'bg-emerald-500/30 text-emerald-200 border-emerald-400/30'}`}>
            {mode === 'work' ? `Session #${sessionCount + 1} • Focus Phase` : 'Break Time • Relax'}
          </span>
          <div className="text-6xl sm:text-7xl font-black tracking-wider font-mono">
            {formattedTime}
          </div>
        </div>

        {/* Controls */}
        <div className="relative z-10 flex items-center justify-center space-x-4">
          <button
            onClick={toggleTimer}
            className={`px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center space-x-2 ${
              isRunning
                ? "bg-amber-500 hover:bg-amber-400 text-slate-900"
                : "bg-white text-indigo-900 hover:bg-indigo-50"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start {mode === 'work' ? 'Focus' : 'Break'}</span>
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Completed sessions counter */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-center space-x-2 text-xs font-semibold text-indigo-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{sessionCount} Focus Sessions Completed Today</span>
        </div>
      </div>

      {/* Ambient Audio Selection */}
      <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-sm">
          <Headphones className="w-4 h-4 text-indigo-500" />
          <span>Ambient Study Atmosphere</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: "library", label: "Campus Library", desc: "Soft page turns" },
            { id: "rain", label: "Gentle Rain", desc: "Relaxing rainfall" },
            { id: "lofi", label: "Lo-Fi Beats", desc: "Chill study rhythm" },
            { id: "white", label: "White Noise", desc: "Pure focus frequency" },
          ].map((sound) => {
            const isActive = activeSound === sound.id;

            return (
              <button
                key={sound.id}
                onClick={() => setActiveSound(isActive ? null : sound.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isActive
                    ? "bg-indigo-50/80 dark:bg-indigo-950/80 border-indigo-500/60 ring-2 ring-indigo-500/30"
                    : "bg-white/50 dark:bg-slate-800/50 border-white/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <p className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{sound.label}</span>
                  {isActive && <Volume2 className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {sound.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
