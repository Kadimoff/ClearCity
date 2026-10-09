'use client';

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

interface HeroTypewriterProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

export const HeroTypewriter: React.FC<HeroTypewriterProps> = ({
  phrases,
  typingSpeed = 120,    // Decreased speed for natural, comfortable reading
  deletingSpeed = 55,   // Smooth deleting pace
  pauseTime = 3200,     // Generous pause so users can read the sentence
}) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const cursorRef = useRef<HTMLSpanElement>(null);

  // GSAP cursor pulse animation
  useEffect(() => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
      });
    }
  }, []);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;

    const fullText = phrases[currentPhraseIndex % phrases.length];

    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (currentText.length < fullText.length) {
        timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing phrase, pause before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length - 1));
        }, deletingSpeed);
      } else {
        // Finished deleting, move to next phrase
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex, phrases, typingSpeed, deletingSpeed, pauseTime]);

  // Reset if language or phrases change
  useEffect(() => {
    setCurrentText('');
    setIsDeleting(false);
    setCurrentPhraseIndex(0);
  }, [phrases]);

  return (
    <span className="inline-block relative">
      <span className="neon-gradient-text font-black">{currentText}</span>
      <span
        ref={cursorRef}
        className="inline-block w-1 sm:w-1.5 h-8 sm:h-12 md:h-14 ml-1 bg-indigo-500 align-middle rounded-sm shadow-neon-indigo"
      />
    </span>
  );
};
