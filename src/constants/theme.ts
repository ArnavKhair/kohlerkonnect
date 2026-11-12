/**
 * Kohler Konnect design tokens.
 * Dark-only prototype. Palette is derived from the Figma references:
 * near-black background, layered dark cards, a per-room accent system
 * (Bathroom = blue, Kitchen = green), an amber energy ring, and clean
 * white / grey type on the iOS system font.
 */
import '@/global.css';

export const Colors = {
  // Surfaces
  background: '#050507',
  surface: '#141417',
  surfaceRaised: '#1C1C21',
  surfaceStroke: '#2A2A30',

  // Ink
  text: '#FFFFFF',
  textSecondary: '#9A9AA3',
  textMuted: '#5E5E66',
  textFaint: '#3A3A40',

  // Brand / accents
  primary: '#2E7BE8',
  primarySoft: '#2E7BE822',
  energy: '#F2A63C',
  energySoft: '#F2A63C22',
  success: '#36C279',
  warning: '#F2A63C',
  danger: '#E5564F',

  // Room accents
  room: {
    bathroom: '#3B82F6',
    kitchen: '#22A06B',
    energy: '#F2A63C',
    maintenance: '#8B8B93',
  },

  // Overlays / controls
  scrim: '#000000AA',
  controlFill: '#2A2A30',
  controlInactive: '#232328',
  ringTrack: '#26262B',
} as const;

export type Palette = typeof Colors;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
  seven: 64,
} as const;

export const Radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  full: 999,
} as const;

/** Type scale (iOS system font weights). */
export const Type = {
  display: { fontSize: 56, lineHeight: 62, fontWeight: '300' as const },
  hero: { fontSize: 40, lineHeight: 46, fontWeight: '600' as const },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
  heading: { fontSize: 20, lineHeight: 27, fontWeight: '600' as const },
  subheading: { fontSize: 17, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 17, lineHeight: 24, fontWeight: '400' as const },
  caption: { fontSize: 14, lineHeight: 19, fontWeight: '500' as const },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '600' as const },
} as const;

/** Spring presets tuned for 60fps on a 60Hz iPhone 15. */
export const Spring = {
  gentle: { damping: 20, stiffness: 120, mass: 0.9, restDisplacement: 0.001, restSpeed: 0.001 },
  standard: { damping: 16, stiffness: 180, mass: 0.8, restDisplacement: 0.001, restSpeed: 0.001 },
  snappy: { damping: 15, stiffness: 260, mass: 0.7, restDisplacement: 0.001, restSpeed: 0.001 },
} as const;

export type RoomId = 'bathroom' | 'kitchen' | 'energy' | 'maintenance';
