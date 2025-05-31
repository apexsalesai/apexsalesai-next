"use client";
import { useEffect, useState } from "react";

interface TypewriterProps {
  words: string[];
  loop?: boolean;
  speed?: number;
  delay?: number;
  className?: string;
}

export default function Typewriter({ words, loop = true, speed = 60, delay = 1500, className = "" }: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentWord = words[wordIdx];
    if (!isDeleting) {
      if (charIdx < currentWord.length) {
        timeout = setTimeout(() => setCharIdx(charIdx + 1), speed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), delay);
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => setCharIdx(charIdx - 1), speed / 2);
      } else {
        setIsDeleting(false);
        setWordIdx((prev) => (prev + 1) % words.length);
      }
    }
    setDisplayed(currentWord.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, wordIdx, words, speed, delay]);

  useEffect(() => {
    setCharIdx(0);
    setIsDeleting(false);
  }, [wordIdx]);

  return <span className={className}>{displayed}<span className="animate-blink">|</span></span>;
}
