import React from 'react';
import { Image, Text, View } from 'react-native';
import { useThemeColors } from '../../lib/theme';

interface SaveThumbnailProps {
  uri?: string | null;
  /** Used for the monochrome placeholder initial (usually the domain). */
  label?: string | null;
  letterSize?: number;
}

/*
 * Save image with a monochrome fallback.
 *
 * Plenty of sources have no `og:image` (and blocked scrapes never do), so
 * rather than a random stock photo we show the domain's initial in gold on the
 * panel colour — consistent with the yellow/black/white theme.
 */
export const SaveThumbnail: React.FC<SaveThumbnailProps> = ({
  uri,
  label,
  letterSize = 20,
}) => {
  const c = useThemeColors();

  if (uri) {
    return <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />;
  }

  const initial =
    (label || '?').replace(/^www\./i, '').trim().charAt(0).toUpperCase() || '?';

  return (
    <View className="w-full h-full bg-panel items-center justify-center">
      <Text style={{ color: c.gold, fontSize: letterSize }} className="font-display font-bold">
        {initial}
      </Text>
    </View>
  );
};