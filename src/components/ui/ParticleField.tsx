import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon';
  color: string;
}

interface ParticleFieldProps {
  count?: number;
  className?: string;
}

const COLORS = [
  'rgba(25, 148, 115, 0.6)',  // teal
  'rgba(59, 130, 246, 0.5)',  // blue
  'rgba(139, 92, 246, 0.4)',  // violet
  'rgba(245, 158, 11, 0.4)',  // amber
  'rgba(236, 72, 153, 0.3)',  // pink
  'rgba(101, 214, 173, 0.5)', // teal-light
];

const SHAPES: Particle['shape'][] = ['circle', 'square', 'triangle', 'diamond', 'hexagon'];

function drawShape(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate((p.rotation * Math.PI) / 180);
  ctx.globalAlpha = p.opacity;

  const s = p.size;

  switch (p.shape) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      break;

    case 'square':
      ctx.fillStyle = p.color;
      ctx.fillRect(-s / 2, -s / 2, s, s);
      break;

    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(0, -s / 2);
      ctx.lineTo(-s / 2, s / 2);
      ctx.lineTo(s / 2, s / 2);
      ctx.closePath();
      ctx.fillStyle = p.color;
      ctx.fill();
      break;

    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(0, -s / 2);
      ctx.lineTo(s / 2, 0);
      ctx.lineTo(0, s / 2);
      ctx.lineTo(-s / 2, 0);
      ctx.closePath();
      ctx.fillStyle = p.color;
      ctx.fill();
      break;

    case 'hexagon':
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const hx = (s / 2) * Math.cos(angle);
        const hy = (s / 2) * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fillStyle = p.color;
      ctx.fill();
      break;
  }

  ctx.restore();
}

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -Math.random() * 0.3 - 0.1,
    size: Math.random() * 8 + 3,
    opacity: Math.random() * 0.5 + 0.1,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 0.8,
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}

export default function ParticleField({ count = 50, className = '' }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const rect = canvas.getBoundingClientRect();
    particlesRef.current = Array.from({ length: count }, () =>
      createParticle(rect.width, rect.height)
    );

    // Spread connection lines
    const drawConnections = (particles: Particle[]) => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(25, 148, 115, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Wrap around
        if (p.y < -p.size) {
          p.y = h + p.size;
          p.x = Math.random() * w;
        }
        if (p.x < -p.size) p.x = w + p.size;
        if (p.x > w + p.size) p.x = -p.size;

        drawShape(ctx, p);
      }

      drawConnections(particles);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}
