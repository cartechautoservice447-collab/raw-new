import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CustomizationSettings, GlassPreset, ThemeMode, MotionPreset, UIFont } from '../types';

export const GLASS_PRESETS: Record<Exclude<GlassPreset, 'custom'>, { glassBlur: number; glassOpacity: number; glassThickness: number }> = {
  low: { glassBlur: 0, glassOpacity: 70, glassThickness: 0.5 },
  medium: { glassBlur: 8, glassOpacity: 45, glassThickness: 1 },
  high: { glassBlur: 18, glassOpacity: 32, glassThickness: 1.5 },
  ultra: { glassBlur: 28, glassOpacity: 22, glassThickness: 2.5 },
};

export const UI_FONTS: Record<UIFont, string> = {
  inter: '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ui-sans-serif, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", "Consolas", ui-monospace, monospace',
};

export const MOTION_SCALES: Record<MotionPreset, number> = {
  low: 0,
  medium: 0.7,
  high: 1,
  ultra: 1.25,
};

export const DEFAULT_SETTINGS: CustomizationSettings = {
  theme: 'original',
  glassPreset: 'high',
  ...GLASS_PRESETS.high,
  motion: 'high',
  uiFont: 'inter',
  uiFontSize: 15,
  uiLineHeight: 1.55,
  editorFontSize: 14,
  editorLineHeight: 1.8,
  liquidGlassEnabled: false,
  liquidDensity: 20,
  liquidTransparency: 55,
  liquidClearness: 55,
  liquidGel: 50,
  liquidBounce: 55,
};

const STORAGE_KEY = 'glass-notes:customization:v1';

export function calculateBounceSpring(bounce: number) {
  const t = Math.min(100, Math.max(0, bounce)) / 100;
  return {
    stiffness: 100 + t * 400,
    damping: 40 - t * 30,
  };
}

interface CustomizationContextType {
  settings: CustomizationSettings;
  update: (partial: Partial<CustomizationSettings>) => void;
  applyGlassPreset: (preset: Exclude<GlassPreset, 'custom'>) => void;
  reset: () => void;
}

const CustomizationContext = createContext<CustomizationContextType | null>(null);

function getInitialSettings(): CustomizationSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export const CustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CustomizationSettings>(getInitialSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (err) {
        console.error('Failed to save settings to localStorage', err);
      }
    }
  }, [settings, hydrated]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--glass-blur', `${settings.glassBlur}px`);
    root.style.setProperty('--glass-alpha', `${settings.glassOpacity / 100}`);
    root.style.setProperty('--glass-border-w', `${settings.glassThickness}px`);
    root.style.setProperty('--glass-depth', `${settings.glassThickness}`);
    root.style.setProperty('--motion-scale', `${MOTION_SCALES[settings.motion]}`);
    root.style.setProperty('--ui-font', UI_FONTS[settings.uiFont]);
    root.style.setProperty('--ui-font-size', `${settings.uiFontSize}px`);
    root.style.setProperty('--ui-line-height', `${settings.uiLineHeight}`);
    root.style.setProperty('--editor-font-size', `${settings.editorFontSize}px`);
    root.style.setProperty('--editor-line-height', `${settings.editorLineHeight}`);
    root.style.setProperty('--liquid-density', `${settings.liquidDensity}px`);
    root.style.setProperty('--liquid-transparency', `${settings.liquidTransparency / 100}`);
    root.style.setProperty('--liquid-clearness', `${settings.liquidClearness}`);
    root.style.setProperty('--liquid-gel', `${settings.liquidGel}`);
    root.style.setProperty('--liquid-bounce', `${settings.liquidBounce}`);

    root.dataset.theme = settings.theme;
    root.dataset.motion = settings.motion;
    root.dataset.liquidGlass = settings.liquidGlassEnabled ? 'on' : 'off';
  }, [settings]);

  const update = useCallback((partial: Partial<CustomizationSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      if (
        ('glassBlur' in partial || 'glassOpacity' in partial || 'glassThickness' in partial) &&
        !('glassPreset' in partial)
      ) {
        next.glassPreset = 'custom';
      }
      return next;
    });
  }, []);

  const applyGlassPreset = useCallback((preset: Exclude<GlassPreset, 'custom'>) => {
    setSettings((prev) => ({
      ...prev,
      glassPreset: preset,
      ...GLASS_PRESETS[preset],
    }));
  }, []);

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const value = useMemo(
    () => ({
      settings,
      update,
      applyGlassPreset,
      reset,
    }),
    [settings, update, applyGlassPreset, reset]
  );

  const { liquidGlassEnabled, liquidDensity, liquidClearness } = settings;
  const scale = 3 + (liquidClearness / 100) * 14;
  const baseFreq = 0.006 + (liquidDensity / 40) * 0.05;
  const stdDev = liquidDensity / 8;

  return (
    <CustomizationContext.Provider value={value}>
      {children}
      {liquidGlassEnabled && (
        <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0 overflow-hidden">
          <defs>
            <filter id="liquid-glass-refraction" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency={baseFreq} numOctaves={2} seed={7} result="noise" />
              <feGaussianBlur in="noise" stdDeviation={stdDev} result="blurredNoise" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="blurredNoise"
                scale={scale}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within CustomizationProvider');
  }
  return context;
};
