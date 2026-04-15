import { ms, s, vs } from './responsive';

export const COLORS = {
  primary: '#AF1A5D',     // Snap Blue
  secondary: '#AF1A5D',   // Talk Orange
  brandPurple: 'gray', // Connector Purple
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1C1C1E',
  subtext: '#000000A6',
  border: '#E5E5EA',
  error: '#FF3B30',
  success: '#12ac4bff', // Keep WhatsApp success green

  // Brand Gradients based on Logo
  gradientPrimary: ['#00ADEE', '#007AFF'], // Blue gradient
  gradientTalk: ['#FF8C00', '#FFA500'],    // Orange gradient
  gradientSnap: ['#00ADEE', '#8A2BE2'],    // Blue to Purple
  brandGradient: ['#00ADEE', '#8A2BE2', '#FF8C00'], // Full Logo Spectrum
};

export const SPACING = {
  xs: s(4),
  s: s(8),
  m: s(16),
  l: s(24),
  xl: s(32),
};

export const RADIUS = {
  s: ms(8),
  m: ms(12),
  l: ms(16),
  xl: ms(24),
  round: 9999,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: ms(28),
    fontWeight: '700',
    color: COLORS.text,
  },
  h2: {
    fontSize: ms(22),
    fontWeight: '600',
    color: COLORS.text,
  },
  body: {
    fontSize: ms(16),
    fontWeight: '400',
    color: COLORS.secondary,
  },
  subtext: {
    fontSize: ms(14),
    fontWeight: '400',
    color: COLORS.subtext,
  },
  button: {
    fontSize: ms(16),
    fontWeight: '600',
  },
};