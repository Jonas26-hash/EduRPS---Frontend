// theme.service.ts
import { Injectable } from '@angular/core';

const THEME_KEY = 'edurps_theme'; // 'light' | 'dark'
const PRIMARY_KEY = 'edurps_primary'; // 'green' | 'blue' | ...

@Injectable({ providedIn: 'root' })
export class ThemeService {
  init() {
    const saved = (localStorage.getItem(THEME_KEY) as 'dark'|'light') || null;
    const mode = saved ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.setTheme(mode);

    const palette = (localStorage.getItem(PRIMARY_KEY) as any) || 'green';
    this.setPrimary(palette);
  }

  setTheme(mode: 'dark'|'light') {
    const root = document.documentElement;        // <html>
    root.classList.toggle('theme-dark', mode === 'dark');
    localStorage.setItem(THEME_KEY, mode);
  }

  setPrimary(name: 'green'|'blue'|'violet'|'cyan'|'amber') {
    const root = document.documentElement;
    root.classList.remove('primary-green','primary-blue','primary-violet','primary-cyan','primary-amber');
    root.classList.add(`primary-${name}`);
    localStorage.setItem(PRIMARY_KEY, name);
  }

  current(): 'dark'|'light' {
    return document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light';
  }
}
