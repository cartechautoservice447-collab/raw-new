export interface Note {
  id: string;
  title: string;
  body: string;
  favorite: boolean;
  collectionId: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface Collection {
  id: string;
  name: string;
  category?: string;
  parentId?: string | null;
}

export type FilterState =
  | { kind: 'all' }
  | { kind: 'favorites' }
  | { kind: 'collection'; id: string };

export type ThemeMode = 'original' | 'dark' | 'light';
export type GlassPreset = 'low' | 'medium' | 'high' | 'ultra' | 'custom';
export type MotionPreset = 'low' | 'medium' | 'high' | 'ultra';
export type UIFont = 'inter' | 'system' | 'mono';

export interface CustomizationSettings {
  theme: ThemeMode;
  glassPreset: GlassPreset;
  glassBlur: number;
  glassOpacity: number;
  glassThickness: number;
  motion: MotionPreset;
  uiFont: UIFont;
  uiFontSize: number;
  uiLineHeight: number;
  editorFontSize: number;
  editorLineHeight: number;
  liquidGlassEnabled: boolean;
  liquidDensity: number;
  liquidTransparency: number;
  liquidClearness: number;
  liquidGel: number;
  liquidBounce: number;
}

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    username?: string;
    full_name?: string;
  };
}
