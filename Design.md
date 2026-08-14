# Design System Specification (`Design.md`)

This document defines the core visual language, design tokens, typography, color palettes, and UI component specifications for **Project Heimdall**. It outlines the styles, animations, responsive design rules, and visual guidelines required to build a premium, retro-futuristic, and ultra-smooth user experience across Light and Dark modes.

---

## 1. Visual Theme: Neo-Mirai Retro-Futurism

Project Heimdall utilizes the **Neo-Mirai** design aesthetic, combining a retro-futurist, warm, Japanese-inspired interface with high-contrast structures. The general feel merges the warmth of raw texture paper with the crisp operational mechanics of a 2040s logistics system.

### Core Stylistic Pillars
- **Dual-Pane Contrast Layouts**: Heavy usage of a split visual layout. On desktop, one side displays a dark visual workspace (representing deep night/ambient logistics) while the other displays the clean, high-contrast operational forms (representing structured data).
- **Structured Outlines**: Fine, crisp borders (`border-neo-line` or `1px solid`) instead of heavy, cartoonish borders, creating a delicate technical/schematic appearance.
- **Micro-Grain & Grid Textures**: The canvas background is styled with subtle grid lines (`neo-grid-bg`) and a faint simulated film grain (`film-grain`) to simulate tactile screens.
- **Japanese Accent Seal**: Strategic inclusion of circular or square red stamps/seals and vertical label orientations to accent panels.

---

## 2. Color Palette & Design Tokens

The color system utilizes CSS variables defined in [globals.css](file:///c:/Users/Angadveer%20Singh/Documents/heimdall/src/app/globals.css) to support seamless theme-switching. To ensure consistency across the application, developers must strictly use the variables mapped under Tailwind's `@theme` directive.

| Token | Light Mode Value | Dark Mode Value | Tailwind Class | Role / Usage in UI |
| :--- | :--- | :--- | :--- | :--- |
| `--color-neo-bg` | `#f4eee1` (Rice Paper Cream) | `#0f171e` (Slate Night Blue) | `bg-neo-bg` | Page canvas backgrounds. Underpins the overall retro feel. |
| `--color-neo-ink` | `#2c251e` (Deep Ink Black) | `#faf6ec` (Rice Paper White) | `text-neo-ink` | Major text elements, primary borders, high-contrast structures. |
| `--color-neo-night` | `#0f171e` (Slate Night Blue) | `#080f14` (Deep Night Black) | `bg-neo-night` | Left sidebar background, footer branding background panels. |
| `--color-neo-sun` | `#cc4b2e` (Sun Crimson) | `#e57850` (Sunset Coral Red) | `text-neo-sun` | Active call-to-actions, status alerts, error highlights, primary links. |
| `--color-neo-gold` | `#cca352` (Amber Gold) | `#dfc07b` (Soft Amber Gold) | `text-neo-gold` | Timeline node paths, status indicators, secondary badges. |
| `--color-neo-rice` | `#faf6ec` (Warm Rice White) | `#17242d` (Slate Grey-Blue) | `bg-neo-rice` | Card backgrounds, input fields, notice boxes. |
| `--color-neo-line` | `#c2b29a` (Fine Sand Border) | `#424e58` (Slate Border Grey) | `border-neo-line` | Layout dividers, component borders, outline buttons. |
| `--color-neo-ash` | `#8c8273` (Ash Grey) | `#73808b` (Muted Blue-Ash) | `text-neo-ash` | Secondary descriptions, disabled states, help tags. |

---

## 3. Typography Hierarchy

Fonts are loaded globally in [layout.tsx](file:///c:/Users/Angadveer%20Singh/Documents/heimdall/src/app/layout.tsx) via [fonts.ts](file:///c:/Users/Angadveer%20Singh/Documents/heimdall/src/lib/fonts.ts) and mapped directly to global class names. We maintain a playful contrast between technical monospaced elements, serif inputs, and geometric titles.

| CSS Variable | Font Family | Tailwind Class | Application |
| :--- | :--- | :--- | :--- |
| `--font-chakra-petch` | `Chakra Petch` | `font-heading` | Display titles, hero headers, primary buttons, structural labels. |
| `--font-zen-old-mincho` | `Zen Old Mincho` | `font-body` | Paragraph body copy, user input values, notice messages. |
| `--font-azeret-mono` | `Azeret Mono` | `font-label` | System tags, form input labels, validation messages, navigation menus. |

---

## 4. Auth & Forms Component Layout Specification

To prevent cluttered screens, bad alignment, and overlapping elements, all authentication pages (Login, Registration, etc.) must follow these precise spacing guidelines:

### 4.1 Input Fields & Overlapping Prevention
- **Icon Padding Rule**: Form inputs with prepended Lucide icons must use strict, bulletproof padding constraints to prevent icon-text collisions:
  - Input field padding must be set to `paddingLeft: "2.75rem"` (or `pl-11` in Tailwind classes).
  - Prepended icon wrapper must be set to `absolute inset-y-0 left-0 pl-3.5`.
- **Form Layout**: Avoid side-by-side grids on mobile. Utilize a single-column layout (`space-y-4` or `space-y-5`) for authentication fields to ensure forms remain readable and spacious.
- **Font Uniformity**: Input elements should use `font-body` (Zen Old Mincho) for placeholders and typed values, paired with `font-label` (Azeret Mono) for labels, tags, and helper texts.

### 4.2 Buttons
- **Submit Actions**: Solid primary accent button styled with `bg-neo-sun text-neo-rice font-label py-3 uppercase tracking-wider`. 
- **Transitions**: Smooth state transitions on active interactions (`transition-all duration-150 hover:opacity-90 active:translate-y-0.5`).

### 4.3 Notice & Alert Cards
- **Security Notice Boxes**: Informational panels must be styled as rounded-none, fine-line cards: `p-3 bg-neo-ash/10 border border-neo-line flex items-start gap-3`.

---

## 5. Mobile & Tablet Responsiveness Rules

The interface must behave flawlessly on all viewport widths (from mobile screens up to wide desktops).

1. **Responsive Dual-Pane**:
   - Hide decorative side panels on smaller screens using Tailwind’s viewport utilities (e.g. `hidden lg:flex` for the left side view).
   - Ensure the login/registration form scales to full width on mobile devices, centering in the viewport.
2. **Typography Scaling**:
   - Adjust page headings for smaller screens (`text-3xl md:text-5xl`).
   - Muted helper copy must remain legible: keep system labels above `text-xs` (minimum `12px`).

---

## 6. Custom Scrollbars

To maintain a consistent Neo-Mirai design theme across all browser environments:
- **Track**: Styled with the dynamic background color (`var(--color-neo-bg)`).
- **Handle (Thumb)**: Styled with the dynamic fine border color (`var(--color-neo-line)`) and separated from the track with a solid border margin.
- **Hover State**: Switches color to Sun Crimson (`var(--color-neo-sun)`) to indicate active scrolling.
- **Cross-Browser Styling**: Configured using standard Webkit scrollbar properties alongside Firefox's `scrollbar-color` properties.

