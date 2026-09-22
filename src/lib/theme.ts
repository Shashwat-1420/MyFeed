import { vars } from 'nativewind';
import { useSavedFeedStore } from '../store/useSavedFeedStore';

/*
 * Semantic theme tokens (Phase A → RN port).
 *
 * The CSS variables consumed by tailwind.config.js
 *   bg-canvas bg-panel bg-chip · text-ink text-muted text-dim
 *   border-edge · text-gold
 * resolve to `rgb(var(--token) / <alpha-value>)`, so every token must be a
 * space-separated RGB triplet (that keeps opacity modifiers like bg-panel/90
 * working).
 *
 * On RN there is no :root, so we supply the values at runtime by applying
 * these `vars()` objects to the root <View> — driven by `darkMode` in the
 * store. On web the same inline CSS variables cascade exactly the same way,
 * so one source of truth works on both platforms.
 *
 * Brand: iQOO yellow #FFC800 on near-black #08080C.
 */

const DARK_VARS = {
  '--bg-primary': '8 8 12', // #08080C page background
  '--bg-secondary': '18 19 28', // #12131C cards, sheets, nav
  '--bg-tertiary': '26 28 43', // #1A1C2B chips, inputs, hovers
  '--border-strong': '46 46 46', // #2E2E2E input borders, dividers
  '--text-primary': '242 242 246', // #F2F2F6 headings
  '--text-secondary': '160 162 176', // #A0A2B0 subtitles
  '--text-tertiary': '98 100 120', // #626478 placeholders, inactive
  '--accent-fill': '255 200 0', // #FFC800 iQOO yellow fills (always + black text)
  '--accent-ink': '255 200 0', // #FFC800 yellow as text/border on dark
};

const LIGHT_VARS = {
  '--bg-primary': '245 245 240', // #F5F5F0
  '--bg-secondary': '255 255 255', // #FFFFFF
  '--bg-tertiary': '234 234 224', // #EAEAE0
  '--border-strong': '222 222 207', // #DEDECF
  '--text-primary': '13 14 18', // #0D0E12
  '--text-secondary': '94 96 110', // #5E606E
  '--text-tertiary': '136 138 156', // #888A9C
  '--accent-fill': '255 200 0', // #FFC800 same fill, still black text
  '--accent-ink': '138 106 0', // #8A6A00 — yellow darkened for readable text on light
};

export const darkTheme = vars(DARK_VARS);
export const lightTheme = vars(LIGHT_VARS);

export const themeVars = (isDark: boolean) => (isDark ? darkTheme : lightTheme);

/*
 * Resolved hex values for places className can't reach — notably
 * react-native-svg icon `color`/`fill` props (lucide-react-native icons).
 */
export const THEME = {
  dark: {
    gold: '#FFC800',
    goldFill: '#FFC800',
    ink: '#F2F2F6',
    muted: '#A0A2B0',
    dim: '#626478',
    edge: '#2E2E2E',
    canvas: '#08080C',
    panel: '#12131C',
    chip: '#1A1C2B',
    danger: '#F87171',
    black: '#000000',
  },
  light: {
    gold: '#8A6A00',
    goldFill: '#FFC800',
    ink: '#0D0E12',
    muted: '#5E606E',
    dim: '#888A9C',
    edge: '#DEDECF',
    canvas: '#F5F5F0',
    panel: '#FFFFFF',
    chip: '#EAEAE0',
    danger: '#DC2626',
    black: '#000000',
  },
};

export function useThemeColors() {
  const darkMode = useSavedFeedStore((s) => s.darkMode);
  return darkMode ? THEME.dark : THEME.light;
}