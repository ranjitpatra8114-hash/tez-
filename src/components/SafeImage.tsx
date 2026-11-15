import React, { useState } from 'react';
import { Film } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackLabel?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  style,
  fallbackLabel,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#090B12] text-slate-400 ${className}`}
        style={style}
        aria-label={alt}
      >
        <Film className="w-7 h-7 text-purple-400/70 mb-1.5" />
        {fallbackLabel && (
          <span className="text-xs font-medium text-slate-300 px-3 text-center truncate max-w-full">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      style={style}
    />
  );
};
