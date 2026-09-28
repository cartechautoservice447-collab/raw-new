/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        "code-bg": "var(--code-bg)",
        "code-fg": "var(--code-fg)",
        "code-keyword": "var(--code-keyword)",
        "code-function": "var(--code-function)",
        "code-variable": "var(--code-variable)",
        "code-string": "var(--code-string)",
        "code-comment": "var(--code-comment)",
      },
      fontFamily: {
        sans: ["var(--ui-font)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-mono)", "'Fira Code'", "'JetBrains Mono'", "Consolas", "monospace"],
      },
      transitionDuration: {
        180: "180ms",
        240: "240ms",
      },
      animation: {
        "pulse-glow": "pulse-glow 3.6s ease-in-out infinite",
        "panel-in": "panel-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) both",
        "card-in": "card-in 0.24s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-swap": "fade-swap 0.2s cubic-bezier(0.16, 1, 0.3, 1) both",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.95" },
        },
        "panel-in": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.992)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "card-in": {
          "0%": { opacity: "0", transform: "translateY(6px) scale(0.995)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "fade-swap": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "caret-blink": {
          "0%, 70%, 100%": { opacity: "1" },
          "20%, 50%": { opacity: "0" },
        },
        "accordion-down": {
          "from": { height: "0" },
          "to": { height: "var(--radix-accordion-content-height, auto)" },
        },
        "accordion-up": {
          "from": { height: "var(--radix-accordion-content-height, auto)" },
          "to": { height: "0" },
        },
      },
    },
  },
  plugins: [],
};
