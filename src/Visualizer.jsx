import React, { useEffect, useRef } from "react";

// A basic animated particle background, reacting to song tempo/energy
export default function Visualizer({ track }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);

    // Simple particle system
    const particles = Array.from({length: 100}, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random()-0.5) * 2,
      vy: (Math.random()-0.5) * 2,
      size: 1 + Math.random() * 3,
      hue: Math.random() * 360
    }));

    function animate() {
      ctx.clearRect(0,0,width,height);
      let bpm = 120;
      let energy = 0.5;
      if (track && track.item && track.item.duration_ms && track.progress_ms) {
        // fake tempo/energy if not from audio features
        bpm = 120 + (track.item.id.charCodeAt(0) % 60);
        energy = (track.progress_ms / track.item.duration_ms);
      }
      for (const p of particles) {
        p.x += p.vx * (1 + energy * 2);
        p.y += p.vy * (1 + energy * 2);
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + energy * 8, 0, Math.PI*2);
        ctx.fillStyle = `hsla(${p.hue + bpm}, 80%, 60%, 0.25)`;
        ctx.fill();
      }
      animationId = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line
  }, [track]);

  return (
    <canvas ref={canvasRef} style={{
      position:"absolute",
      top:0,left:0,
      width:"100vw",height:"100vh",
      zIndex:0,
      display:"block",
      background:"#111"
    }} />
  );
}