import React from 'react';
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
    sm: 'text-[10px] px-2 py-0.5 space-x-1',
    md: 'text-xs px-2.5 py-1 space-x-1.5',
    lg: 'text-sm px-3.5 py-1.5 space-x-2',
  };

  return (
    <span
      onClick={onClick}
      style={{
        backgroundColor: `${info.color}20`, // 15-20% opacity tint
        color: info.color,
        borderColor: `${info.color}35`,
      }}
      className={`inline-flex items-center font-medium rounded-full border transition-all duration-200 select-none ${
        sizeClasses[size]
      } ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''} ${className}`}
    >
      {showEmoji && <span>{info.emoji}</span>}
      <span className="truncate">{info.label}</span>
    </span>
  );
};
