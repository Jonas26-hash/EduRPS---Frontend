import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type HelpChannel = 'whatsapp' | 'email';

export interface HelpPayload {
  category: string;
  priority: 'Normal' | 'Alta';
  message: string;
  contact?: string;
  page?: string;
  userName?: string;
  role?: string;
  school?: string;
  channel?: HelpChannel;
}

@Injectable({ providedIn: 'root' })
export class HelpService {
  private adminWhats = '+51930563938';
  private adminEmail = 'chavezjonas347@gmail.com';

  constructor(@Inject(DOCUMENT) private doc: Document) {}

  getDiagnostics() {
    const n = navigator as any;
    const ua  = n.userAgent || '';
    const lang = n.language || '';
    const plat = n.platform || '';
    const time = new Date().toISOString();
    return `\n\n— Diagnóstico —\nNavegador: ${ua}\nIdioma: ${lang}\nPlataforma: ${plat}\nHora: ${time}`;
  }

  buildMessage(p: HelpPayload) {
    const header = `*Solicitud de ayuda*`;
    const who = [
      p.userName ? `Usuario: ${p.userName}` : '',
      p.role ? `Rol: ${p.role}` : '',
      p.school ? `Colegio: ${p.school}` : '',
      p.page ? `Pantalla: ${p.page}` : '',
      p.contact ? `Contacto: ${p.contact}` : ''
    ].filter(Boolean).join('\n');

    const body = [
      `Categoría: ${p.category}`,
      `Prioridad: ${p.priority}`,
      ``,
      p.message?.trim() || '(sin descripción)'
    ].join('\n');

    return `${header}\n${who ? who + '\n' : ''}\n${body}${this.getDiagnostics()}`;
  }

  openWhatsApp(p: HelpPayload) {
    const txt = encodeURIComponent(this.buildMessage(p));
    const url = `https://wa.me/${this.adminWhats.replace(/[^\d]/g,'')}?text=${txt}`;
    this.doc.defaultView?.open(url, '_blank');
  }

  openEmail(p: HelpPayload) {
    const subject = encodeURIComponent('[EduRPS] Soporte');
    const body = encodeURIComponent(this.buildMessage(p));
    const url = `mailto:${this.adminEmail}?subject=${subject}&body=${body}`;
    this.doc.defaultView?.open(url, '_blank');
  }
}
