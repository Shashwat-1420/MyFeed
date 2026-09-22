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
      className={`animate-shimmer bg-chip border border-edge/40 ${className}`}
    />
  );
};
