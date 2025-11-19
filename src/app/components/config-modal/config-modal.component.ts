import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService, AppSettings, Primary } from '../../services/settings.service';

const DEFAULTS: AppSettings = {
  theme: 'light',
  primary: 'green',
  fontScale: 100,
  reduceMotion: false,
  notifications: true,
  lang: 'es',
};
@Component({
  selector: 'app-config-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config-modal.component.html',
  styleUrls: ['./config-modal.component.css']
})
export class ConfigModalComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();
  @Output() changed = new EventEmitter<AppSettings>();

  settings: AppSettings = { ...DEFAULTS };

  constructor(private settingsService: SettingsService) {}

  ngOnInit(){
    // Leer las preferencias desde el servicio centralizado
    try {
      this.settingsService.loadFromStorage();
      this.settings = { ...DEFAULTS, ...this.settingsService.value };
    } catch {}
  }

  setTheme(dark: boolean){
    this.settings.theme = dark ? 'dark' : 'light';
    this.persist();
  }
  setPrimary(p: Primary){
    this.settings.primary = p;
    this.persist();
  }
  setFontScale(v: number){
    this.settings.fontScale = v;
    this.persist();
  }
  persist(){
    // Guardar usando el servicio para que el cambio se aplique globalmente
    this.settingsService.save(this.settings);
    this.changed.emit(this.settings);
  }

  closeModal(){ this.close.emit(); }
}
