import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';
export type Primary = 'green' | 'blue' | 'violet' | 'cyan' | 'amber';
export type Lang = 'es' | 'en';

export interface AppSettings {
  theme: Theme;
  primary: Primary;
  fontScale: number;  // 100 = 1rem
  reduceMotion: boolean;
  notifications: boolean;
  lang: Lang;
}

const STORAGE_KEY = 'edurps_settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private current: AppSettings = {
    theme: 'light',
    primary: 'green',
    fontScale: 100,
    reduceMotion: false,
    notifications: true,
    lang: 'es',
  };

  get value(): AppSettings { return this.current; }

  loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) this.current = { ...this.current, ...JSON.parse(raw) };
    } catch {}
    // Persist quick keys for compatibility with ThemeService
    try {
      localStorage.setItem('edurps_theme', this.current.theme);
      localStorage.setItem('edurps_primary', this.current.primary);
    } catch {}
    this.apply(this.current);
  }

  save(partial: Partial<AppSettings>) {
    this.current = { ...this.current, ...partial };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.current));
    // Also persist quick keys used by legacy ThemeService
    try {
      localStorage.setItem('edurps_theme', this.current.theme);
      localStorage.setItem('edurps_primary', this.current.primary);
    } catch {}
    this.apply(this.current);
  }

  apply(s: AppSettings) {
    const root = document.documentElement;

    // tema: aplica clase globalmente
    root.classList.toggle('theme-dark', s.theme === 'dark');

    // primario
    root.classList.remove('primary-green','primary-blue','primary-violet','primary-cyan','primary-amber');
    root.classList.add(`primary-${s.primary}`);

    // escala de fuente
    root.style.fontSize = (s.fontScale / 100) + 'rem';

    // reduce motion
    root.classList.toggle('reduce-motion', !!s.reduceMotion);

    // notificaciones: no requiere DOM, pero lo guardamos en storage para uso futuro
    // idioma: también se guarda si es necesario
  }
}
