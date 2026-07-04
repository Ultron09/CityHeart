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
    paperCanvas.width = 1024;
    paperCanvas.height = 512;
    const pCtx = paperCanvas.getContext("2d")!;
    pCtx.fillStyle = "#FAF7F0"; // Cloud White
    pCtx.fillRect(0, 0, 1024, 512);

    // Draw longitude & latitude grid lines
    pCtx.strokeStyle = "rgba(169, 132, 61, 0.22)"; // Brass hairline
    pCtx.lineWidth = 1;
    for (let lat = -90; lat <= 90; lat += 15) {
      const y = (1 - (lat + 90) / 180) * 512;
      pCtx.beginPath();
      pCtx.moveTo(0, y);
      pCtx.lineTo(1024, y);
      pCtx.stroke();
    }
    for (let lon = -180; lon <= 180; lon += 30) {
      const x = ((lon + 180) / 360) * 1024;
      pCtx.beginPath();
      pCtx.moveTo(x, 0);
      pCtx.lineTo(x, 512);
      pCtx.stroke();
    }

    // Land rendering
    pCtx.fillStyle = "#e4dac7"; // Sand
    pCtx.strokeStyle = "#A9843D"; // Brass borders
    pCtx.lineWidth = 1.5;

    const drawLand = (coords: [number, number][]) => {
      pCtx.beginPath();
      coords.forEach(([lon, lat], i) => {
        const x = ((lon + 180) / 360) * 1024;
        const y = (1 - (lat + 90) / 180) * 512;
        if (i === 0) pCtx.moveTo(x, y);
        else pCtx.lineTo(x, y);
      });
      pCtx.closePath();
      pCtx.fill();
      pCtx.stroke();
    };

    // Standardized continent coordinates mapping
    drawLand([[-160, 70], [-100, 75], [-60, 70], [-50, 50], [-60, 45], [-80, 25], [-90, 15], [-120, 35], [-165, 60]]); // NA
    drawLand([[-80, 10], [-40, -5], [-35, -8], [-70, -55], [-75, -50], [-80, -5]]); // SA
    drawLand([[-10, 60], [20, 65], [60, 70], [140, 70], [120, 20], [80, 5], [35, 30], [-10, 43]]); // Eurasia
    drawLand([[-15, 30], [30, 30], [50, 10], [40, -30], [20, -35], [-15, 15]]); // Africa
    drawLand([[115, -20], [145, -15], [150, -35], [115, -35]]); // Australia

    // Noise fiber generation overlay
    const imgData = pCtx.getImageData(0, 0, 1024, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const grain = (Math.random() - 0.5) * 8;
      data[i] = Math.min(255, Math.max(0, data[i] + grain));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
    }
    pCtx.putImageData(imgData, 0, 0);
    const mapTexture = new THREE.CanvasTexture(paperCanvas);

    // 2. Procedural Bump Map Canvas Texture (Crumpled Paper Displacement)
    const bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = 512;
    bumpCanvas.height = 256;
    const bCtx = bumpCanvas.getContext("2d")!;
    bCtx.fillStyle = "#808080";
    bCtx.fillRect(0, 0, 512, 256);
    const bImg = bCtx.getImageData(0, 0, 512, 256);
    const bData = bImg.data;
    for (let i = 0; i < bData.length; i += 4) {
      // Create high-frequency noise bumps to simulate textured tactile paper fibers
      const fiberVal = 128 + (Math.random() - 0.5) * 48;
      bData[i] = fiberVal;
      bData[i + 1] = fiberVal;
      bData[i + 2] = fiberVal;
    }
    bCtx.putImageData(bImg, 0, 0);
    const bumpTexture = new THREE.CanvasTexture(bumpCanvas);

    // 3. Globe Sphere Mesh
    const globeGeom = new THREE.SphereGeometry(0.8, 64, 64);
    const globeMat = new THREE.MeshStandardMaterial({
      map: mapTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.015, // Tactile paper crease scale
      roughness: 0.85,
      metalness: 0.05,
    });
    const globe = new THREE.Mesh(globeGeom, globeMat);
    scene.add(globe);

    // 4. Atmosphere Brass Glow Rim
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
          gl_FragColor = vec4(0.66, 0.52, 0.24, 1.0) * intensity * 0.4;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const glow = new THREE.Mesh(glowGeom, glowMat);
    scene.add(glow);

    // 5. Great-Circle Flight Arcs
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
        linewidth: 2,
        transparent: true,
        opacity: 0.8,
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

    const dirLight = new THREE.DirectionalLight(0xfff3db, 1.4);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    // Interactive Drag controls
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

    // Touch support
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
    // As the user scrolls, spin the globe and scale it down/shift position
    const scrollTriggerObj = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        // Spin on scroll
        targetRotationY = self.progress * Math.PI * 2;
        // Shift camera Z coordinates back slightly on scroll
        camera.position.z = 2.3 + self.progress * 0.5;
      }
    });

    // Animation loop
    let animationFrameId: number;
    const tick = () => {
      if (!isDragging) {
        globe.rotation.y += 0.001; // slow passive spin
      }
      globe.rotation.y += (targetRotationY - globe.rotation.y) * 0.05;
      globe.rotation.x += (targetRotationX - globe.rotation.x) * 0.05;
      globe.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, globe.rotation.x));

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };
    tick();

    // Entrance scale transition
    globe.scale.set(0, 0, 0);
    gsap.to(globe.scale, {
      x: 1.2,
      y: 1.2,
      z: 1.2,
      duration: 1.5,
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
