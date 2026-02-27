import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface GalleryImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export default function GalleryImageWithFallback({ src, alt, className }: GalleryImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-100 ${className || ''}`}
        style={{ minHeight: '80px' }}
      >
        <ImageOff className="w-6 h-6 mb-1" style={{ color: '#dacc96' }} />
        <span className="text-xs text-gray-400">फोटो लोड नहीं हुई</span>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={`absolute inset-0 bg-gray-100 animate-pulse ${className || ''}`}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setIsLoading(false)}
        onError={() => { setHasError(true); setIsLoading(false); }}
        style={isLoading ? { opacity: 0 } : { opacity: 1 }}
      />
    </>
  );
}
