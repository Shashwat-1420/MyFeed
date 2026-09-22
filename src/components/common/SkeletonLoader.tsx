import React from 'react';
import { View } from 'react-native';

interface SkeletonLoaderProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
}

/*
 * NOTE: the web build animated this with a CSS `@keyframes shimmer`, which RN
 * has no equivalent for. The base chip colour still renders as a placeholder;
 * a real Animated shimmer can be layered in later without changing call sites.
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  width,
  height,
  borderRadius = 12,
}) => {
  return (
    <View
      style={{
        width: width as any,
        height: height as any,
        borderRadius,
      }}
      className={`bg-chip border border-edge/40 ${className}`}
    />
  );
};