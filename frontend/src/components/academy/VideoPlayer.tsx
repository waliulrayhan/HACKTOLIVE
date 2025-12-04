"use client";

import { Box, IconButton, HStack, VStack, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { FaPlay, FaPause, FaVolumeUp, FaExpand, FaCompress } from "react-icons/fa";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export default function VideoPlayer({ videoUrl, title, onProgress, onComplete }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      
      if (onProgress && total > 0) {
        const progressPercent = (current / total) * 100;
        onProgress(progressPercent);
      }

      // Check if video is complete (within last 1 second)
      if (onComplete && total > 0 && current >= total - 1) {
        onComplete();
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.volume = value;
      setVolume(value);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Box
      ref={containerRef}
      position="relative"
      bg="black"
      borderRadius="lg"
      overflow="hidden"
      w="full"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        style={{ width: "100%", display: "block" }}
        onClick={togglePlay}
      />

      {/* Controls Overlay */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        bg="linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
        p="4"
      >
        <VStack spacing="2" align="stretch">
          {/* Progress Bar */}
          <Slider
            aria-label="video-progress"
            value={currentTime}
            max={duration}
            onChange={handleSeek}
            focusThumbOnChange={false}
          >
            <SliderTrack bg="whiteAlpha.300">
              <SliderFilledTrack bg="blue.500" />
            </SliderTrack>
            <SliderThumb boxSize="12px" />
          </Slider>

          {/* Control Buttons */}
          <HStack justify="space-between">
            <HStack spacing="2">
              {/* Play/Pause */}
              <IconButton
                aria-label={isPlaying ? "Pause" : "Play"}
                icon={isPlaying ? <FaPause /> : <FaPlay />}
                onClick={togglePlay}
                size="sm"
                colorScheme="whiteAlpha"
                variant="ghost"
                color="white"
              />

              {/* Time Display */}
              <Text color="white" fontSize="sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
            </HStack>

            <HStack spacing="2">
              {/* Volume Control */}
              <HStack spacing="2" w="100px">
                <FaVolumeUp color="white" />
                <Slider
                  aria-label="volume"
                  value={volume}
                  max={1}
                  step={0.1}
                  onChange={handleVolumeChange}
                  focusThumbOnChange={false}
                >
                  <SliderTrack bg="whiteAlpha.300">
                    <SliderFilledTrack bg="white" />
                  </SliderTrack>
                  <SliderThumb boxSize="10px" />
                </Slider>
              </HStack>

              {/* Fullscreen */}
              <IconButton
                aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                icon={isFullscreen ? <FaCompress /> : <FaExpand />}
                onClick={toggleFullscreen}
                size="sm"
                colorScheme="whiteAlpha"
                variant="ghost"
                color="white"
              />
            </HStack>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}
