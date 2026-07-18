---
name: Symbiotic Intelligence
colors:
  surface: '#121416'
  surface-dim: '#121416'
  surface-bright: '#37393b'
  surface-container-lowest: '#0c0e10'
  surface-container-low: '#1a1c1e'
  surface-container: '#1e2022'
  surface-container-high: '#282a2c'
  surface-container-highest: '#333537'
  on-surface: '#e2e2e5'
  on-surface-variant: '#bbcbbb'
  inverse-surface: '#e2e2e5'
  inverse-on-surface: '#2f3133'
  outline: '#869486'
  outline-variant: '#3d4a3e'
  surface-tint: '#4ae183'
  primary: '#54e98a'
  on-primary: '#003919'
  primary-container: '#2ecc71'
  on-primary-container: '#005027'
  inverse-primary: '#006d37'
  secondary: '#92ccff'
  on-secondary: '#003351'
  secondary-container: '#3398db'
  on-secondary-container: '#002c47'
  tertiary: '#69e792'
  on-tertiary: '#00391a'
  tertiary-container: '#4bca78'
  on-tertiary-container: '#005127'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6bfe9c'
  primary-fixed-dim: '#4ae183'
  on-primary-fixed: '#00210c'
  on-primary-fixed-variant: '#005228'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#92ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#7efba4'
  tertiary-fixed-dim: '#61de8a'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#005228'
  background: '#121416'
  on-background: '#e2e2e5'
  surface-variant: '#333537'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  max-width: 1600px
---

## Brand & Style
The design system is engineered for the intersection of organic vitality and industrial precision. It targets a sophisticated B2B audience—agronomists, fleet operators, and enterprise farmers—who require a tool that feels as rugged as field hardware and as intelligent as a neural network.

The aesthetic direction is **Technical Minimalism**. It rejects decorative flourishes in favor of high-density data clarity and structural integrity. The interface serves as a "Mission Control" for the field, where "La tierra habla, el aire observa, la IA piensa y el hardware ejecuta." Visuals are characterized by deep, low-light surfaces that reduce eye strain during extended night monitoring, contrasted with vibrant, functionally-mapped colors that represent biological health and mechanical status.

## Colors
This design system utilizes a "Terra & Tech" palette designed for high-contrast legibility in both indoor offices and outdoor glare. 

- **Surfaces**: Deep Charcoal and Slate form the bedrock of the UI, creating a non-distracting environment for satellite imagery and data overlays.
- **Action & Health**: Vitality Green is reserved for primary actions and "Healthy" data states. NDVI Emerald is used specifically for plant health indices and secondary brand moments.
- **Telemetry & Status**: Telemetry Blue identifies sensors, drones, and connectivity data. Warning Amber and Critical Crimson are used strictly for environmental alerts and mechanical failures.
- **Overlays**: Map polygons use semi-transparent fills of the status colors (20% opacity) with 2px solid borders for boundary precision.

## Typography
Geist was selected for its geometric precision and technical "developer-friendly" clarity. It excels in data-heavy environments where distinguishing between characters (like '0' and 'O') is critical for sensor coordinates and telemetry.

- **Headlines**: Use tight tracking and semi-bold weights to convey authority.
- **Data Display**: Use the `data-mono` role for all numerical values, coordinates, and timestamps to ensure tabular alignment in dashboards.
- **Labels**: Small-caps are utilized for metadata categories to differentiate them from actionable body text.

## Layout & Spacing
The layout follows a strict **Fluid Grid** model with a 4px baseline rhythm to maintain technical alignment. 

- **Desktop**: 12-column grid. Sidebars are fixed at 280px to maximize the "Field View" (map/data area).
- **Mobile/Handheld**: 4-column grid. Designed for "one-handed field use," prioritizing large touch targets for buttons and status toggles.
- **Data Density**: Use a "Compact" spacing model for data tables (8px cell padding) and a "Spacious" model for insights and reports (24px+ padding) to improve executive readability.

## Elevation & Depth
In this design system, depth is communicated through **Tonal Layers** and **Low-Contrast Outlines** rather than traditional shadows. This ensures that the UI does not feel "mushy" and maintains its "field-ready" look.

- **Base Layer**: Deep Charcoal (#1A1C1E) for the main background.
- **Container Layer**: Slate (#2C3135) for cards and modules, featuring a 1px solid border (#383E44).
- **Active Overlay**: Elements like modals or floating map controls use a subtle backdrop blur (8px) and a slightly brighter border to appear "above" the satellite imagery.
- **Interaction**: Hover states are indicated by a 1px inner stroke of the primary or secondary color, simulating a mechanical "focus" state.

## Shapes
The shape language is **Soft (0.25rem)**. This provides a professional balance—sharp enough to feel like industrial equipment, but slightly rounded to ensure modern software approachability.

- **Standard Elements**: Buttons, input fields, and small cards use the `0.25rem` radius.
- **Data Containers**: Larger dashboard widgets use `0.5rem` (rounded-lg) to group complex data sets.
- **Status Indicators**: Circular indicators (pill-shaped) are reserved for "Online/Offline" status dots and tags to differentiate them from structural boxes.

## Components
- **Buttons**: Primary buttons are solid "Vitality Green" with black text for maximum contrast. Secondary buttons use the "Ghost" style with a 1px Slate border and white text.
- **Status Chips**: Used for device health. They must include both a color-coded dot (Healthy/Warning/Critical) and a label in `label-caps` for accessibility.
- **Map Overlays**: Polygon tooltips must be semi-transparent. Selected fields should have a "pulsing" 2px border in NDVI Emerald.
- **Input Fields**: Dark-themed inputs with a 1px border. On focus, the border shifts to Telemetry Blue with a subtle outer glow.
- **Telemetry Lists**: Monospaced font usage for all real-time sensor streams. Alternating row highlights (zebra striping) using #24282C for readability in high-density tables.
- **Device Icons**: Icons must be stroke-based (1.5px weight), representing hardware like drones, moisture sensors, and irrigation pivots with high geometric accuracy.