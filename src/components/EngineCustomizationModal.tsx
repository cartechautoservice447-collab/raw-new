import React from 'react';
import { RotateCcw, X } from 'lucide-react';
import {
  useCustomization,
  calculateBounceSpring,
} from '../context/CustomizationContext';
import { ThemeMode, GlassPreset, MotionPreset, UIFont } from '../types';

interface EngineCustomizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'original', label: 'Original' },
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'White / Light' },
];

const GLASS_OPTIONS: { value: Exclude<GlassPreset, 'custom'>; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'ultra', label: 'Ultra' },
];

const MOTION_OPTIONS: { value: MotionPreset; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'ultra', label: 'Ultra' },
];

const MOTION_DESCRIPTIONS: Record<MotionPreset, string> = {
  low: 'Animations off — maximum performance and battery saving.',
  medium: 'Standard transitions for layout changes and card hovers.',
  high: 'Fluid panel resizing, hover scaling and button press depth.',
  ultra: 'Spring easing, micro-pulse glow rings and GPU-accelerated transitions.',
};

const FONT_OPTIONS: { value: UIFont; label: string }[] = [
  { value: 'inter', label: 'Inter' },
  { value: 'system', label: 'System Sans' },
  { value: 'mono', label: 'JetBrains Mono' },
];

interface SliderFieldProps {
  label: string;
  value: number;
  suffix?: string;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
}

const SliderField: React.FC<SliderFieldProps> = ({
  label,
  value,
  suffix = '',
  min,
  max,
  step,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums text-foreground/80">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  );
};

interface SectionProps {
  title: string;
  hint?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, hint, children }) => {
  return (
    <section className="space-y-3 rounded-xl border border-white/5 bg-white/[0.03] p-4">
      <div>
        <h3 className="text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground/80 font-medium">
          {title}
        </h3>
        {hint && <p className="mt-1 text-xs text-muted-foreground/70 leading-relaxed">{hint}</p>}
      </div>
      {children}
    </section>
  );
};

export const EngineCustomizationModal: React.FC<EngineCustomizationModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { settings, update, applyGlassPreset, reset } = useCustomization();
  const spring = calculateBounceSpring(settings.liquidBounce);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="glass-panel animate-panel-in scroll-sleek relative max-h-[85vh] w-full max-w-[560px] overflow-y-auto rounded-2xl border border-white/10 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Engine Customization
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground hover:bg-white/[0.05]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Color theme */}
          <Section title="Color theme">
            <div className="grid grid-cols-3 gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] p-1">
              {THEME_OPTIONS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => update({ theme: item.value })}
                  className={`rounded-md px-2.5 py-1.5 text-xs transition-colors font-medium ${
                    settings.theme === item.value
                      ? 'bg-white/[0.1] text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Glass quality */}
          <Section
            title="Glass quality"
            hint={settings.glassPreset === 'custom' ? 'Custom' : undefined}
          >
            <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] p-1 sm:grid-cols-4">
              {GLASS_OPTIONS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => applyGlassPreset(item.value)}
                  className={`rounded-md px-2.5 py-1.5 text-xs transition-colors font-medium ${
                    settings.glassPreset === item.value
                      ? 'bg-white/[0.1] text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-1">
              <SliderField
                label="Glass blur"
                value={settings.glassBlur}
                suffix="px"
                min={0}
                max={32}
                step={1}
                onChange={(val) => update({ glassBlur: val })}
              />
              <SliderField
                label="Glass transparency"
                value={settings.glassOpacity}
                suffix="%"
                min={10}
                max={90}
                step={1}
                onChange={(val) => update({ glassOpacity: val })}
              />
              <SliderField
                label="Glass thickness"
                value={settings.glassThickness}
                suffix="px"
                min={0}
                max={4}
                step={0.5}
                onChange={(val) => update({ glassThickness: val })}
              />
            </div>
          </Section>

          {/* Liquid Glass Physics */}
          <Section
            title="Liquid Glass Physics"
            hint={
              settings.liquidGlassEnabled
                ? 'Apple-style fluid glass — refraction, specular light and spring-physics bounce on every glass panel.'
                : 'Off — panels use the standard glass system above.'
            }
          >
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2.5">
              <div>
                <p className="text-xs text-foreground font-medium">Enable Liquid Glass Engine</p>
                <p className="text-[0.68rem] text-muted-foreground/70">
                  Real-time fluid physics, refraction & spring bounce
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.liquidGlassEnabled}
                onClick={() => update({ liquidGlassEnabled: !settings.liquidGlassEnabled })}
                className={`peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  settings.liquidGlassEnabled ? 'bg-primary' : 'bg-white/[0.1]'
                }`}
              >
                <span
                  className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transition-transform ${
                    settings.liquidGlassEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div
              className={`space-y-3 pt-1 transition-opacity ${
                !settings.liquidGlassEnabled ? 'pointer-events-none opacity-40' : ''
              }`}
            >
              <SliderField
                label="Liquid density"
                value={settings.liquidDensity}
                suffix="px"
                min={0}
                max={40}
                step={1}
                onChange={(val) => update({ liquidDensity: val })}
              />
              <SliderField
                label="Liquid transparency"
                value={settings.liquidTransparency}
                suffix="%"
                min={5}
                max={95}
                step={1}
                onChange={(val) => update({ liquidTransparency: val })}
              />
              <SliderField
                label="Liquid clearness"
                value={settings.liquidClearness}
                min={0}
                max={100}
                step={1}
                onChange={(val) => update({ liquidClearness: val })}
              />
              <SliderField
                label="Liquid gel"
                value={settings.liquidGel}
                min={0}
                max={100}
                step={1}
                onChange={(val) => update({ liquidGel: val })}
              />
              <div>
                <SliderField
                  label="Liquid bounce"
                  value={settings.liquidBounce}
                  min={0}
                  max={100}
                  step={1}
                  onChange={(val) => update({ liquidBounce: val })}
                />
                <p className="pt-1 pl-0.5 text-[0.68rem] text-muted-foreground/60 font-mono">
                  stiffness {Math.round(spring.stiffness)} · damping {Math.round(spring.damping)}
                </p>
              </div>
            </div>
          </Section>

          {/* Motion & fluidity */}
          <Section title="Motion & fluidity" hint={MOTION_DESCRIPTIONS[settings.motion]}>
            <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] p-1 sm:grid-cols-4">
              {MOTION_OPTIONS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => update({ motion: item.value })}
                  className={`rounded-md px-2.5 py-1.5 text-xs transition-colors font-medium ${
                    settings.motion === item.value
                      ? 'bg-white/[0.1] text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Typography */}
          <Section title="Typography">
            <div className="grid grid-cols-3 gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] p-1">
              {FONT_OPTIONS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => update({ uiFont: item.value })}
                  className={`rounded-md px-2.5 py-1.5 text-xs transition-colors font-medium ${
                    settings.uiFont === item.value
                      ? 'bg-white/[0.1] text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-1">
              <SliderField
                label="UI font size"
                value={settings.uiFontSize}
                suffix="px"
                min={12}
                max={20}
                step={1}
                onChange={(val) => update({ uiFontSize: val })}
              />
              <SliderField
                label="UI line height"
                value={settings.uiLineHeight}
                min={1.2}
                max={2}
                step={0.05}
                onChange={(val) => update({ uiLineHeight: Number(val.toFixed(2)) })}
              />
              <SliderField
                label="Editor font size"
                value={settings.editorFontSize}
                suffix="px"
                min={11}
                max={22}
                step={1}
                onChange={(val) => update({ editorFontSize: val })}
              />
              <SliderField
                label="Editor line height"
                value={settings.editorLineHeight}
                min={1.2}
                max={2.4}
                step={0.05}
                onChange={(val) => update({ editorLineHeight: Number(val.toFixed(2)) })}
              />
            </div>
          </Section>

          {/* Reset button */}
          <button
            type="button"
            onClick={reset}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/5 bg-white/[0.04] px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-white/[0.08]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
