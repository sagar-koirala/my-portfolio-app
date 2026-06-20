"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { ParsedExperience } from "./TimelineRail";
import TimelineNode from "./TimelineNode";

interface TimelineCanvasProps {
  experiences: ParsedExperience[];
  activeId: string | null;
  setActiveId: (id: string) => void;
  minYear: number;
  maxYear: number;
  viewportCenterYear: number;
  setViewportCenterYear: (yr: number) => void;
  zoomDuration: number;
  shouldAnimate: boolean;
  setShouldAnimate: (b: boolean) => void;
}

const centerlineY = 18;
const paddingX = 60;

// SVG Bezier path curve generator for connection wires
const getBezierPath = (startX: number, startY: number, endX: number, endY: number) => {
  const dx = endX - startX;
  const dy = Math.abs(endY - startY);
  // Increase roundness cap to 40px, but constrain by half of dx and full of dy to prevent overshooting
  const R = Math.min(40, Math.abs(dx) / 2, dy);
  
  if (Math.abs(dx) < 1) {
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  }

  const signX = dx > 0 ? 1 : -1;
  const turnX = endX - R * signX;
  const curveEndY = startY - R;

  return `M ${startX} ${startY} L ${turnX} ${startY} Q ${endX} ${startY}, ${endX} ${curveEndY} L ${endX} ${endY}`;
};

// Spring configuration: slightly more damped for organic heavy physics
const springConfig = {
  type: "spring" as const,
  stiffness: 85,
  damping: 22,
};

export default function TimelineCanvas({
  experiences,
  activeId,
  setActiveId,
  minYear,
  maxYear,
  viewportCenterYear,
  setViewportCenterYear,
  zoomDuration,
  shouldAnimate,
  setShouldAnimate,
}: TimelineCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Motion values for smooth 60fps spring transitions of scroll & zoom
  const currentCenterYear = useMotionValue(viewportCenterYear);
  const currentZoomDuration = useMotionValue(zoomDuration);
  const [, setRenderTrigger] = useState(0);

  // Trigger state update and re-render on motion value changes
  useEffect(() => {
    const unsub1 = currentCenterYear.on("change", () => setRenderTrigger((v) => v + 1));
    const unsub2 = currentZoomDuration.on("change", () => setRenderTrigger((v) => v + 1));
    return () => {
      unsub1();
      unsub2();
    };
  }, [currentCenterYear, currentZoomDuration]);



  useEffect(() => {
    if (shouldAnimate) {
      const controls1 = animate(currentCenterYear, viewportCenterYear, springConfig);
      const controls2 = animate(currentZoomDuration, zoomDuration, springConfig);
      return () => {
        controls1.stop();
        controls2.stop();
      };
    } else {
      currentCenterYear.set(viewportCenterYear);
      currentZoomDuration.set(zoomDuration);
    }
  }, [viewportCenterYear, zoomDuration, shouldAnimate, currentCenterYear, currentZoomDuration]);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const animCenter = currentCenterYear.get();
  const animZoom = currentZoomDuration.get();
  const absRange = maxYear - minYear;

  const visibleMinYear = animCenter - animZoom / 2;

  const visibleWidth = containerWidth > 0 ? containerWidth - paddingX * 2 : 1400;
  const canvasWidth = visibleWidth * (absRange / animZoom) + paddingX * 2;

  const ratio = (visibleMinYear - minYear) / absRange;
  const scrollableCanvasWidth = canvasWidth - paddingX * 2;
  const canvasX = containerWidth > 0 ? -(ratio * scrollableCanvasWidth) : 0;

  const getXFromYear = useCallback((year: number) => {
    if (containerWidth <= 0) return 0;
    const ratioVal = (year - minYear) / absRange;
    return paddingX + ratioVal * (canvasWidth - paddingX * 2);
  }, [containerWidth, canvasWidth, minYear, absRange]);

  // Clamp helper to ensure viewport center does not pan out of bounds
  const clampCenterYear = useCallback((center: number, duration: number) => {
    const half = duration / 2;
    const lowest = minYear + half;
    const highest = maxYear - half;
    if (lowest > highest) return minYear + absRange / 2;
    return Math.max(lowest, Math.min(highest, center));
  }, [minYear, maxYear, absRange]);

  // Warps a flat viewport coordinate into a subtle 3D circular/cylindrical coordinate system.
  // Returns { x, y, scale, z, opacity, rotateY, t }
  const getCircularCoords = useCallback((flatViewportX: number, baseViewportY: number) => {
    if (containerWidth <= 0) {
      return { x: flatViewportX, y: baseViewportY, scale: 1, z: 1, opacity: 1, rotateY: 0, t: 0 };
    }
    const X_center = containerWidth / 2;
    const halfW = containerWidth / 2;
    const dx = flatViewportX - X_center;
    const t = dx / halfW;

    // Clamp t to prevent wrap-around at extreme scroll distances
    const t_clamped = Math.max(-1.3, Math.min(1.3, t));

    // Map to angle from -75 to +75 degrees
    const maxAngle = Math.PI / 2.4; 
    const theta = t_clamped * maxAngle;

    // 1. Perspective spacing (subtle horizontal compression near edges)
    const sinVal = Math.sin(theta);
    const x = X_center + halfW * sinVal;

    // 2. Depth factor
    const z = Math.cos(theta); // 1 at center, ~0.26 at t_clamped = 1.2

    // 3. Vertical curvature (subtle bend downward, max 6px depth)
    const verticalCurvature = 6 * (1 - z);
    const y = baseViewportY + verticalCurvature;

    // 4. Perspective Scale (subtle, ranges from 0.90 to 1.0)
    const scale = 0.90 + 0.10 * z;

    // 5. Opacity fadeout near the very edges
    const rawOpacity = Math.max(0, (z - 0.25) / 0.75);
    const opacity = Math.min(1, rawOpacity);

    // 6. 3D Y-rotation to face the viewport center (subtle, max 8 degrees)
    const rotateY = t_clamped * 8;

    return { x, y, scale, z, opacity, rotateY, t };
  }, [containerWidth]);

  const getRailPath = () => {
    let d = "";
    const segments = 40;
    for (let i = 0; i <= segments; i++) {
      const px = (i / segments) * containerWidth;
      const warped = getCircularCoords(px, centerlineY);
      if (i === 0) {
        d += `M ${warped.x} ${warped.y}`;
      } else {
        d += ` L ${warped.x} ${warped.y}`;
      }
    }
    return d;
  };

  const connectionPaths = experiences.map((exp) => {
    const centerYear = exp.yearStart + (exp.yearEnd - exp.yearStart) / 2;
    const midX = getXFromYear(centerYear);
    const cardY = centerlineY + exp.yOffset;
    const cardWidth = 48; // TimelineNode w-12 width

    // Compute viewport flat coordinates
    const flatNodeViewportX = midX + canvasX;
    
    // Get warped coordinates for the node center
    const warpedNode = getCircularCoords(flatNodeViewportX, cardY);

    const cardLeftX = warpedNode.x - (cardWidth / 2) * warpedNode.scale;
    const cardRightX = warpedNode.x + (cardWidth / 2) * warpedNode.scale;

    // Anchors on the timeline rail
    const anchorStartXViewport = getXFromYear(exp.yearStart) + canvasX;
    const anchorEndXViewport = getXFromYear(exp.yearEnd) + canvasX;
    const anchorY = centerlineY;

    // Get warped coordinates for anchors on the rail
    const warpedLeftAnchor = getCircularCoords(anchorStartXViewport, anchorY);
    const warpedRightAnchor = getCircularCoords(anchorEndXViewport, anchorY);

    // We use the warped values to generate bezier paths
    const pathLeft = getBezierPath(cardLeftX, warpedNode.y, warpedLeftAnchor.x, warpedLeftAnchor.y);
    const pathRight = getBezierPath(cardRightX, warpedNode.y, warpedRightAnchor.x, warpedRightAnchor.y);

    return {
      id: exp.id,
      pathLeft,
      pathRight,
      warpedNode,
      warpedLeftAnchor,
      warpedRightAnchor,
      type: exp.internalCategory,
      isActive: activeId === exp.id,
      isAnyActive: activeId !== null,
      centerYear,
      yOffset: exp.yOffset,
    };
  });

  // --- Interaction Event Handlers ---
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startCenterYearRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startCenterYearRef.current = animCenter;
    setShouldAnimate(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    const pxWidth = canvasWidth - paddingX * 2;
    if (pxWidth <= 0) return;
    const yearDelta = -(dx / pxWidth) * absRange;
    
    const newCenter = clampCenterYear(startCenterYearRef.current + yearDelta, animZoom);
    setViewportCenterYear(newCenter);
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      startXRef.current = e.touches[0].clientX;
      startCenterYearRef.current = animCenter;
      setShouldAnimate(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - startXRef.current;
    const pxWidth = canvasWidth - paddingX * 2;
    if (pxWidth <= 0) return;
    const yearDelta = -(dx / pxWidth) * absRange;
    
    const newCenter = clampCenterYear(startCenterYearRef.current + yearDelta, animZoom);
    setViewportCenterYear(newCenter);
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Only react to horizontal scrolling
    if (e.deltaX === 0) return;

    setShouldAnimate(false);
    const yearDelta = (e.deltaX / 800) * animZoom;
    setViewportCenterYear(clampCenterYear(animCenter + yearDelta, animZoom));
  };

  const renderTimelineScale = () => {
    const scaleElements = [];
    const showMonths = animZoom <= 2.05;

    for (let year = Math.floor(minYear); year <= Math.ceil(maxYear); year++) {
      for (let m = 0; m < 12; m++) {
        const yearVal = year + m / 12;
        if (yearVal < minYear || yearVal > maxYear) continue;

        const x = getXFromYear(yearVal);
        const viewportX = x + canvasX;
        const warped = getCircularCoords(viewportX, centerlineY);
        const isYear = m === 0;

        if (isYear) {
          scaleElements.push(
            <div
              key={`scale-y-${year}`}
              className="absolute flex items-center justify-center pointer-events-none"
              style={{
                left: `${warped.x}px`,
                top: `${warped.y}px`,
                transform: `translateX(-50%) translateY(-50%) scale(${warped.scale})`,
                opacity: warped.opacity,
              }}
            >
              <motion.span 
                animate={{
                  color: showMonths ? "var(--timeline-text-active)" : "var(--timeline-text-inactive)",
                  fontWeight: showMonths ? 800 : 700
                }}
                transition={{ duration: 0.3 }}
                className="font-mono text-[10px] tracking-wider select-none"
              >
                {year}
              </motion.span>
            </div>
          );
        } else {
          const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
          scaleElements.push(
            <motion.div
              key={`scale-m-${year}-${m}`}
              initial={false}
              animate={{ 
                opacity: showMonths ? warped.opacity : 0
              }}
              transition={{ duration: 0.2 }}
              className="absolute flex items-center justify-center pointer-events-none"
              style={{
                left: `${warped.x}px`,
                top: `${warped.y}px`,
                transform: `translateX(-50%) translateY(-50%) scale(${warped.scale})`,
              }}
            >
              <span 
                className="font-mono text-[8px] font-bold tracking-wider select-none"
                style={{ color: "var(--timeline-text-inactive)" }}
              >
                {months[m]}
              </span>
            </motion.div>
          );
        }
      }
    }

    return scaleElements;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      className="w-full h-[180px] md:h-[240px] bg-transparent relative select-none overflow-hidden cursor-grab active:cursor-grabbing"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        touchAction: "pan-y"
      }}
    >
      {/* Blurred Ends Overlays dynamically matched to page background */}
      <div 
        className="absolute inset-y-0 left-0 w-[20%] pointer-events-none z-20" 
        style={{
          background: "linear-gradient(to right, var(--background), transparent)"
        }}
      />
      <div 
        className="absolute inset-y-0 right-0 w-[20%] pointer-events-none z-20" 
        style={{
          background: "linear-gradient(to left, var(--background), transparent)"
        }}
      />

      {/* Render scale ticks directly on the warped curved rail */}
      {containerWidth > 0 && (
        <div className="absolute inset-0 pointer-events-none z-10" style={{ transformStyle: "preserve-3d" }}>
          {renderTimelineScale()}
        </div>
      )}

      {containerWidth > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
          <defs>
            {connectionPaths.map((wire) => (
              <linearGradient
                key={`grad-${wire.id}`}
                id={`grad-${wire.id}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                {/* Starts from the matching color of the timeline rail and gradually reaches active wire color */}
                <stop offset="0%" stopColor="var(--timeline-rail-active)" />
                <stop offset="100%" stopColor="var(--timeline-wire-active)" />
              </linearGradient>
            ))}
          </defs>
 
          {/* Background Curved Timeline Rail (Track) */}
          <path
            d={getRailPath()}
            fill="none"
            stroke={activeId ? "var(--timeline-rail-active)" : "var(--timeline-rail-inactive)"}
            strokeWidth={14}
            className="transition-colors duration-300"
          />
 
 
          {connectionPaths.map((wire) => {
            const dashArray = wire.type === "part" ? "6, 4" : undefined;

            return (
              <g key={`wire-${wire.id}`} className="transition-all duration-300" style={{ opacity: wire.warpedNode.opacity }}>
                {/* Left Wire - Base Track */}
                <motion.path
                  d={wire.pathLeft}
                  fill="none"
                  initial={{ stroke: "var(--timeline-wire-inactive)", strokeWidth: 1.5 }}
                  animate={{
                    stroke: wire.isAnyActive ? "var(--timeline-wire-any-active)" : "var(--timeline-wire-inactive)",
                    strokeWidth: 1.5,
                  }}
                  transition={springConfig}
                  strokeDasharray={dashArray}
                />
                {/* Left Wire - Active Gradient Overlay */}
                <motion.path
                  d={wire.pathLeft}
                  fill="none"
                  stroke={`url(#grad-${wire.id})`}
                  initial={{ opacity: 0, strokeWidth: 1.5 }}
                  animate={{
                    opacity: wire.isActive ? 1 : 0,
                    strokeWidth: wire.isActive ? 2.5 : 1.5,
                  }}
                  transition={springConfig}
                  strokeDasharray={dashArray}
                />
 
                {/* Right Wire - Base Track */}
                <motion.path
                  d={wire.pathRight}
                  fill="none"
                  initial={{ stroke: "var(--timeline-wire-inactive)", strokeWidth: 1.5 }}
                  animate={{
                    stroke: wire.isAnyActive ? "var(--timeline-wire-any-active)" : "var(--timeline-wire-inactive)",
                    strokeWidth: 1.5,
                  }}
                  transition={springConfig}
                  strokeDasharray={dashArray}
                />
                {/* Right Wire - Active Gradient Overlay */}
                <motion.path
                  d={wire.pathRight}
                  fill="none"
                  stroke={`url(#grad-${wire.id})`}
                  initial={{ opacity: 0, strokeWidth: 1.5 }}
                  animate={{
                    opacity: wire.isActive ? 1 : 0,
                    strokeWidth: wire.isActive ? 2.5 : 1.5,
                  }}
                  transition={springConfig}
                  strokeDasharray={dashArray}
                />
 
                <motion.circle
                  cx={wire.warpedLeftAnchor.x}
                  cy={wire.warpedLeftAnchor.y}
                  initial={{ r: 8, fill: "var(--timeline-rail-inactive)" }}
                  animate={{
                    r: (wire.isActive ? 9.5 : 8) * wire.warpedLeftAnchor.scale,
                    fill: activeId ? "var(--timeline-rail-active)" : "var(--timeline-rail-inactive)",
                  }}
                  transition={springConfig}
                />
                <motion.circle
                  cx={wire.warpedRightAnchor.x}
                  cy={wire.warpedRightAnchor.y}
                  initial={{ r: 8, fill: "var(--timeline-rail-inactive)" }}
                  animate={{
                    r: (wire.isActive ? 9.5 : 8) * wire.warpedRightAnchor.scale,
                    fill: activeId ? "var(--timeline-rail-active)" : "var(--timeline-rail-inactive)",
                  }}
                  transition={springConfig}
                />
              </g>
            );
          })}
        </svg>
      )}

      {/* Nodes Layer */}
      {containerWidth > 0 && (
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 10, transformStyle: "preserve-3d" }}>
          {connectionPaths.map((wire) => {
            const exp = experiences.find((e) => e.id === wire.id);
            if (!exp) return null;
            
            const isActive = activeId === exp.id;
            const isAnyActive = activeId !== null;
            const selectionOpacity = isActive ? 1 : isAnyActive ? 0.22 : 1;
            const finalOpacity = wire.warpedNode.opacity * selectionOpacity;

            return (
              <motion.div
                key={`node-${wire.id}`}
                initial={false}
                animate={{ 
                  opacity: finalOpacity,
                }}
                transition={springConfig}
                className="absolute"
                style={{
                  left: `${wire.warpedNode.x}px`, 
                  top: `${wire.warpedNode.y}px`,
                  transform: `translate(-50%, -50%) scale(${wire.warpedNode.scale}) rotateY(${wire.warpedNode.rotateY}deg)`,
                  transformStyle: "preserve-3d",
                  zIndex: isActive ? 50 : 10,
                  pointerEvents: finalOpacity < 0.15 ? "none" : "auto",
                }}
              >
                <TimelineNode
                  id={exp.id}
                  company={exp.company}
                  logo={exp.logo}
                  isActive={isActive}
                  onClick={() => {
                    setShouldAnimate(true);
                    setActiveId(exp.id);
                  }}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
