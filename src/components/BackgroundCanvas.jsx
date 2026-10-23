import { useEffect, useRef } from 'react';

const BackgroundCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking for parallax
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 3D Star & Crypto Particle Matrix (Gold & Electric Blue Theme)
    const PARTICLE_COUNT = 140;
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * 1000 + 100,
        pz: Math.random() * 1000 + 100,
        color: ['#f59e0b', '#fbbf24', '#3b82f6', '#00b4d8', '#10b981', '#ffffff'][Math.floor(Math.random() * 6)],
        size: Math.random() * 1.8 + 0.8,
      });
    }

    // 3D Floating Wireframe Crystal Polyhedrons
    const crystals = [
      { x: -width * 0.35, y: -height * 0.15, z: 450, rx: 0, ry: 0, rz: 0, speed: 0.008, color: 'rgba(245, 158, 11, 0.45)' },
      { x: width * 0.38, y: height * 0.1, z: 500, rx: 0, ry: 0, rz: 0, speed: 0.006, color: 'rgba(59, 130, 246, 0.45)' },
      { x: -width * 0.25, y: height * 0.35, z: 600, rx: 0, ry: 0, rz: 0, speed: 0.005, color: 'rgba(251, 191, 36, 0.4)' },
    ];

    // Octahedron vertices
    const octaVertices = [
      [0, -45, 0],
      [45, 0, 0],
      [0, 0, 45],
      [-45, 0, 0],
      [0, 0, -45],
      [0, 45, 0],
    ];
    const octaEdges = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [5, 1], [5, 2], [5, 3], [5, 4],
      [1, 2], [2, 3], [3, 4], [4, 1],
    ];

    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      const offsetX = (mouse.x - width / 2) * 0.15;
      const offsetY = (mouse.y - height / 2) * 0.15;

      // Dark futuristic void with subtle dynamic gradient
      ctx.fillStyle = '#05060e';
      ctx.fillRect(0, 0, width, height);

      // Deep moving cosmic nebula orbs - Amber Gold & Electric Royal Blue
      const orb1X = width * 0.75 + Math.sin(time * 0.6) * 120;
      const orb1Y = height * 0.35 + Math.cos(time * 0.4) * 80;
      const g1 = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, 480);
      g1.addColorStop(0, 'rgba(245, 158, 11, 0.20)');
      g1.addColorStop(0.5, 'rgba(217, 119, 6, 0.08)');
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const orb2X = width * 0.2 + Math.cos(time * 0.5) * 100;
      const orb2Y = height * 0.7 + Math.sin(time * 0.7) * 90;
      const g2 = ctx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, 440);
      g2.addColorStop(0, 'rgba(37, 99, 235, 0.18)');
      g2.addColorStop(0.5, 'rgba(6, 182, 212, 0.08)');
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      // Horizon 3D Cyber Grid Lines (Golden & Cyan floor)
      const fov = 400;
      const gridY = height * 0.78;
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.10)';
      ctx.lineWidth = 1;

      // Perspective grid floor
      for (let x = -width; x < width * 2; x += 90) {
        ctx.beginPath();
        ctx.moveTo(x + offsetX * 0.5, gridY);
        const vanishX = width / 2 + (x - width / 2) * 0.2 + offsetX * 0.1;
        ctx.lineTo(vanishX, height);
        ctx.stroke();
      }

      for (let z = 1; z < 9; z++) {
        const y = gridY + (height - gridY) * (z / 9) ** 1.8;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.04 + z * 0.015})`;
        ctx.stroke();
      }

      // Render 3D Flying Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.z -= 1.8;
        if (p.z <= 10) {
          p.z = 1000;
          p.pz = 1000;
          p.x = (Math.random() - 0.5) * width * 2;
          p.y = (Math.random() - 0.5) * height * 2;
        }

        const k = fov / p.z;
        const px = (p.x + offsetX) * k + width / 2;
        const py = (p.y + offsetY) * k + height / 2;

        const pk = fov / p.pz;
        const ppx = (p.x + offsetX) * pk + width / 2;
        const ppy = (p.y + offsetY) * pk + height / 2;
        p.pz = p.z;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = Math.min(1, (1000 - p.z) / 700);
          ctx.beginPath();
          ctx.moveTo(ppx, ppy);
          ctx.lineTo(px, py);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = alpha * 0.7;
          ctx.lineWidth = p.size * k * 0.8;
          ctx.stroke();

          // Particle point glow
          ctx.beginPath();
          ctx.arc(px, py, p.size * k * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // Render 3D Wireframe Crystals
      crystals.forEach((c) => {
        c.rx += c.speed;
        c.ry += c.speed * 1.4;

        // Rotate vertices
        const projected = octaVertices.map(([vx, vy, vz]) => {
          // Rotate around X
          let y1 = vy * Math.cos(c.rx) - vz * Math.sin(c.rx);
          let z1 = vy * Math.sin(c.rx) + vz * Math.cos(c.rx);
          // Rotate around Y
          let x2 = vx * Math.cos(c.ry) + z1 * Math.sin(c.ry);
          let z2 = -vx * Math.sin(c.ry) + z1 * Math.cos(c.ry);

          // World position with parallax
          const worldX = x2 + c.x + offsetX * 0.8;
          const worldY = y1 + c.y + offsetY * 0.8;
          const worldZ = z2 + c.z;

          const scale = fov / worldZ;
          return [worldX * scale + width / 2, worldY * scale + height / 2];
        });

        // Draw edges
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        octaEdges.forEach(([i, j]) => {
          ctx.moveTo(projected[i][0], projected[i][1]);
          ctx.lineTo(projected[j][0], projected[j][1]);
        });
        ctx.stroke();

        // Glowing center
        const centerK = fov / c.z;
        const cx = (c.x + offsetX * 0.8) * centerK + width / 2;
        const cy = (c.y + offsetY * 0.8) * centerK + height / 2;
        const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 35 * centerK);
        grad.addColorStop(0, c.color.replace('0.45', '0.35'));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 35 * centerK, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default BackgroundCanvas;
