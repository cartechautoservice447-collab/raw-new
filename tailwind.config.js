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
      animation: {
        "pulse-glow": "pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "panel-in": "panel-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "card-in": "card-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-swap": "fade-swap 0.25s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 color-mix(in oklab, var(--primary) 45%, transparent)" },
          "50%": { boxShadow: "0 0 26px 4px color-mix(in oklab, var(--primary) 28%, transparent)" },
        },
        "panel-in": {
          "0%": { opacity: "0", transform: "translateY(14px) scale(0.995)" },
          "100%": { opacity: "1", transform: "none" },
        },
        "card-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "none" },
        },
        "fade-swap": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "none" },
        },
      },
    },
  },
  plugins: [],
};
