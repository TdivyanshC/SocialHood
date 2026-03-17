"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const videos = [
  {
    id: 1,
    title: "Brand Story",
    description: "Your story, beautifully told",
    videoUrl: "/videos/reel1.mp4",
    duration: "0:30",
    likes: "12.5K",
  },
  {
    id: 2,
    title: "Product Showcase",
    description: "Showcase your products professionally",
    videoUrl: "/videos/reel2.mp4",
    duration: "0:45",
    likes: "8.2K",
  },
  {
    id: 3,
    title: "Testimonials",
    description: "Let your customers speak for you",
    videoUrl: "/videos/reel3.mp4",
    duration: "0:58",
    likes: "15.8K",
  },
];

export default function Studio() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const handlePlay = (index: number) => {
    // Stop all other videos
    videoRefs.current.forEach((video, i) => {
      if (video && i !== index) {
        video.pause();
        video.currentTime = 0;
      }
    });
    
    // Play or pause the clicked video
    const video = videoRefs.current[index];
    if (video) {
      if (playingIndex === index) {
        video.pause();
        setPlayingIndex(null);
      } else {
        video.play();
        setPlayingIndex(index);
      }
    }
  };

  // Handle video ended
  const handleVideoEnded = () => {
    setPlayingIndex(null);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".studio-header",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".reel-card",
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".reels-container",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 bg-black relative overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-500/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-l from-pink-500/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="studio-header text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs text-white font-medium">
              New
            </span>
          </div>
          <p className="text-xs tracking-[0.3em] text-[#00ff41] uppercase mb-4 font-body">
            Content Studio
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">
            AI-Powered{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Short-Form
            </span>{' '}
            Videos
          </h2>
          <p className="text-white/50 text-sm max-w-2xl mx-auto font-body">
            Create scroll-stopping Reels & Shorts in minutes. Professional AI-generated videos 
            optimized for Instagram, TikTok & YouTube. Paste your content, get viral-ready videos.
          </p>
        </div>

        {/* Reels Grid - Vertical Phone Format */}
        <div className="reels-container grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="reel-card group relative"
            >
              {/* Phone Frame */}
              <div 
                className="relative w-[280px] md:w-[300px] aspect-[9/16] bg-black rounded-[2.5rem] border-4 border-white/10 overflow-hidden shadow-2xl group-hover:border-[#00ff41]/30 transition-all duration-500 group-hover:shadow-[#00ff41]/20 cursor-pointer"
                onClick={() => handlePlay(index)}
              >
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20" />

                {/* Video element */}
                <video
                  ref={(el) => { videoRefs.current[index] = el; }}
                  src={video.videoUrl}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  onEnded={handleVideoEnded}
                />

                {/* Top overlay with time */}
                <div className="absolute top-12 left-0 right-0 px-4 flex justify-between items-center z-10">
                  <span className="text-white/80 text-xs font-medium px-2 py-1 bg-black/40 rounded">
                    {video.duration}
                  </span>
                </div>

                {/* Center play button - only show when not playing */}
                {playingIndex !== index && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00ff41]/20 transition-all duration-300">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Right side interactions (Reels style) */}
                <div className="absolute right-4 bottom-24 flex flex-col items-center gap-4 z-10">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
                    <span className="text-white text-xs mt-1">{video.likes}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <span className="text-white text-xs mt-1">1.2K</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </div>
                    <span className="text-white text-xs mt-1">Share</span>
                  </div>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-4 left-4 right-16 z-10">
                  <p className="text-white text-sm font-medium mb-1">@{video.title.toLowerCase().replace(' ', '')}</p>
                  <p className="text-white/70 text-xs line-clamp-2">{video.description}</p>
                </div>
              </div>

              {/* Video title below phone */}
              <div className="text-center mt-6">
                <h3 className="font-display text-lg mb-1 text-white group-hover:text-[#00ff41] transition-colors">
                  {video.title}
                </h3>
                <p className="font-body text-sm text-white/40">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-medium text-sm tracking-wide hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300">
            Create Your Reel →
          </button>
          <p className="text-white/30 text-xs mt-4 font-body">
            More templates coming soon
          </p>
        </div>
      </div>
    </section>
  );
}
