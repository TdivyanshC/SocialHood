"use client";

import React, { ReactNode, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface CardItemProps {
  as?: React.ElementType;
  children: ReactNode;
  className?: string;
  translateZ?: number | string;
  translateX?: number | string;
  translateY?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  [key: string]: any;
}

export function CardItem({
  as: Component = "div",
  children,
  className = "",
  translateZ = 0,
  translateX = 0,
  translateY = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...props
}: CardItemProps) {
  return (
    <Component
      className={cn("relative w-full", className)}
      style={{
        transform: `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
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
        perspective: "2000px",
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
    
    // More pronounced rotation
    const rotateX = ((y - centerY) / centerY) * -20;
    const rotateY = ((x - centerX) / centerX) * 20;
    
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
        "bg-gray-50 relative group/card dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto h-auto rounded-2xl border p-0 overflow-hidden",
        "transition-all duration-300 ease-out",
        isHovered ? "[transform-style:preserve-3d]" : "",
        className
      )}
      style={{
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transformStyle: "preserve-3d",
        perspective: "2000px",
      }}
    >
      {children}
    </div>
  );
}

// ThreeDCardDemo - Example component showing how to use the 3D card
export function ThreeDCardDemo() {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          Make things float in air
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          Hover over this card to unleash the power of CSS perspective
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop"
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-20">
          <CardItem
            translateZ={20}
            as="a"
            href="https://twitter.com/mannupaaji"
            target="__blank"
            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
          >
            Try now →
          </CardItem>
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            Sign up
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
