import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  width,
  height,
  borderRadius = '12px',
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
      }}
      className={`animate-shimmer bg-[#1A1A1A] border border-[#2E2E2E]/40 ${className}`}
    />
  );
};
