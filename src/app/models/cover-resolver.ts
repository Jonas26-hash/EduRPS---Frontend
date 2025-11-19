const COVER_MAP: Record<string, string> = {
  matematica: '/assets/Img/mathe.jpg',
  matemáticas: '/assets/Img/mathe.jpg',
  comunicacion: '/assets/Img/lang.jpg',
  comunicación: '/assets/Img/lang.jpg',
  lenguaje: '/assets/Img/lang.jpg',
  ciencias: '/assets/Img/scie.jpg',
  'ciencia y tecnología': '/assets/Img/scie.jpg',
  historia: '/assets/Img/hist.jpg',
  computacion: '/assets/Img/comp.jpg',
  computación: '/assets/Img/comp.jpg',
  arte: '/assets/Img/arte.jpg',
  'educacion física': '/assets/Img/pe.jpg',
  'educación física': '/assets/Img/pe.jpg',
  civica: '/assets/Img/civica.jpg',
  ciudadanía: '/assets/Img/civica.jpg',
  'educacion para el trabajo': '/assets/Img/ept.jpg',
};

export function resolveCover(nombre: string, fallback = '/assets/Img/course-ph.jpg'){
  const k = (nombre || '').trim().toLowerCase();
  return COVER_MAP[k] || fallback;
}
