import React, { useEffect, useRef, useState } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
  id?: number;
}

interface Shape3D {
  points: Point3D[];
  edges: [number, number][];
  color: string;
  size: number;
  posX: number;
  posY: number;
  posZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
}

interface DataPacket {
  edgeIndex: number;
  progress: number; // 0 to 1
  speed: number;
  size: number;
}

export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ current: 0, target: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Theme and animation state
  const [theme, setTheme] = useState<"dark" | "light" | "cosmic" | "luxury">("dark");
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [enableMouseParallax, setEnableMouseParallax] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // References to keep state available to the canvas thread without restarting it
  const themeRef = useRef(theme);
  const speedRef = useRef(speedMultiplier);
  const parallaxRef = useRef(enableMouseParallax);

  useEffect(() => {
    themeRef.current = theme;
    // Tweak body class for text styling integration
    document.body.classList.remove("theme-dark", "theme-light", "theme-cosmic", "theme-luxury");
    document.body.classList.add(`theme-${theme}`);
    return () => {
      document.body.classList.remove(`theme-${theme}`);
    };
  }, [theme]);

  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    parallaxRef.current = enableMouseParallax;
  }, [enableMouseParallax]);

  // Smooth accumulators for independent speed adjustment
  const globeAngleY = useRef(0);
  const globeAngleX = useRef(0);
  const ringAngleY = useRef(0);
  const ringAngleX = useRef(0);
  const starTimeAcc = useRef(0);
  const crystalFloatAcc = useRef(0);

  // Handle tracking mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle tracking scroll for dynamic 3D depth parallax
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current.target = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Responsive full-viewport resizing
  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High-DPI canvas resolution
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    let animationId: number;

    // 1. Build 3D Holographic Network Globe (representing Beneple Tech Core)
    const spherePoints: Point3D[] = [];
    const sphereEdges: [number, number][] = [];
    const R = 150; // Larger, more impressive globe
    const latCount = 9;
    const lonCount = 14;

    // Generate vertices for the globe
    for (let i = 1; i < latCount; i++) {
      const theta = (i * Math.PI) / latCount;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let j = 0; j < lonCount; j++) {
        const phi = (j * 2 * Math.PI) / lonCount;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        spherePoints.push({
          x: R * sinTheta * cosPhi,
          y: R * cosTheta,
          z: R * sinTheta * sinPhi,
          id: spherePoints.length,
        });
      }
    }

    // Connect horizontal rings
    for (let i = 0; i < latCount - 1; i++) {
      const ringOffset = i * lonCount;
      for (let j = 0; j < lonCount; j++) {
        const current = ringOffset + j;
        const next = ringOffset + ((j + 1) % lonCount);
        sphereEdges.push([current, next]);
      }
    }

    // Connect vertical line segments
    for (let i = 0; i < latCount - 2; i++) {
      const ringOffset = i * lonCount;
      const nextRingOffset = (i + 1) * lonCount;
      for (let j = 0; j < lonCount; j++) {
        sphereEdges.push([ringOffset + j, nextRingOffset + j]);
      }
    }

    // Initialize flowing data packets traveling on globe edges
    const dataPackets: DataPacket[] = Array.from({ length: 15 }).map(() => ({
      edgeIndex: Math.floor(Math.random() * sphereEdges.length),
      progress: Math.random(),
      speed: 0.005 + Math.random() * 0.012,
      size: 1.5 + Math.random() * 2,
    }));

    // 2. Build floating constellation nodes (star field background)
    const starsCount = 55;
    const stars: Point3D[] = Array.from({ length: starsCount }).map(() => ({
      x: (Math.random() - 0.5) * dimensions.width * 1.8,
      y: (Math.random() - 0.5) * dimensions.height * 2.2,
      z: -200 + Math.random() * 600,
    }));

    // 3. Generate Floating 3D Crystals (Tech Compliance Nodes)
    const createCrystalPoints = (): Point3D[] => [
      { x: 0, y: -1.2, z: 0 },  // Top vertex
      { x: 1, y: 0, z: 0 },     // Right
      { x: 0, y: 0, z: 1 },     // Front
      { x: -1, y: 0, z: 0 },    // Left
      { x: 0, y: 0, z: -1 },   // Back
      { x: 0, y: 1.2, z: 0 },   // Bottom
    ];

    const crystalEdges: [number, number][] = [
      [0, 1], [0, 2], [0, 3], [0, 4], // Top caps
      [1, 2], [2, 3], [3, 4], [4, 1], // Middle ring
      [5, 1], [5, 2], [5, 3], [5, 4], // Bottom caps
    ];

    // Position crystals at different depths and columns to frame the website content
    const crystals: Shape3D[] = Array.from({ length: 8 }).map((_, index) => {
      const side = index % 2 === 0 ? -1 : 1;
      const verticalIndex = Math.floor(index / 2);
      
      // Place them beautifully spaced out vertically down the homepage
      const xOffset = side * (dimensions.width * 0.38 + Math.random() * 80);
      const yOffset = (verticalIndex - 1.5) * (dimensions.height * 0.45) + (Math.random() - 0.5) * 100;
      
      return {
        points: createCrystalPoints(),
        edges: crystalEdges,
        color: index % 3 === 0 ? "#EBB63F" : index % 3 === 1 ? "#10B981" : "#38BDF8",
        size: 30 + Math.random() * 25,
        posX: xOffset,
        posY: yOffset,
        posZ: -100 + Math.random() * 300,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        rotSpeedX: 0.003 + Math.random() * 0.006,
        rotSpeedY: 0.002 + Math.random() * 0.005,
        rotSpeedZ: 0.001 + Math.random() * 0.004,
      };
    });

    // Camera perspective settings
    const fov = 400;

    // Rotation helper functions
    const rotateX = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: p.x,
        y: p.y * cos - p.z * sin,
        z: p.y * sin + p.z * cos,
      };
    };

    const rotateY = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: p.x * cos + p.z * sin,
        y: p.y,
        z: -p.x * sin + p.z * cos,
      };
    };

    const rotateZ = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: p.x * cos - p.y * sin,
        y: p.x * sin + p.y * cos,
        z: p.z,
      };
    };

    // Render loop
    const tick = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const currentSpeed = speedRef.current;
      const currentTheme = themeRef.current;
      const currentParallax = parallaxRef.current;

      // Increment accumulators by speed
      globeAngleY.current += 0.0018 * currentSpeed;
      globeAngleX.current += 0.0006 * currentSpeed;
      ringAngleY.current += -0.001 * currentSpeed;
      ringAngleX.current += 0.0004 * currentSpeed;
      starTimeAcc.current += 0.015 * currentSpeed;
      crystalFloatAcc.current += 0.012 * currentSpeed;

      // Smooth interpolation for mouse positions (easing)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const currentMouseX = currentParallax ? mouseRef.current.x : 0;
      const currentMouseY = currentParallax ? mouseRef.current.y : 0;

      // Smooth interpolation for scroll (parallax)
      scrollRef.current.current += (scrollRef.current.target - scrollRef.current.current) * 0.06;
      const scrollY = scrollRef.current.current;

      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;

      // 1. Draw Star / Particle Field with smooth parallax scrolling
      stars.forEach((star, index) => {
        // Apply scroll-parallax. Deeper stars move slower, closer stars move faster.
        const starParallaxY = -scrollY * (0.05 + (star.z + 200) * 0.0003);
        const finalStarY = centerY + star.y + starParallaxY;
        
        // Wrap star index within boundaries smoothly
        const starX = centerX + star.x - currentMouseX * (15 + (index % 5) * 8);
        
        // Render only if on screen
        if (finalStarY > -50 && finalStarY < dimensions.height + 50 && starX > -50 && starX < dimensions.width + 50) {
          const depthScale = fov / (star.z + 400);
          const starSize = Math.max(0.8, (1.2 + (index % 4) * 0.5) * depthScale);
          const opacity = Math.max(0.08, Math.min(0.4, (800 - star.z) / 900)) * (0.6 + Math.sin(starTimeAcc.current + index) * 0.4);

          let starColor = "";
          if (currentTheme === "light") {
            // Darker, high-contrast stars on light bg
            if (index % 4 === 0) starColor = `rgba(7, 59, 49, ${opacity * 1.6})`;
            else if (index % 4 === 1) starColor = `rgba(59, 130, 246, ${opacity * 1.6})`;
            else starColor = `rgba(30, 41, 59, ${opacity * 1.2})`;
          } else if (currentTheme === "cosmic") {
            if (index % 4 === 0) starColor = `rgba(6, 182, 212, ${opacity})`; // Cyan
            else if (index % 4 === 1) starColor = `rgba(236, 72, 153, ${opacity})`; // Pink
            else starColor = `rgba(255, 255, 255, ${opacity * 0.8})`;
          } else if (currentTheme === "luxury") {
            if (index % 4 === 0) starColor = `rgba(245, 158, 11, ${opacity})`; // Amber
            else if (index % 4 === 1) starColor = `rgba(239, 68, 68, ${opacity * 0.8})`; // Crimson
            else starColor = `rgba(255, 248, 220, ${opacity * 0.8})`; // Warm white
          } else {
            // Dark (default)
            if (index % 4 === 0) starColor = `rgba(235, 182, 63, ${opacity})`;  // Gold
            else if (index % 4 === 1) starColor = `rgba(16, 185, 129, ${opacity})`;  // Emerald
            else starColor = `rgba(255, 255, 255, ${opacity * 0.8})`;
          }

          ctx.fillStyle = starColor;

          ctx.beginPath();
          ctx.arc(starX, finalStarY, starSize, 0, 2 * Math.PI);
          ctx.fill();

          // Connect stars that are close to each other with ultra-faint lines to form neural patterns
          if (index < starsCount - 1 && index % 6 === 0) {
            const nextStar = stars[index + 1];
            const nextStarY = centerY + nextStar.y + starParallaxY;
            const nextStarX = centerX + nextStar.x - currentMouseX * (15 + ((index + 1) % 5) * 8);
            
            const dx = starX - nextStarX;
            const dy = finalStarY - nextStarY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
              const lineOpacity = currentTheme === "light" ? opacity * 0.12 : opacity * 0.06;
              const lineColor = currentTheme === "light" ? "7, 59, 49" : "255, 255, 255";
              ctx.strokeStyle = `rgba(${lineColor}, ${lineOpacity * (1 - dist / 130)})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(starX, finalStarY);
              ctx.lineTo(nextStarX, nextStarY);
              ctx.stroke();
            }
          }
        }
      });

      // 2. Draw Interactive 3D Sphere (Nationwide Network Hologram)
      // Slow constant spin, plus mouse dragging, plus scroll roll
      const globeRotY = globeAngleY.current + currentMouseX * 0.35;
      const globeRotX = Math.sin(globeAngleX.current) * 0.12 + currentMouseY * 0.35 + (scrollY * 0.0006);

      // Project sphere points
      const projectedSphere: { x: number; y: number; depth: number }[] = [];
      spherePoints.forEach((point) => {
        let rotated = rotateY(point, globeRotY);
        rotated = rotateX(rotated, globeRotX);

        // Position the globe (centered with subtle parallax and mouse drift)
        const finalX = centerX - currentMouseX * 30;
        // The globe will scroll slightly slower than the main viewport (cool parallax)
        const finalY = centerY - (scrollY * 0.18) - currentMouseY * 30;
        const finalZ = rotated.z + 400; // Depth offset

        const scale = fov / finalZ;
        projectedSphere.push({
          x: finalX + rotated.x * scale,
          y: finalY + rotated.y * scale,
          depth: finalZ,
        });
      });

      // Only draw the globe if it is within or near the viewport
      const globeCenterY = centerY - (scrollY * 0.18);
      if (globeCenterY > -R * 2 && globeCenterY < dimensions.height + R * 2) {
        // Draw globe horizontal & vertical edges
        ctx.lineWidth = 0.6;
        sphereEdges.forEach(([p1Idx, p2Idx]) => {
          const p1 = projectedSphere[p1Idx];
          const p2 = projectedSphere[p2Idx];

          if (!p1 || !p2) return;

          const avgDepth = (p1.depth + p2.depth) / 2;
          const opacity = Math.max(0.02, Math.min(0.24, (750 - avgDepth) / 600));

          let wireColor = "rgba(235, 182, 63, "; // Default gold
          if (currentTheme === "light") {
            wireColor = "rgba(7, 59, 49, "; // Brand green
          } else if (currentTheme === "cosmic") {
            wireColor = "rgba(6, 182, 212, "; // Cyan
          } else if (currentTheme === "luxury") {
            wireColor = "rgba(245, 158, 11, "; // Amber
          }
          ctx.strokeStyle = `${wireColor}${opacity})`;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });

        // Update & Render Flowing Data Packets
        dataPackets.forEach((packet) => {
          packet.progress += packet.speed * currentSpeed;
          if (packet.progress >= 1) {
            packet.progress = 0;
            packet.edgeIndex = Math.floor(Math.random() * sphereEdges.length);
          }

          const [p1Idx, p2Idx] = sphereEdges[packet.edgeIndex];
          const p1 = projectedSphere[p1Idx];
          const p2 = projectedSphere[p2Idx];

          if (p1 && p2) {
            const x = p1.x + (p2.x - p1.x) * packet.progress;
            const y = p1.y + (p2.y - p1.y) * packet.progress;
            const depth = p1.depth + (p2.depth - p1.depth) * packet.progress;

            const opacity = Math.max(0.1, Math.min(0.8, (700 - depth) / 450));
            
            let packetColor = "#10B981"; // Emerald
            if (currentTheme === "light") {
              packetColor = "#2563EB"; // Blue
            } else if (currentTheme === "cosmic") {
              packetColor = "#EC4899"; // Pink
            } else if (currentTheme === "luxury") {
              packetColor = "#F97316"; // Orange
            }

            ctx.fillStyle = packetColor;
            ctx.shadowBlur = 6;
            ctx.shadowColor = packetColor;
            ctx.beginPath();
            ctx.arc(x, y, packet.size, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0; // Reset
          }
        });

        // Draw orbital concentric ring loops around the globe
        const ringRotY = ringAngleY.current + currentMouseX * 0.2;
        const ringRotX = Math.sin(ringAngleX.current) * 0.3 + (scrollY * 0.0004);
        
        ctx.lineWidth = 0.8;
        
        let ring1Color = "rgba(16, 185, 129, 0.15)";
        if (currentTheme === "light") {
          ring1Color = "rgba(13, 92, 78, 0.25)";
        } else if (currentTheme === "cosmic") {
          ring1Color = "rgba(236, 72, 153, 0.2)";
        } else if (currentTheme === "luxury") {
          ring1Color = "rgba(239, 68, 68, 0.2)";
        }
        ctx.strokeStyle = ring1Color;
        
        ctx.beginPath();
        
        const ringPointsCount = 36;
        const ringRadius = R * 1.25;
        const projectedRing: { x: number; y: number; depth: number }[] = [];

        for (let i = 0; i <= ringPointsCount; i++) {
          const angle = (i * 2 * Math.PI) / ringPointsCount;
          let p = {
            x: ringRadius * Math.cos(angle),
            y: 0,
            z: ringRadius * Math.sin(angle),
          };

          // Rotate
          p = rotateY(p, ringRotY);
          p = rotateX(p, ringRotX);

          const finalZ = p.z + 400;
          const scale = fov / finalZ;
          projectedRing.push({
            x: (centerX - currentMouseX * 30) + p.x * scale,
            y: (centerY - (scrollY * 0.18) - currentMouseY * 30) + p.y * scale,
            depth: finalZ,
          });
        }

        // Render the rotating technological rings (with depth clipping to wrap around globe)
        ctx.beginPath();
        projectedRing.forEach((p, idx) => {
          if (idx === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            // Fades when behind the globe's core center
            if (p.depth < 400) {
              ctx.lineTo(p.x, p.y);
            } else {
              ctx.moveTo(p.x, p.y);
            }
          }
        });
        ctx.stroke();

        // Draw a second glowing inner diagonal ring (satellite path)
        let ring2Color = "rgba(235, 182, 63, 0.18)";
        if (currentTheme === "light") {
          ring2Color = "rgba(37, 99, 235, 0.25)";
        } else if (currentTheme === "cosmic") {
          ring2Color = "rgba(6, 182, 212, 0.25)";
        } else if (currentTheme === "luxury") {
          ring2Color = "rgba(245, 158, 11, 0.25)";
        }
        ctx.strokeStyle = ring2Color;

        ctx.beginPath();
        const diagonalRingPoints: { x: number; y: number; depth: number }[] = [];
        for (let i = 0; i <= ringPointsCount; i++) {
          const angle = (i * 2 * Math.PI) / ringPointsCount;
          let p = {
            x: ringRadius * 1.05 * Math.cos(angle),
            y: ringRadius * 0.45 * Math.cos(angle),
            z: ringRadius * 1.05 * Math.sin(angle),
          };

          p = rotateY(p, -ringRotY * 1.2);
          p = rotateX(p, ringRotX * 1.1);

          const finalZ = p.z + 400;
          const scale = fov / finalZ;
          diagonalRingPoints.push({
            x: (centerX - currentMouseX * 30) + p.x * scale,
            y: (centerY - (scrollY * 0.18) - currentMouseY * 30) + p.y * scale,
            depth: finalZ,
          });
        }

        projectedRing.forEach((p, idx) => {
          const diagP = diagonalRingPoints[idx];
          if (diagP) {
            if (idx === 0) {
              ctx.moveTo(diagP.x, diagP.y);
            } else {
              if (diagP.depth < 400) {
                ctx.lineTo(diagP.x, diagP.y);
              } else {
                ctx.moveTo(diagP.x, diagP.y);
              }
            }
          }
        });
        ctx.stroke();

        // Draw globe vertices as elegant nodes
        projectedSphere.forEach((p) => {
          const opacity = Math.max(0.04, Math.min(0.6, (750 - p.depth) / 550));
          
          let nodeColor = "rgba(235, 182, 63, ";
          let innerColor = "rgba(255, 255, 255, ";
          
          if (currentTheme === "light") {
            nodeColor = "rgba(13, 92, 78, ";
            innerColor = "rgba(235, 182, 63, ";
          } else if (currentTheme === "cosmic") {
            nodeColor = "rgba(6, 182, 212, ";
            innerColor = "rgba(255, 255, 255, ";
          } else if (currentTheme === "luxury") {
            nodeColor = "rgba(245, 158, 11, ";
            innerColor = "rgba(255, 255, 255, ";
          }
          
          ctx.fillStyle = `${nodeColor}${opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.8, 0, 2 * Math.PI);
          ctx.fill();

          // Render gorgeous inner light-pulse if in foreground
          if (p.depth < 350) {
            ctx.fillStyle = `${innerColor}${opacity * 0.9})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 0.9, 0, 2 * Math.PI);
            ctx.fill();
          }
        });
      }

      // 3. Draw Floating Crystals (Tech Compliance Nodes)
      crystals.forEach((crystal, cIndex) => {
        // Rotational dynamics
        crystal.rotX += crystal.rotSpeedX * currentSpeed;
        crystal.rotY += crystal.rotSpeedY * currentSpeed;
        crystal.rotZ += crystal.rotSpeedZ * currentSpeed;

        // Hover buoyancy vertical offset
        const floatOffset = Math.sin(crystalFloatAcc.current + cIndex * 40) * 20;

        // Apply scroll-parallax shift. Since these represent floating elements down the entire page,
        // they must scroll up as the user scrolls down, but at a distinct depth-parallax speed!
        // This is the key to making the ENTIRE page feel like immersive 3D space!
        const scrollParallaxY = -scrollY * (0.85 + (crystal.posZ + 100) * 0.0006);

        // Final screen base positions
        const finalBaseX = centerX + crystal.posX - currentMouseX * (20 + (cIndex % 3) * 12);
        const finalBaseY = centerY + crystal.posY + floatOffset + scrollParallaxY - currentMouseY * (20 + (cIndex % 3) * 12);

        // Draw only if it is visible within a reasonable viewport envelope
        if (finalBaseY > -150 && finalBaseY < dimensions.height + 150) {
          const projectedCrystal: { x: number; y: number; depth: number }[] = [];

          crystal.points.forEach((point) => {
            let p = {
              x: point.x * crystal.size,
              y: point.y * crystal.size,
              z: point.z * crystal.size,
            };

            // Rotate points
            p = rotateX(p, crystal.rotX);
            p = rotateY(p, crystal.rotY);
            p = rotateZ(p, crystal.rotZ);

            const finalZ = crystal.posZ + p.z + 400;
            const scale = fov / finalZ;

            projectedCrystal.push({
              x: finalBaseX + p.x * scale,
              y: finalBaseY + p.y * scale,
              depth: finalZ,
            });
          });

          // Calculate average depth
          const avgDepth = projectedCrystal.reduce((acc, curr) => acc + curr.depth, 0) / projectedCrystal.length;
          const opacity = Math.max(0.04, Math.min(0.28, (800 - avgDepth) / 700));

          // Get the dynamic crystal colors for current theme
          const dynamicCrystalColors = {
            dark: ["#EBB63F", "#10B981", "#38BDF8"],
            light: ["#EBB63F", "#0D5C4E", "#4BA3E3"],
            cosmic: ["#06B6D4", "#8B5CF6", "#EC4899"],
            luxury: ["#D97706", "#EF4444", "#F59E0B"],
          };
          const themeColors = dynamicCrystalColors[currentTheme] || dynamicCrystalColors.dark;
          const activeColor = themeColors[cIndex % themeColors.length];

          // Draw crystal wireframe edges
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = activeColor === "#EBB63F" || activeColor === "#D97706" || activeColor === "#F59E0B"
            ? `rgba(245, 158, 11, ${opacity + 0.12})` // Amber tint
            : activeColor === "#10B981" || activeColor === "#073B31" || activeColor === "#14B8A6"
            ? `rgba(16, 185, 129, ${opacity + 0.12})` // Green tint
            : activeColor === "#38BDF8" || activeColor === "#3B82F6" || activeColor === "#06B6D4"
            ? `rgba(56, 189, 248, ${opacity + 0.12})` // Blue/Cyan tint
            : `rgba(139, 92, 246, ${opacity + 0.12})`; // Purple/Magenta tint

          crystal.edges.forEach(([p1Idx, p2Idx]) => {
            const p1 = projectedCrystal[p1Idx];
            const p2 = projectedCrystal[p2Idx];
            if (!p1 || !p2) return;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          });

          // Draw filled crystalline translucent faces for premium aesthetic
          if (avgDepth < 550) {
            const faceGroups = [
              [0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1],
              [5, 1, 2], [5, 2, 3], [5, 3, 4], [5, 4, 1]
            ];
            faceGroups.forEach((indices, fIdx) => {
              const p1 = projectedCrystal[indices[0]];
              const p2 = projectedCrystal[indices[1]];
              const p3 = projectedCrystal[indices[2]];
              if (p1 && p2 && p3) {
                ctx.fillStyle = activeColor === "#EBB63F" || activeColor === "#D97706" || activeColor === "#F59E0B"
                  ? `rgba(245, 158, 11, ${opacity * 0.05 + (fIdx % 2 === 0 ? 0.02 : 0)})`
                  : activeColor === "#10B981" || activeColor === "#073B31" || activeColor === "#14B8A6"
                  ? `rgba(16, 185, 129, ${opacity * 0.05 + (fIdx % 2 === 0 ? 0.02 : 0)})`
                  : activeColor === "#38BDF8" || activeColor === "#3B82F6" || activeColor === "#06B6D4"
                  ? `rgba(56, 189, 248, ${opacity * 0.05 + (fIdx % 2 === 0 ? 0.02 : 0)})`
                  : `rgba(139, 92, 246, ${opacity * 0.05 + (fIdx % 2 === 0 ? 0.02 : 0)})`;

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.closePath();
                ctx.fill();
              }
            });
          }
        }
      });

      animationId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [dimensions]);

  const bgColors = {
    dark: "#02120f",      // Rich Imperial Dark Teal
    light: "#F8FAF9",     // Bright Business
    cosmic: "#070514",    // Cosmic Purple
    luxury: "#170D0B",    // Sunset Luxury
  };

  const radialOverlays = {
    dark: "radial-gradient(circle at 50% 35%, rgba(13, 92, 78, 0.45) 0%, rgba(235, 182, 63, 0.1) 32%, rgba(2, 18, 15, 0.94) 75%, rgba(1, 10, 8, 0.99) 100%)",
    light: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.88) 0%, rgba(242, 246, 244, 0.94) 100%)",
    cosmic: "radial-gradient(circle at 50% 50%, rgba(13, 11, 30, 0.4) 0%, rgba(7, 5, 20, 0.98) 85%)",
    luxury: "radial-gradient(circle at 50% 50%, rgba(35, 21, 18, 0.45) 0%, rgba(23, 13, 11, 0.98) 85%)",
  };

  const canvasOpacities = {
    dark: "opacity-[0.46]",
    light: "opacity-[0.62]",
    cosmic: "opacity-[0.48]",
    luxury: "opacity-[0.35]",
  };

  return (
    <div
      id="3d-moving-background-full"
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 transition-colors duration-1000"
      style={{ backgroundColor: bgColors[theme] }}
    >
      {/* Subtle radial dark overlay to dim center and vignette edges for excellent readability */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 transition-all duration-1000"
        style={{
          background: radialOverlays[theme]
        }}
      />
      <canvas
        ref={canvasRef}
        className={`w-full h-full block relative z-0 transition-opacity duration-1000 ${canvasOpacities[theme]}`}
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}
