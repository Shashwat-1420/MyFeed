import { Category } from '../types/savedfeed';
import {
  Bot,
  Briefcase,
  Code,
  Cpu,
  FlaskConical,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  Newspaper,
  Palette,
  Rocket,
  Tag,
  Wallet,
  Zap,
} from 'lucide-react-native';

/*
 * Category metadata.
 *
 * Icons are lucide components rendered as flat monochrome glyphs. The app is
 * deliberately yellow / black / white only, so categories carry no colour of
 * their own — tinting is handled by the shared gold tokens.
 */
export const CATEGORIES: Record<Category, { label: string; icon: typeof Cpu }> = {
  technology: { label: 'Technology', icon: Cpu },
  ai_ml: { label: 'AI & ML', icon: Bot },
  programming: { label: 'Programming', icon: Code },
  design: { label: 'Design', icon: Palette },
  career: { label: 'Career', icon: Rocket },
  courses: { label: 'Courses', icon: GraduationCap },
  science: { label: 'Science', icon: FlaskConical },
  business: { label: 'Business', icon: Briefcase },
  finance: { label: 'Finance', icon: Wallet },
  health: { label: 'Health', icon: HeartPulse },
  productivity: { label: 'Productivity', icon: Zap },
  entertainment: { label: 'Entertainment', icon: Gamepad2 },
  news: { label: 'News', icon: Newspaper },
  uncategorized: { label: 'Other', icon: Tag },
};

export const CATEGORY_LIST = Object.entries(CATEGORIES).map(([id, info]) => ({
  id: id as Category,
  ...info,
}));