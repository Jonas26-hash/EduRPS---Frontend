import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

type MenuItem = { title: string; icon: string; route: string };

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css'],
})
export class TeacherDashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('logoBursts', { static: false }) logoBurstsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('animatedLogo', { static: false }) animatedLogo!: ElementRef<HTMLImageElement>;

  rightPanelOculto = true;
  showToast = false;
  shortName = '';
  private toastTimer: any;
  private animationInterval: any;
  schoolName = 'I.E. Ricardo Palma Soriano';

  user = {
    id: 0,
    name: '',
    email: '',
    role: 'Docente',
    photo: ''
  };

  menuItems: MenuItem[] = [
    { title: 'Portal del<br/>docente',  icon: '/assets/Img/portal-estu.svg', route: '/docente/cursos' },
    { title: 'Asistencia',               icon: '/assets/Img/Asis.svg',        route: '/docente/asistencia' },
    { title: 'Matricula',               icon: '/assets/Img/matricula.svg',        route: '/docente/matricula' },
    { title: 'Plan<br/>academico',       icon: '/assets/Img/Plan.svg',        route: '/docente/plan' },
    { title: 'Biblioteca<br/>Electronica', icon: '/assets/Img/BiblioElec.svg', route: '/docente/biblioteca' },
  ];

  constructor(private auth: AuthService, private router: Router) {
    const u = this.auth.currentUser;
    if (!u) { this.router.navigate(['/login']); return; }

    this.user.id    = u.id;
    this.user.name  = u.name;
    this.user.email = u.email ?? '';
    this.user.role  = 'Docente';
    this.schoolName = ((u as any).schoolName || this.schoolName)
  .replace(/^I\.?E\.?\s*/i, '')
  .trim();
    this.user.photo = (u as any).photoUrl ?? '';
    this.shortName = (this.user.name || '').split(' ')[0] || 'Docente';
  }

  toggleMenu(){ this.rightPanelOculto = !this.rightPanelOculto; }
  go(route: string){ this.router.navigate([route]); }
  
  logout() {
    const roleKey = (this.user.role || 'user').toLowerCase();
    sessionStorage.removeItem(`edurps_welcome_${roleKey}`);
    this.auth.logout();
    // Navigate to login and replace current history entry so back doesn't return to protected pages
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  changePassword(){ /* navegar o abrir modal */ }
  ripple(ev: MouseEvent | TouchEvent){
    const target = (ev.currentTarget as HTMLElement);
    const rect = target.getBoundingClientRect();
    const clientX = (ev as TouchEvent).touches?.[0]?.clientX ?? (ev as MouseEvent).clientX;
    const clientY = (ev as TouchEvent).touches?.[0]?.clientY ?? (ev as MouseEvent).clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    target.style.setProperty('--rx', `${x}px`);
    target.style.setProperty('--ry', `${y}px`);
    target.classList.remove('animating');
    void target.offsetWidth;
    target.classList.add('animating');
    setTimeout(()=> target.classList.remove('animating'), 650);
  }

  stripHtml(input?: string){
    if (!input) return '';
    return input.replace(/<[^>]+>/g, '');
  }

ngAfterViewInit(): void {
  this.maybeShowWelcomeToast();
}
private maybeShowWelcomeToast() {
  const roleKey = (this.user.role || 'user').toLowerCase();
  const toastKey = `edurps_welcome_${roleKey}`;
  if (!sessionStorage.getItem(toastKey)) {
    this.showToast = true;
    this.toastTimer = setTimeout(() => this.showToast = false, 3000);
    sessionStorage.setItem(toastKey, '1');
  }
}

  ngOnDestroy(): void {
    if (this.animationInterval) clearInterval(this.animationInterval);
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  private initLogoAnimation(){
    if (!this.logoBurstsCanvas || !this.animatedLogo) return;

    const canvas = this.logoBurstsCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    const logo = this.animatedLogo.nativeElement;
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = logo.clientWidth;
      canvas.height = logo.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createParticles = () => {
      const parts: any[] = [];
      for (let i = 0; i < 30; i++) {
        parts.push({
          x: canvas.width/2, y: canvas.height/2,
          r: Math.random()*3+2,
          c: `hsl(${Math.random()*360}, 100%, 60%)`,
          a: Math.random()*Math.PI*2,
          s: Math.random()*3+1,
          o: 1
        });
      }
      const step = () => {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        parts.forEach(p=>{
          p.x += Math.cos(p.a)*p.s;
          p.y += Math.sin(p.a)*p.s;
          p.o -= 0.02;
          ctx.beginPath();
          ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
          ctx.fillStyle = p.c;
          (ctx as any).globalAlpha = p.o;
          ctx.fill();
        });
        (ctx as any).globalAlpha = 1;
        if (parts.some(p=>p.o>0)) requestAnimationFrame(step);
      };
      step();
    };

    const trigger = () => {
      logo.style.animation = 'none';
      void logo.offsetWidth;
      logo.style.animation = 'bounceRotateGlow 1s ease';
      createParticles();
    };

    trigger();
    this.animationInterval = setInterval(trigger, 4000);
  }

  closeToast(){ this.showToast = false; if (this.toastTimer) clearTimeout(this.toastTimer); }
}
