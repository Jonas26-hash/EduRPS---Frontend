// teacher-dashboard.component.ts (VERSIÓN ACTUALIZADA)

import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { StudentService, MenuItem } from '../../services/student.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('logoBursts', { static: false }) logoBurstsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('animatedLogo', { static: false }) animatedLogo!: ElementRef<HTMLImageElement>;

  isMenuVisible = false;
  currentUser: User | null = null;
  menuOptions: MenuItem[] = [];
  
  private subscriptions = new Subscription();
  private animationInterval: any;

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    this.subscriptions.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        if (!user) {
          this.router.navigate(['/login']);
        }
      })
    );

    // Cargar opciones del menú
    this.subscriptions.add(
      this.studentService.getStudentMenuItems().subscribe(items => {
        this.menuOptions = items;
      })
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeLogoAnimation();
    }, 100);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  navigateToOption(route: string): void {
    console.log('Navigating to:', route);
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
  }

  changePassword(): void {
    console.log('Change password...');
    // this.router.navigate(['/change-password']);
  }

  get studentInfo() {
    return {
      role: 'Estudiante',
      name: this.currentUser?.name || 'Usuario',
      grade: this.currentUser?.grade || '3° Grado'
    };
  }

  private initializeLogoAnimation(): void {
    if (!this.logoBurstsCanvas || !this.animatedLogo) {
      return;
    }

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
      const particles: any[] = [];

      for (let i = 0; i < 30; i++) {
        particles.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          radius: Math.random() * 3 + 2,
          color: `hsl(${Math.random() * 360}, 100%, 60%)`,
          angle: Math.random() * 2 * Math.PI,
          speed: Math.random() * 3 + 1,
          alpha: 1
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
          p.x += Math.cos(p.angle) * p.speed;
          p.y += Math.sin(p.angle) * p.speed;
          p.alpha -= 0.02;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        });
        ctx.globalAlpha = 1;

        if (particles.some(p => p.alpha > 0)) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    };

    const triggerEnhancedAnimation = () => {
      logo.style.animation = 'none';
      void logo.offsetWidth;
      logo.style.animation = 'bounceRotateGlow 1s ease';
      createParticles();
    };

    triggerEnhancedAnimation();
    this.animationInterval = setInterval(triggerEnhancedAnimation, 4000);
  }
}