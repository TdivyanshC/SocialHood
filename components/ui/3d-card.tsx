"use client";

import React, { ReactNode, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface CardItemProps {
  as?: React.ElementType;
  children: ReactNode;
  className?: string;
  translateZ?: number | string;
  [key: string]: any;
}

export function CardItem({
  as: Component = "div",
  children,
  className = "",
  translateZ = 0,
  ...props
}: CardItemProps) {
  return (
    <Component
      className={cn("relative w-full", className)}
      style={{
        transform: `translateZ(${translateZ}px)`,
        transformStyle: "preserve-3d",
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

interface CardContainerProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function CardContainer({ 
  children, 
  className = "", 
  containerClassName = "" 
}: CardContainerProps) {
  return (
    <div 
      className={cn("relative", containerClassName)}
      style={{
        perspective: "1000px",
      }}
    >
      <div 
        className={cn("relative", className)}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = "" }: CardBodyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "bg-gray-50 relative group/card dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto h-auto rounded-xl border p-0 overflow-hidden",
        "transition-all duration-200 ease-out",
        isHovered ? "[transform-style:preserve-3d]" : "",
        className
      )}
      style={{
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}
