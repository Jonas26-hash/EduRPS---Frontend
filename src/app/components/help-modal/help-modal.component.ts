import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HelpService, HelpPayload } from '../../services/help.service';

@Component({
  selector: 'app-help-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.css']
})
export class HelpModalComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();
  category = 'Acceso';
  priority: 'Normal' | 'Alta' = 'Normal';
  channel: 'whatsapp' | 'email' = 'whatsapp';
  contact = '';
  message = '';
  sending = false;
  userName = '';
  role = '';
  school = '';
  page = '';

  constructor(private help: HelpService) {
    this.page = location.pathname;
    try {
      const raw = localStorage.getItem('edurps_user');
      if (raw) {
        const u = JSON.parse(raw);
        this.userName = `${u.nombre || u.name || ''} ${u.apellido || u.lastName || ''}`.trim();
        this.role     = u.role || '';
        this.school   = u.schoolName || '';
      }
    } catch {}
  }

  get disabled() {
    return !this.message.trim();
  }

  send() {
    if (this.disabled) return;
    this.sending = true;

    const payload: HelpPayload = {
      category: this.category,
      priority: this.priority,
      message: this.message,
      contact: this.contact?.trim(),
      page: this.page,
      userName: this.userName,
      role: this.role,
      school: this.school,
      channel: this.channel
    };

    if (this.channel === 'email') this.help.openEmail(payload);
    else this.help.openWhatsApp(payload);
    setTimeout(() => {
      this.sending = false;
      this.close.emit();
      this.reset();
    }, 250);
  }

  reset() {
    this.category = 'Acceso';
    this.priority = 'Normal';
    this.channel = 'whatsapp';
    this.contact = '';
    this.message = '';
  }
}
