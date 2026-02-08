"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  HiOutlinePlay,
  HiOutlinePause,
  HiOutlineVolumeUp,
  HiOutlineVolumeOff,
  HiOutlineArrowsExpand,
} from "react-icons/hi";

interface NativeYouTubePlayerProps {
  url: string;
}

/**
 * Custom YouTube video player using react-player **v3** API.
 *
 * v3 breaking changes from v2 that this file accounts for:
 *  - `src` prop instead of `url`
 *  - `config.youtube` is flat (no `playerVars` wrapper)
 *  - ref forwards to the underlying HTMLVideoElement / web-component
 *  - native HTML-video events (onTimeUpdate, onDurationChange …)
 *  - `playing`, `volume`, `muted` props are still handled by v3's Player wrapper
 */
export default function NativeYouTubePlayer({ url }: NativeYouTubePlayerProps) {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamically imported ReactPlayer (client-only, avoids SSR issues)
  const [PlayerComponent, setPlayerComponent] =
    useState<React.ComponentType<any> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [played, setPlayed] = useState(0); // 0 – 1
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [seeking, setSeeking] = useState(false);
  const [buffered, setBuffered] = useState(0); // 0 – 1
  const [hasError, setHasError] = useState(false);

  // ── Load react-player on the client ──────────────────────────────
  useEffect(() => {
    import("react-player").then((mod) => {
      setPlayerComponent(() => mod.default);
    });
  }, []);

  // ── Fallback: detect when the youtube iframe is actually rendered ─
  useEffect(() => {
    if (!PlayerComponent || ready) return;

    // Poll for an <iframe> inside the container (youtube-video-element renders one)
    const interval = setInterval(() => {
      if (!containerRef.current) return;
      const iframe = containerRef.current.querySelector("iframe");
      if (iframe) {
        setReady(true);
        setHasError(false);
        clearInterval(interval);
      }
    }, 300);

    // Hard fallback – assume ready after 4 s even if we didn't spot the iframe
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!ready) {
        setReady(true);
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [PlayerComponent, ready]);

  // ── Auto-hide controls after 3 s of inactivity ──────────────────
  useEffect(() => {
    if (playing && showControls) {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [playing, showControls]);

  // ── Event handlers ───────────────────────────────────────────────
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
  }, []);

  const handlePlayPause = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  /** Native `timeupdate` – track played fraction */
  const handleTimeUpdate = useCallback(() => {
    if (seeking) return;
    const el = playerRef.current;
    if (el && el.duration) {
      setPlayed(el.currentTime / el.duration);
    }
  }, [seeking]);

  /** Native `durationchange` – store duration in seconds */
  const handleDurationChange = useCallback(() => {
    const el = playerRef.current;
    if (el && Number.isFinite(el.duration)) {
      setDuration(el.duration);
    }
  }, []);

  /** Native `progress` – buffered fraction */
  const handleBufferProgress = useCallback(() => {
    const el = playerRef.current;
    if (el && el.buffered && el.buffered.length > 0 && el.duration) {
      setBuffered(el.buffered.end(el.buffered.length - 1) / el.duration);
    }
  }, []);

  const handleSeekMouseDown = useCallback(() => {
    setSeeking(true);
  }, []);

  const handleSeekChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPlayed(parseFloat(e.target.value));
    },
    []
  );

  const handleSeekMouseUp = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      setSeeking(false);
      const fraction = parseFloat((e.target as HTMLInputElement).value);
      const el = playerRef.current;
      if (el && el.duration) {
        el.currentTime = fraction * el.duration;
      }
    },
    []
  );

  const handleSeekClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressBarRef.current) return;
      const bounds = progressBarRef.current.getBoundingClientRect();
      const fraction = (e.clientX - bounds.left) / bounds.width;
      setPlayed(fraction);
      const el = playerRef.current;
      if (el && el.duration) {
        el.currentTime = fraction * el.duration;
      }
    },
    []
  );

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      setVolume(v);
      setMuted(v === 0);
    },
    []
  );

  const handleToggleMute = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  const handleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  const handleReady = useCallback(() => {
    setReady(true);
    setHasError(false);
  }, []);

  const handleError = useCallback((...args: any[]) => {
    console.error("YouTube player error:", ...args);
    setHasError(true);
  }, []);

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* ── React Player (YouTube via youtube-video-element) ───── */}
      {PlayerComponent && (
        <PlayerComponent
          ref={(node: any) => {
            playerRef.current = node;
          }}
          src={url}
          playing={playing}
          volume={volume}
          muted={muted}
          width="100%"
          height="100%"
          onReady={handleReady}
          onLoadStart={handleReady}
          onLoadedData={handleReady}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          onProgress={handleBufferProgress}
          onError={handleError}
          onEnded={() => setPlaying(false)}
          config={{
            youtube: {
              rel: 0,
              fs: 0,
              iv_load_policy: 3,
              disablekb: 1,
            },
          }}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      )}

      {/* ── Play / Pause Overlay (Centre) ────────────────────────── */}
      <div
        className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
        onClick={handlePlayPause}
      >
        {!playing && ready && (
          <div className="bg-black/60 rounded-full p-6 backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110">
            <HiOutlinePlay className="w-16 h-16 text-white" />
          </div>
        )}
      </div>

      {/* ── Custom Controls ──────────────────────────────────────── */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/70 to-transparent p-4 transition-opacity duration-300 z-20 ${
          showControls || !playing
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Progress Bar */}
        <div
          ref={progressBarRef}
          className="w-full h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer group/progress relative"
          onClick={handleSeekClick}
        >
          {/* Buffered */}
          <div
            className="absolute h-full bg-white/30 rounded-full transition-all"
            style={{ width: `${buffered * 100}%` }}
          />
          {/* Played */}
          <div
            className="absolute h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${played * 100}%` }}
          />
          {/* Scrubber */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity"
            style={{ left: `${played * 100}%`, marginLeft: "-6px" }}
          />
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Play / Pause */}
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-green-400 transition-colors"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <HiOutlinePause className="w-6 h-6" />
              ) : (
                <HiOutlinePlay className="w-6 h-6" />
              )}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={handleToggleMute}
                className="text-white hover:text-green-400 transition-colors"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted || volume === 0 ? (
                  <HiOutlineVolumeOff className="w-6 h-6" />
                ) : (
                  <HiOutlineVolumeUp className="w-6 h-6" />
                )}
              </button>
              <div className="w-0 opacity-0 group-hover/volume:w-20 group-hover/volume:opacity-100 transition-all overflow-hidden">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>

            {/* Time */}
            <div className="text-white text-sm font-medium">
              {formatTime(played * duration)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              className="text-white hover:text-green-400 transition-colors"
              aria-label="Fullscreen"
            >
              <HiOutlineArrowsExpand className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Loading Indicator ────────────────────────────────────── */}
      {!ready && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
        </div>
      )}

      {/* ── Error State ──────────────────────────────────────────── */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30 gap-3">
          <p className="text-white text-sm">Failed to load video</p>
          <button
            onClick={() => {
              setHasError(false);
              setReady(false);
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
