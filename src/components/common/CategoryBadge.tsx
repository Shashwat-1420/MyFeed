import React from 'react';
import { Pressable, Text } from 'react-native';
import { Category } from '../../types/savedfeed';
import { CATEGORIES } from '../../lib/categories';
import { useThemeColors } from '../../lib/theme';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  onClick?: () => void;
  className?: string;
}

/*
 * Monochrome category badge — gold on a translucent gold tint, in both themes.
 * Categories no longer carry individual colours (see src/lib/categories.ts).
 */
export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
  showIcon = true,
  onClick,
  className = '',
}) => {
  const c = useThemeColors();
  const info = CATEGORIES[category] || CATEGORIES.uncategorized;
  const Icon = info.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5',
  };
  const iconSize = size === 'sm' ? 10 : size === 'md' ? 12 : 14;

  return (
    <Pressable
      onPress={onClick}
      disabled={!onClick}
      className={`self-start flex-row items-center rounded-full border bg-gold/10 border-gold/30 ${
        sizeClasses[size]
      } ${onClick ? 'active:opacity-80' : ''} ${className}`}
    >
      {showIcon && <Icon size={iconSize} color={c.gold} style={{ marginRight: 4 }} />}
      <Text
        numberOfLines={1}
        style={{ color: c.gold }}
        className="font-display tracking-wide uppercase font-bold"
      >
        {info.label}
      </Text>
    </Pressable>
  );
};