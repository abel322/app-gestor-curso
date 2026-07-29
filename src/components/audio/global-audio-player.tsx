"use client";

import React, { useMemo } from "react";
import { useAudio } from "@/context/audio-context";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Music, Disc, Sparkles, Download } from "lucide-react";

export function GlobalAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    duration,
    currentTime,
    volume,
    togglePlay,
    seek,
    setVolume,
  } = useAudio();

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Simulated waveform bar heights
  const waveformBars = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => {
      // Create pseudo-random visually realistic heights
      const seed = (i * 7 + 13) % 100;
      return Math.max(15, Math.min(100, Math.sin(i * 0.4) * 40 + seed * 0.6 + 20));
    });
  }, []);

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0f17]/95 backdrop-blur-xl border-t border-zinc-800/80 shadow-2xl px-4 py-3 text-zinc-100"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left Track Info */}
          <div className="flex items-center gap-3 w-full md:w-1/4 min-w-0">
            <div className="relative w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-700/60 overflow-hidden flex items-center justify-center shrink-0 shadow-glow">
              {currentTrack.image ? (
                <img
                  src={currentTrack.image}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music className="w-6 h-6 text-teal-400 animate-pulse" />
              )}
              {isPlaying && (
                <div className="absolute inset-0 bg-teal-500/20 backdrop-blur-[1px] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h4 className="font-semibold text-sm text-zinc-100 truncate flex items-center gap-2">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-zinc-400 truncate flex items-center gap-1.5 mt-0.5">
                <span className="inline-block px-1.5 py-0.5 text-[10px] uppercase tracking-wider rounded bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  {currentTrack.productType || "AUDIO PREVIEW"}
                </span>
                <span>{currentTrack.artist || "Producer Store"}</span>
              </p>
            </div>
          </div>

          {/* Center Playback & Waveform */}
          <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-teal-400 text-zinc-950 flex items-center justify-center hover:bg-teal-300 transition-transform active:scale-95 shadow-glow"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>
            </div>

            {/* Waveform & Scrubber */}
            <div className="w-full flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-400 w-10 text-right">
                {formatTime(currentTime)}
              </span>

              {/* Dynamic Waveform Visualization */}
              <div
                className="relative flex-1 h-8 flex items-center gap-[2px] cursor-pointer group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newPercent = clickX / rect.width;
                  seek(newPercent * duration);
                }}
              >
                {waveformBars.map((height, i) => {
                  const barPercent = (i / waveformBars.length) * 100;
                  const isPlayed = barPercent <= progressPercent;
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm transition-all duration-150 ${
                        isPlayed
                          ? "bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]"
                          : "bg-zinc-700/60 group-hover:bg-zinc-600"
                      }`}
                      style={{
                        height: isPlaying && isPlayed ? `${Math.max(25, height)}%` : `${height * 0.7}%`,
                      }}
                    />
                  );
                })}
              </div>

              <span className="text-xs font-mono text-zinc-400 w-10">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right Volume & Action */}
          <div className="flex items-center justify-end gap-4 w-full md:w-1/4">
            <div className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200">
              <button
                onClick={() => setVolume(volume === 0 ? 0.85 : 0)}
                aria-label="Mute"
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-zinc-400" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 accent-teal-400 bg-zinc-800 rounded cursor-pointer"
              />
            </div>

            {currentTrack.price !== undefined && (
              <a
                href={`/store`}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-teal-300 text-xs font-medium border border-teal-500/30 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span>${currentTrack.price}</span>
              </a>
            )}
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
