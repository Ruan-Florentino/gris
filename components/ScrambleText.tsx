import React, { useState, useEffect, useRef } from 'react';

interface ScrambleTextProps {
  text: string;
  className?: string;
}

const CHARS = '0123456789ABCDEF.-_';

export function ScrambleText({ text, className = '' }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const textRef = useRef(text);
  const isAnimating = useRef(false);

  useEffect(() => {
    // If it's updating very rapidly, just update the final text directly
    // and skip the animation if we are already animating.
    if (isAnimating.current && text !== textRef.current) {
       textRef.current = text;
       return; // Already animating, let the interval pick up the new text
    }

    textRef.current = text;
    isAnimating.current = true;
    let iteration = 0;
    const maxIterations = 10;
    
    const interval = setInterval(() => {
      setDisplayText(() => {
        return textRef.current
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return textRef.current[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');
      });
      
      if (iteration >= textRef.current.length) {
        clearInterval(interval);
        setDisplayText(textRef.current);
        isAnimating.current = false;
      }
      
      iteration += Math.max(1, textRef.current.length / maxIterations);
    }, 30);

    return () => {
      clearInterval(interval);
      isAnimating.current = false;
    };
  }, [text]);

  return <span className={className}>{displayText}</span>;
}
