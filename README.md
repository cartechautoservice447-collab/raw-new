# Glass Notes — Markdown Notes with GitHub Dark Code

An ultra-premium glassmorphism note-taking workspace recreated faithfully from [amithnotesaver.lovable.app](https://amithnotesaver.lovable.app/).

## ✨ Features

- **Fluid Glassmorphism UI**: Dynamic backdrop blurs, specular highlights, hairline borders, and layered diffuse shadows.
- **Liquid Glass Physics Engine**: SVG-based dynamic refraction (`feTurbulence`, `feGaussianBlur`, `feDisplacementMap`) with Apple-style fluid glass physics, specular highlights, and real-time bounce physics.
- **Course Folders & Collections**:
  - Dashboard overview of course folders with live note counters, category badges, and last edited timestamps.
  - Multi-level sub-collections and notes hierarchy (e.g. CS50P — Python, Lecture 0, Lecture 1, Web Development).
  - Add & delete courses with full cascade note deletion and confirmation modals.
- **Markdown Editor & GitHub Dark Syntax Highlighting**:
  - Live markdown preview with GitHub Dark theme token styling (`#0d1117` background, coral keywords, lavender functions, ice blue strings and variables).
  - Formatting toolbar: Bold (`**`), Italic (`_`), Inline Code (`` ` ``), Markdown Link (`[label](url)`), and Python code block insertion.
  - Focus Mode: Fullscreen distraction-free writing canvas with floating "Exit Focus Mode" pill control.
  - Instant debounced auto-saving to browser `localStorage`.
- **Search & Filtering**:
  - Instant search across note titles and content bodies.
  - Quick filters: "All Notes", "Favorites" (with gold star toggle), and individual collection views.
- **Engine Customization Modal**:
  - **Color Themes**: Original (deep indigo glass), Dark (obsidian glass), and White / Light (crystalline frosted glass).
  - **Glass Quality Presets**: Low, Medium, High, Ultra, or Custom with fine-grained sliders for Glass blur, Transparency, and Thickness.
  - **Liquid Glass Physics**: Sliders for Liquid density, Transparency, Clearness, Gel, and Bounce (with live stiffness & damping calculations).
  - **Motion & Fluidity**: 4 motion scales (Low, Medium, High, Ultra) with spring curves.
  - **Typography**: Inter, System Sans, and JetBrains Mono with controls for UI font size/line height and Editor font size/line height.
- **Authentication**:
  - Google Sign-In and Email/Password Sign-Up & Log-In.
  - Instant Guest / Demo mode for quick exploration.

## 🚀 Running the Project

```bash
# Start development server
npm run dev

# Or build for production
npm run build

# Preview production build
npm run preview
```
