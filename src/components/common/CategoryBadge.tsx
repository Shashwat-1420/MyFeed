import React from 'react';
import { Pressable, Text } from 'react-native';
import { Category } from '../../types/savedfeed';
import { CATEGORIES } from '../../lib/categories';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
  showEmoji?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
  showEmoji = true,
  onClick,
  className = '',
}) => {
  const info = CATEGORIES[category] || CATEGORIES.uncategorized;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5',
  };

  return (
    <Pressable
      onPress={onClick}
      disabled={!onClick}
      style={{
        backgroundColor: `${info.color}25`, // opacity tint
        borderColor: `${info.color}50`,
      }}
      className={`self-start flex-row items-center rounded-full border ${sizeClasses[size]} ${
        onClick ? 'active:opacity-80' : ''
      } ${className}`}
    >
      {showEmoji && <Text className="mr-1 text-xs">{info.emoji}</Text>}
      <Text
        numberOfLines={1}
        style={{ color: info.color }}
        className="font-display tracking-wide uppercase font-bold"
      >
        {info.label}
      </Text>
    </Pressable>
  );
};