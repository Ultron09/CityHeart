"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./PaperGlobe.module.css";

gsap.registerPlugin(ScrollTrigger);

interface PaperGlobeProps {
  interactive?: boolean;
}

export default function PaperGlobe({ interactive = true }: PaperGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      // Mobile fallback: static 2D canvas with animated great-circle arcs
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let animationFrameId: number;
      let progress = 0;

      const resizeCanvas = () => {
        canvas.width = canvas.parentElement?.clientWidth || 300;
        canvas.height = canvas.parentElement?.clientHeight || 300;
      };
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      const drawMobileMap = () => {
        if (!ctx) return;
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = "#FAF7F0";
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.43, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#A9843D";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.strokeStyle = "rgba(169, 132, 61, 0.12)";
        for (let i = 1; i < 6; i++) {
          const y = h / 2 + (i - 3) * (h * 0.12);
          ctx.beginPath();
          ctx.moveTo(w / 2 - Math.sqrt(Math.pow(w * 0.43, 2) - Math.pow(y - h / 2, 2)), y);
          ctx.lineTo(w / 2 + Math.sqrt(Math.pow(w * 0.43, 2) - Math.pow(y - h / 2, 2)), y);
          ctx.stroke();
        }

        const cx = w / 2;
        const cy = h / 2;
        ctx.fillStyle = "#C1663E";
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();

        progress += 0.008;
        if (progress > 1) progress = 0;

        const dests = [
          { x: cx - w * 0.22, y: cy - h * 0.12, label: "Cabot Trail" },
          { x: cx + w * 0.18, y: cy + h * 0.12, label: "Louisbourg" },
        ];

        dests.forEach((dest) => {
          ctx.beginPath();
          ctx.strokeStyle = "#C1663E";
          ctx.setLineDash([4, 4]);
          ctx.moveTo(cx, cy);
          const mx = (cx + dest.x) / 2;
          const my = (cy + dest.y) / 2 - 30;
          ctx.quadraticCurveTo(mx, my, dest.x, dest.y);
          ctx.stroke();
          ctx.setLineDash([]);

          const t = progress;
          const ax = (1 - t) * (1 - t) * cx + 2 * (1 - t) * t * mx + t * t * dest.x;
          const ay = (1 - t) * (1 - t) * cy + 2 * (1 - t) * t * my + t * t * dest.y;

          ctx.fillStyle = "#A9843D";
          ctx.beginPath();
          ctx.arc(ax, ay, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#14201F";
          ctx.font = "10px var(--font-mono)";
          ctx.fillText(dest.label, dest.x - 20, dest.y - 8);
        });

        animationFrameId = requestAnimationFrame(drawMobileMap);
      };

      drawMobileMap();

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        cancelAnimationFrame(animationFrameId);
      };
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.3;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Procedural Color Map Canvas Texture
    const paperCanvas = document.createElement("canvas");
    paperCanvas.width = 2048; // High resolution map canvas
    paperCanvas.height = 1024;
    const pCtx = paperCanvas.getContext("2d")!;
    pCtx.fillStyle = "#FAF7F0"; // Cloud White
    pCtx.fillRect(0, 0, 2048, 1024);

    // Draw longitude & latitude grid lines (meridians and parallels)
    pCtx.strokeStyle = "rgba(169, 132, 61, 0.2)"; // Brass hairline
    pCtx.lineWidth = 1;
    for (let lat = -90; lat <= 90; lat += 15) {
      const y = (1 - (lat + 90) / 180) * 1024;
      pCtx.beginPath();
      pCtx.moveTo(0, y);
      pCtx.lineTo(2048, y);
      pCtx.stroke();
    }
    for (let lon = -180; lon <= 180; lon += 15) {
      const x = ((lon + 180) / 360) * 2048;
      pCtx.beginPath();
      pCtx.moveTo(x, 0);
      pCtx.lineTo(x, 1024);
      pCtx.stroke();
    }

    // Helper to perturb lines fractal-style for highly detailed, organic coastlines
    const drawFractalCoastline = (coords: [number, number][]) => {
      pCtx.beginPath();
      let first = true;
      coords.forEach(([lon, lat], i) => {
        const nextPoint = coords[(i + 1) % coords.length];
        const x1 = ((lon + 180) / 360) * 2048;
        const y1 = (1 - (lat + 90) / 180) * 1024;
        const x2 = ((nextPoint[0] + 180) / 360) * 2048;
        const y2 = (1 - (nextPoint[1] + 90) / 180) * 1024;

        if (first) {
          pCtx.moveTo(x1, y1);
          first = false;
        }

        // Subdivide segment with fractal noise
        const steps = 12;
        for (let j = 1; j <= steps; j++) {
          const t = j / steps;
          let px = x1 + (x2 - x1) * t;
          let py = y1 + (y2 - y1) * t;

          // Perpendicular offset based on sine-wave fractal noise
          const dist = Math.hypot(x2 - x1, y2 - y1);
          if (j < steps) {
            const angle = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
            const offset = (Math.sin(t * Math.PI * 4) * 4 + Math.sin(t * Math.PI * 12) * 2) * (dist * 0.05);
            px += Math.cos(angle) * offset;
            py += Math.sin(angle) * offset;
          }
          pCtx.lineTo(px, py);
        }
      });
      pCtx.closePath();
      pCtx.fill();
      pCtx.stroke();
    };

    // Draw detailed land masses
    pCtx.fillStyle = "#e4dac7"; // Sand
    pCtx.strokeStyle = "#A9843D"; // Brass outlines
    pCtx.lineWidth = 2;

    // Detailed coordinates list
    drawFractalCoastline([[-160, 70], [-100, 75], [-60, 70], [-50, 50], [-60, 45], [-80, 25], [-90, 15], [-120, 35], [-165, 60]]); // NA
    drawFractalCoastline([[-80, 10], [-40, -5], [-35, -8], [-70, -55], [-75, -50], [-80, -5]]); // SA
    drawFractalCoastline([[-10, 60], [20, 65], [60, 70], [140, 70], [120, 20], [80, 5], [35, 30], [-10, 43]]); // Eurasia
    drawFractalCoastline([[-15, 30], [30, 30], [50, 10], [40, -30], [20, -35], [-15, 15]]); // Africa
    drawFractalCoastline([[115, -20], [145, -15], [150, -35], [115, -35]]); // Australia

    // 2. Draw Cartography details directly on the flat texture canvas
    // Stylized Compass Rose in the Atlantic Ocean (x: 800, y: 700)
    const rx = 800;
    const ry = 700;
    pCtx.strokeStyle = "#A9843D";
    pCtx.lineWidth = 1;
    // Circles
    pCtx.beginPath();
    pCtx.arc(rx, ry, 35, 0, Math.PI * 2);
    pCtx.stroke();
    pCtx.beginPath();
    pCtx.arc(rx, ry, 40, 0, Math.PI * 2);
    pCtx.stroke();
    
    // Compass points
    const drawPoint = (angle: number, length: number, color1: string, color2: string) => {
      pCtx.beginPath();
      pCtx.moveTo(rx, ry);
      const px1 = rx + Math.cos(angle) * length;
      const py1 = ry + Math.sin(angle) * length;
      const px2 = rx + Math.cos(angle + 0.15) * (length * 0.3);
      const py2 = ry + Math.sin(angle + 0.15) * (length * 0.3);
      pCtx.lineTo(px1, py1);
      pCtx.lineTo(px2, py2);
      pCtx.closePath();
      pCtx.fillStyle = color1;
      pCtx.fill();
      pCtx.stroke();

      pCtx.beginPath();
      pCtx.moveTo(rx, ry);
      pCtx.lineTo(px1, py1);
      const px3 = rx + Math.cos(angle - 0.15) * (length * 0.3);
      const py3 = ry + Math.sin(angle - 0.15) * (length * 0.3);
      pCtx.lineTo(px3, py3);
      pCtx.closePath();
      pCtx.fillStyle = color2;
      pCtx.fill();
      pCtx.stroke();
    };

    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      const len = a % (Math.PI / 2) === 0 ? 30 : 18;
      drawPoint(a, len, "#C1663E", "#FAF7F0");
    }

    // Compass Labels
    pCtx.fillStyle = "#14201F";
    pCtx.font = "italic 10px serif";
    pCtx.fillText("N", rx - 4, ry - 42);
    pCtx.fillText("S", rx - 3, ry + 48);

    // Historical Script Labels
    pCtx.fillStyle = "rgba(20, 32, 31, 0.4)";
    pCtx.font = "italic 20px Georgia, serif";
    pCtx.fillText("Oceanus Atlanticus", 850, 580);
    pCtx.fillText("Terra Nova", 400, 300);
    pCtx.fillText("Terra Incognita", 500, 800);

    // Apply pulp noise grain texture overlay on the map
    const imgData = pCtx.getImageData(0, 0, 2048, 1024);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const grain = (Math.random() - 0.5) * 10;
      data[i] = Math.min(255, Math.max(0, data[i] + grain));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
    }
    pCtx.putImageData(imgData, 0, 0);
    const mapTexture = new THREE.CanvasTexture(paperCanvas);

    // 3. Procedural Bump Map Canvas Texture (Crumpled Tactile Paper Fibers)
    const bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = 1024;
    bumpCanvas.height = 512;
    const bCtx = bumpCanvas.getContext("2d")!;
    bCtx.fillStyle = "#808080";
    bCtx.fillRect(0, 0, 1024, 512);
    const bImg = bCtx.getImageData(0, 0, 1024, 512);
    const bData = bImg.data;
    for (let i = 0; i < bData.length; i += 4) {
      const fiberVal = 128 + (Math.random() - 0.5) * 52;
      bData[i] = fiberVal;
      bData[i + 1] = fiberVal;
      bData[i + 2] = fiberVal;
    }
    bCtx.putImageData(bImg, 0, 0);
    const bumpTexture = new THREE.CanvasTexture(bumpCanvas);

    // 4. Globe Sphere Mesh with relief bump mapping
    const globeGeom = new THREE.SphereGeometry(0.8, 64, 64);
    const globeMat = new THREE.MeshStandardMaterial({
      map: mapTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.02, // Tactile paper crease scale
      roughness: 0.88,
      metalness: 0.02,
    });
    const globe = new THREE.Mesh(globeGeom, globeMat);
    scene.add(globe);

    // 5. Atmosphere Brass Glow Rim Shader
    const glowGeom = new THREE.SphereGeometry(0.81, 32, 32);
    const glowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
          gl_FragColor = vec4(0.66, 0.52, 0.24, 1.0) * intensity * 0.45;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const glow = new THREE.Mesh(glowGeom, glowMat);
    scene.add(glow);

    // 6. Great-Circle Flight Arcs
    const getCartesian = (lat: number, lon: number, radius = 0.8) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.cos(theta)
      );
    };

    const startPos = getCartesian(46.13, -60.19);
    const dest1 = getCartesian(46.64, -60.40);
    const dest2 = getCartesian(45.92, -59.97);

    const makeArc = (start: THREE.Vector3, end: THREE.Vector3) => {
      const mid = start.clone().add(end).multiplyScalar(0.5);
      const dist = start.distanceTo(end);
      mid.normalize().multiplyScalar(0.8 + dist * 0.25);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0xC1663E, // Terracotta
        linewidth: 2.5,
        transparent: true,
        opacity: 0.85,
      });
      return new THREE.Line(geometry, material);
    };

    const arc1 = makeArc(startPos, dest1);
    const arc2 = makeArc(startPos, dest2);
    globe.add(arc1);
    globe.add(arc2);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff3db, 1.55);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    // Interactive Drag
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotationY += deltaX * 0.005;
      targetRotationX += deltaY * 0.005;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Touch
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      targetRotationY += deltaX * 0.005;
      targetRotationX += deltaY * 0.005;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };

    if (interactive) {
      renderer.domElement.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      renderer.domElement.addEventListener("touchstart", handleTouchStart);
      renderer.domElement.addEventListener("touchmove", handleTouchMove);
      renderer.domElement.addEventListener("touchend", handleMouseUp);
    }

    // Scroll Bindings via GSAP ScrollTrigger
    const scrollTriggerObj = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        targetRotationY = self.progress * Math.PI * 2.5;
        camera.position.z = 2.3 + self.progress * 0.6;
      }
    });

    // Animation Loop
    let animationFrameId: number;
    const tick = () => {
      if (!isDragging) {
        globe.rotation.y += 0.0008;
      }
      globe.rotation.y += (targetRotationY - globe.rotation.y) * 0.05;
      globe.rotation.x += (targetRotationX - globe.rotation.x) * 0.05;
      globe.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, globe.rotation.x));

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };
    tick();

    // Scale entrance
    globe.scale.set(0, 0, 0);
    gsap.to(globe.scale, {
      x: 1.25,
      y: 1.25,
      z: 1.25,
      duration: 1.6,
      ease: "power3.out",
    });

    // Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      scrollTriggerObj.kill();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      globeGeom.dispose();
      globeMat.dispose();
      glowGeom.dispose();
      glowMat.dispose();
      mapTexture.dispose();
      bumpTexture.dispose();
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [interactive, isMobile]);

  return (
    <div ref={containerRef} className={styles.globeContainer}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
