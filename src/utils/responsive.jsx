/**
 * Responsive Scaling Utility
 *
 * Provides short aliases for react-native-responsive-dimensions functions
 * plus percentage-based width/height helpers.
 *
 * Usage:
 *   import { s, vs, ms, wp, hp } from '../utils/responsive';
 *
 *   s(16)          → responsiveWidth scaling
 *   vs(16)         → responsiveHeight scaling
 *   ms(16)         → moderate scaling (fonts, radii, icons)
 *   wp(50)         → 50% of screen width
 *   hp(50)         → 50% of screen height
 */
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from 'react-native-responsive-dimensions';

// Base dimensions from a standard design (e.g., iPhone 11/13/14/15)
const GUIDELINE_BASE_WIDTH = 375;
const GUIDELINE_BASE_HEIGHT = 812;

/**
 * Horizontal scaling
 * @param {number} size - Size in logical pixels
 */
export const s = (size) => responsiveWidth((size / GUIDELINE_BASE_WIDTH) * 100);

/**
 * Vertical scaling
 * @param {number} size - Size in logical pixels
 */
export const vs = (size) => responsiveHeight((size / GUIDELINE_BASE_HEIGHT) * 100);

/**
 * Moderate scaling for fonts and icons
 * Uses a moderate factor to prevent too much scaling on large screens
 * @param {number} size - Size in logical pixels
 * @param {number} factor - Moderation factor (default 0.5)
 */
export const ms = (size, factor = 0.5) => {
    const scale = s(size);
    return size + (scale - size) * factor;
};

// Percentage-based helpers
export const wp = (percentage) => responsiveWidth(percentage);
export const hp = (percentage) => responsiveHeight(percentage);

// Re-exporting for compatibility if needed
export { responsiveWidth as rw, responsiveHeight as rh, responsiveFontSize as rf };