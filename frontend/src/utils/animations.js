/**
 * Shared animation variants for framer-motion.
 * Use these to keep transitions consistent across the app.
 * Duration: 250–350ms for micro-interactions (ui-ux-pro-max guideline).
 */

/** Standard ease curve — feels snappy but natural */
const ease = [0.22, 1, 0.36, 1];

/** Fade + slide up — use for page sections and cards */
export const fadeUp = {
  initial:  { opacity: 0, y: 20 },
  animate:  { opacity: 1, y:  0 },
  exit:     { opacity: 0, y: 10 },
  transition: { duration: 0.3, ease },
};

/** Fade + slide up — slower, for full-page heroes */
export const fadeUpSlow = {
  initial:  { opacity: 0, y: 30 },
  animate:  { opacity: 1, y:  0 },
  transition: { duration: 0.6, ease },
};

/** Fade only — simple in/out */
export const fadeIn = {
  initial:  { opacity: 0 },
  animate:  { opacity: 1 },
  exit:     { opacity: 0 },
  transition: { duration: 0.25 },
};

/** Scale pop — use for badges, chips, modals */
export const scalePop = {
  initial:  { opacity: 0, scale: 0.9 },
  animate:  { opacity: 1, scale: 1 },
  exit:     { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease },
};

/** Collapse — use for accordions and mobile menus */
export const collapse = {
  initial:  { opacity: 0, height: 0 },
  animate:  { opacity: 1, height: 'auto' },
  exit:     { opacity: 0, height: 0 },
  transition: { duration: 0.25, ease: 'easeInOut' },
};

/** Stagger container — apply to parent list */
export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

/** Stagger child — apply to each list item */
export const staggerItem = {
  initial:  { opacity: 0, y: 16 },
  animate:  { opacity: 1, y:  0 },
  transition: { duration: 0.3, ease },
};

/** Hover lift — spread into motion element props */
export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2 } },
  whileTap:   { scale: 0.97 },
};

/** Button press */
export const buttonPress = {
  whileHover: { scale: 1.03 },
  whileTap:   { scale: 0.97 },
};
