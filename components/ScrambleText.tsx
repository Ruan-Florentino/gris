import React, { useState, useEffect } from 'react';

interface ScrambleTextProps {
  text: string;
  className?: string;
}

const CHARS = '█▓▒░<>-_\\/[]{}—=+*^?#_';

export function ScrambleText({ text, className = '' }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let iteration = 0;
    const maxIterations = 10;
    
    const interval = setInterval(() => {
      setDisplayText(prev => {
        return text
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');
      });
      
      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
      }
      
      iteration += text.length / maxIterations;
    }, 30); // 30ms * 10 = 300ms total duration

    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayText}</span>;
}
