# Design System Specification (`Design.md`)

This document defines the core visual language, design tokens, typography, color palettes, and UI component specifications extracted from the design system style guide for both **Light Mode** and **Dark Mode**.

---

## 1. Color Palette & Design Tokens

The color system relies on four primary color roles, providing high contrast, functional clarity, and seamless adaptation across Light and Dark themes.

### Color Tokens

| Role | Color Name | Hex Code (Approx.) | Light Mode Usage | Dark Mode Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Primary** | Dark Slate / Charcoal | `#1E1E1E` | Dominant text, high-emphasis backgrounds, primary buttons | Card surfaces, container backgrounds |
| **Secondary** | Accent Red | `#D91818` | Primary brand accent, CTA highlights, active indicators | CTA highlights, active indicators, notifications |
| **Tertiary** | Deep Charcoal / Slate | `#2D2D2D` | Subdued containers, dark surfaces, borders | Elevated cards, secondary surface backgrounds |
| **Neutral** | Soft Light Grey | `#EAEAEA` | Main background, input fills, subtle card backgrounds | Inverted high-emphasis elements, contrast text |

---

## 2. Typography Hierarchy

The system utilizes three distinct typefaces to establish clear typographic hierarchy across editorial, body, and UI micro-copy applications.

| Token / Usage | Font Family | Style / Weight | Specimen | Application |
| :--- | :--- | :--- | :--- | :--- |
| **Headline** | `Bree Serif` | Serif / Bold | **Aa** | Page titles, section headers, hero statements |
| **Body** | `Open Sans` | Sans-Serif / Regular | **Aa** | Paragraph text, block quotes, general content, list items |
| **Label** | `Be Vietnam` | Sans-Serif / Medium | **Aa** | Buttons, form labels, captions, metadata, chip text |

---

## 3. UI Component Specifications

### 3.1 Buttons

The button system offers four distinct visual variants to support different visual hierarchies.

* **Primary Button**:
  * *Light Mode*: Solid Primary background (`#1E1E1E`) with Light text (`#EAEAEA`).
  * *Dark Mode*: Solid Neutral background (`#EAEAEA`) with Dark text (`#1E1E1E`).
* **Secondary Button**:
  * *Both Modes*: Solid Accent Red (`#D91818`) background with White text (`#FFFFFF`).
* **Inverted Button**:
  * *Light Mode*: Light Grey fill (`#EAEAEA`) with Dark text (`#1E1E1E`).
  * *Dark Mode*: Dark Slate fill (`#2D2D2D`) with Light text (`#EAEAEA`).
* **Outline Button**:
  * *Light Mode*: Transparent background with Dark Slate border (`1px solid #1E1E1E`).
  * *Dark Mode*: Transparent background with Light border (`1px solid #EAEAEA`).

---

### 3.2 Form Inputs & Search

* **Search Bar**:
  * Container with fully rounded / squircle corners.
  * *Background*: Light Grey (`#EAEAEA`) in Light Mode; Dark Charcoal (`#2D2D2D`) in Dark Mode.
  * *Icon*: Left-aligned search magnifier icon.
  * *Text*: Placeholder text "Search" in muted neutral tone.

---

### 3.3 Data Visualization & Indicators

* **Progress / Level Bars**:
  * Horizontal rounded tracks with filled indicator segments.
  * **Primary Bar**: Solid Primary fill showing standard completion.
  * **Secondary Bar**: Solid Accent Red fill showing key thresholds, alert states, or highlight metrics.
  * **Tertiary Bar**: Subdued fill tone for background or baseline progress.

---

### 3.4 Navigation & Icon Actions

* **Icon Containers & Navigation Bars**:
  * Grouped circular action containers (e.g., Home, Search).
  * Inverted highlight states for active items (e.g., solid white circular pill in Dark Mode for selected item).
* **Action Chips & Icon Buttons**:
  * **Square Icon Buttons**: Compact square containers featuring centered icons (e.g., Home icon).
  * **Labeled Chips**: Icon + Label pairing (e.g., Home Icon + "Label" text) inside a unified container.
  * **Circular Badge Clusters**:
    * Color-coded action circles in Primary Dark (`#1E1E1E`) and Accent Red (`#D91818`).
    * In Dark Mode, adapted with High-Contrast Light (`#EAEAEA`) and Accent Red (`#D91818`) options.

---

## 4. Theme Modes Comparison

### Light Theme Matrix
* **Canvas Background**: Light Grey / Off-White (`#EAEAEA`)
* **Card Container Surface**: Clean White (`#FFFFFF`) / Light Grey (`#F5F5F5`)
* **Primary Contrast Text**: `#1E1E1E`
* **Accent Color**: `#D91818`

### Dark Theme Matrix
* **Canvas Background**: Dark Slate / Almost Black (`#121212` / `#1A1A1A`)
* **Card Container Surface**: Deep Charcoal (`#222222`)
* **Primary Contrast Text**: `#EAEAEA` / `#FFFFFF`
* **Accent Color**: `#D91818`

---

## 5. Summary Guidelines

1. **Hierarchy**: Use `Bree Serif` for expressive title headlines, `Open Sans` for readable body content, and `Be Vietnam` for interactive UI microcopy.
2. **Accent Discipline**: Reserve the Accent Red (`#D91818`) for high-priority interactive elements, active states, and critical visual focal points.
3. **Theme Consistency**: Maintain consistent layout structure between Light and Dark modes while inverting container fills and typography contrast roles seamlessly.
