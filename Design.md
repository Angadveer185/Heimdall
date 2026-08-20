# Design System Specification (`Design.md`)

This document defines the core visual language, design tokens, typography, color palettes, and UI component specifications for **Project Heimdall**. It outlines the styles, animations, responsive design rules, and visual guidelines required to build a premium, warm, human-centric, and accessible user experience across Light and Dark modes.

---

## 1. Visual Theme: Warm, Human-Centric NGO Platform

Project Heimdall combines the organic texture and warmth of community-focused design with clear operational logistics. The visual language emphasizes **community impact, mission clarity, user trust, and accessibility** suitable for connecting local shelters with community donors.

### Core Stylistic Pillars
- **Dual-Pane Contrast Layouts**: Heavy usage of a split visual layout. On desktop, one side displays a rich, dark ambient workspace (representing deep commitment & ongoing logistics) while the other displays clean, warm, high-contrast operational forms (representing actionable donor involvement).
- **Soft, Approachable Surfaces**: Replaces sharp, aggressive rectangular edges with soft radius scales (`rounded-xl`, `rounded-2xl`, `rounded-full`), creating an inviting, safe, and trustworthy atmosphere.
- **Warm Ambient Radiance**: Replaces cold matrix grid lines and technical crosshairs with soft, organic radial gradients (`bg-[radial-gradient(...)]`) and subtle background glow spots (`blur-2xl`, `blur-3xl`).
- **Diffuse Ambient Elevation**: Replaces hard, cartoonish offset shadows with soft, diffuse ambient shadows (`shadow-sm`, `shadow-md shadow-neo-sun/20`, `hover:shadow-lg`).
- **Trust & Impact Badging**: Strategic inclusion of soft pill badges (`rounded-full`), warm icon accents (`Heart`, `ShieldCheck`, `CheckCircle2`, `Lock`), and human-centric messaging.

---

## 2. Color Palette & Design Tokens

The color system utilizes CSS variables defined in [globals.css](file:///c:/Users/Angadveer%20Singh/Documents/heimdall/src/app/globals.css) to support seamless theme-switching. To ensure consistency across the application, developers must strictly use the variables mapped under Tailwind's `@theme` directive.

| Token | Light Mode Value | Dark Mode Value | Tailwind Class | Role / Usage in UI |
| :--- | :--- | :--- | :--- | :--- |
| `--color-neo-bg` | `#f4eee1` (Warm Rice Cream) | `#0f171e` (Slate Night Blue) | `bg-neo-bg` | Page canvas backgrounds. Underpins the overall organic, warm feel. |
| `--color-neo-ink` | `#2c251e` (Deep Warm Ink) | `#faf6ec` (Warm Rice White) | `text-neo-ink` | Primary body text, main headings, component borders. |
| `--color-neo-night` | `#0f171e` (Slate Night Blue) | `#080f14` (Deep Night Black) | `bg-neo-night` | Left sidebar background, footer branding background panels. |
| `--color-neo-sun` | `#cc4b2e` (Sun Crimson) | `#e57850` (Sunset Coral Red) | `text-neo-sun` | Active call-to-actions, primary buttons, error highlights, key links. |
| `--color-neo-gold` | `#cca352` (Amber Gold) | `#dfc07b` (Soft Amber Gold) | `text-neo-gold` | Timeline node paths, status indicators, secondary trust badges. |
| `--color-neo-rice` | `#faf6ec` (Warm Rice White) | `#17242d` (Slate Grey-Blue) | `bg-neo-rice` | Input field backgrounds, elevated surface cards, notice containers. |
| `--color-neo-line` | `#c2b29a` (Fine Sand Border) | `#424e58` (Slate Border Grey) | `border-neo-line` | Layout dividers, subtle component borders, secondary pill outlines. |
| `--color-neo-ash` | `#8c8273` (Warm Ash Grey) | `#73808b` (Muted Blue-Ash) | `text-neo-ash` | Secondary descriptions, disabled states, supporting metadata text. |

---

## 3. Typography Hierarchy

Fonts are loaded globally in [layout.tsx](file:///c:/Users/Angadveer%20Singh/Documents/heimdall/src/app/layout.tsx) via [fonts.ts](file:///c:/Users/Angadveer%20Singh/Documents/heimdall/src/lib/fonts.ts) and mapped directly to global class names. We maintain a warm contrast between geometric headers, serif paragraph copy, and subtle monospaced metadata.

| CSS Variable | Font Family | Tailwind Class | Application |
| :--- | :--- | :--- | :--- |
| `--font-heading` | `Chakra Petch` | `font-heading` | Page titles, hero section headers, primary buttons, section titles. |
| `--font-body` | `Zen Old Mincho` | `font-body` | Paragraph body copy, user input values, status messaging, helper copy. |
| `--font-label` | `Azeret Mono` | `font-label` | Metadata tags, code/ID values, system indicators where precision is needed. |

---

## 4. Auth & Forms Component Layout Specification

To ensure accessible, welcoming, and clean screens, all authentication and user forms must adhere to these precise guidelines:

### 4.1 Input Fields & Overlapping Prevention
- **Icon Padding Rule**: Form inputs with prepended Lucide icons must use strict, bulletproof padding constraints to prevent icon-text collisions:
  - Input field padding must be set to `paddingLeft: "2.75rem"` (or `pl-11` in Tailwind classes).
  - Prepended icon wrapper must be set to `absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50`.
- **Soft Border & Radius**: Inputs must feature soft rounded corners (`rounded-xl`), soft background (`bg-neo-rice`), subtle border (`border-neo-line/70`), and diffuse focus rings (`focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun`).
- **Form Layout**: Single-column layout (`space-y-5`) for authentication fields to ensure forms remain spacious, legible, and easy to complete.
- **Font Uniformity**: Input values, labels, and placeholders use `font-body` (Zen Old Mincho) or readable `font-heading` for clean, human-centered readability.

### 4.2 Buttons & Call-to-Actions
- **Primary Actions**: Solid primary accent button styled with rounded corners (`rounded-xl` or `rounded-full`), warm primary background (`bg-neo-sun hover:bg-neo-sun/90 text-neo-rice`), soft ambient shadow (`shadow-md shadow-neo-sun/20 hover:shadow-lg`), and font styling (`font-heading font-semibold text-sm py-3.5`).
- **Secondary Actions & Pill Buttons**: Secondary redirects (e.g. Sign Up link, theme toggle) use rounded pill shapes (`rounded-full`), soft background (`bg-neo-rice/80 hover:bg-neo-rice`), and fine subtle borders (`border border-neo-line/60`).

### 4.3 Notice & Alert Cards
- **Error & Warning Alerts**: Form alert boxes feature soft rounded corners (`rounded-xl`), soft background tinting (`bg-neo-sun/15 border-neo-sun/30 text-neo-sun`), and flex layout with icon alignment (`AlertCircle className="w-5 h-5 shrink-0 mt-0.5"`).

### 4.4 Trust Badges & Timeline Indicators
- **Community Badges**: Displayed using soft rounded pill containers (`rounded-full bg-neo-rice border border-neo-line/60 shadow-sm` or `bg-neo-sun/10 text-neo-sun`) paired with warm icons (`Heart`, `ShieldCheck`).
- **Timeline Stages**: Vertical timeline rails use soft borders (`border-l-2 border-neo-gold/30`), glowing rounded nodes (`w-3.5 h-3.5 rounded-full border-2 border-neo-gold bg-neo-night shadow-[0_0_10px_rgba(204,163,82,0.4)]`), and warm stage descriptions (*Stage 01 · Live Needs*, *Stage 02 · Reserved Impact*, *Stage 03 · Verified Handoff*).
- **Footer Security Indicators**: Displayed with clear, human-centric trust markers (`🔒 Protected by HttpOnly Session Cookies`, `Verified Non-Profit Network`).

---

## 5. Mobile & Tablet Responsiveness Rules

The interface must behave flawlessly on all viewport widths:

1. **Responsive Dual-Pane**:
   - Hide decorative side panels on smaller screens using Tailwind’s viewport utilities (`hidden lg:flex` for the left side view).
   - Ensure form containers scale cleanly to full width on mobile devices (`w-full max-w-xl mx-auto`), keeping generous touch targets and padding (`p-6 lg:p-12`).
2. **Typography Scaling**:
   - Headings scale gracefully for smaller viewports (`text-3xl lg:text-4xl`).
   - Muted descriptions remain highly readable (`text-xs` to `text-sm`) with generous line height (`leading-relaxed`).

---

## 6. Custom Scrollbars

To maintain visual harmony across browser environments:
- **Track**: Styled with the dynamic background color (`var(--color-neo-bg)`).
- **Handle (Thumb)**: Styled with the dynamic border color (`var(--color-neo-line)`) with solid border separation.
- **Hover State**: Switches color to Sun Crimson (`var(--color-neo-sun)`) upon active scrolling.
- **Cross-Browser Support**: Native Webkit scrollbar rules alongside Firefox's `scrollbar-color` properties.
